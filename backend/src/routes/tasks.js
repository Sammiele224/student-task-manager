import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

const formatISO = (dateStr) => {
  if (!dateStr) return null
  return dateStr.replace(' ', 'T') + '+07:00'
}

const VALID_PRIORITIES = ['low', 'medium', 'high']
const VALID_STATUSES = ['todo', 'in_progress', 'done']

const isValidPriority = (value) => VALID_PRIORITIES.includes(value)
const isValidStatus = (value) => VALID_STATUSES.includes(value)

/* The columns every task response carries, so one task looks the same whether
   it was just listed, created, updated or ticked off. */
const TASK_SELECT = `
  SELECT
    t.id, t.title, t.description, t.due_date AS dueDate,
    t.priority, t.status, t.created_at AS createdAt, t.completed_at AS completedAt,
    c.id AS courseId, c.name AS courseName, c.code AS courseCode, c.color AS courseColor,
    (t.due_date < CURDATE() AND t.status != 'done') AS isOverdue
  FROM tasks t
  JOIN courses c ON t.course_id = c.id
`

/** Shapes one row the way every task response does. */
const formatTask = (row) => ({
  ...row,
  isOverdue: !!row.isOverdue,
  createdAt: formatISO(row.createdAt),
  completedAt: formatISO(row.completedAt)
})

/**
 * Reads a task back after a write, so the API answers with the saved task
 * rather than a bare id or a message. Scoped to the owner, like every query.
 */
async function findTask(id, userId) {
  const [rows] = await pool.query(`${TASK_SELECT} WHERE t.id = ? AND c.user_id = ?`, [id, userId])
  return rows[0] ? formatTask(rows[0]) : null
}
const isValidDateFormat = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)

/**
 * GET /api/v1/tasks
 * Supports query params: search, courseId, status, priority, sort, order
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, courseId, status, priority, sort = 'dueDate', order = 'asc' } = req.query
    
    let query = `
      SELECT 
        t.id, t.title, t.description, t.due_date AS dueDate, 
        t.priority, t.status, t.created_at AS createdAt, t.completed_at AS completedAt,
        c.id AS courseId, c.name AS courseName, c.code AS courseCode, c.color AS courseColor,
        -- Calculate overdue directly in SQL based on Vietnam Time (CURDATE)
        (t.due_date < CURDATE() AND t.status != 'done') AS isOverdue
      FROM tasks t
      JOIN courses c ON t.course_id = c.id
      WHERE c.user_id = ?
    `
    const params = [req.user.id]

    if (search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }
    if (courseId) {
      query += ` AND t.course_id = ?`
      params.push(courseId)
    }
    if (status) {
      query += ` AND t.status = ?`
      params.push(status)
    }
    if (priority) {
      query += ` AND t.priority = ?`
      params.push(priority)
    }

    // Dynamic sorting
    const validSorts = {
      dueDate: 't.due_date',
      priority: `FIELD(t.priority, 'high', 'medium', 'low')`, 
      createdAt: 't.created_at'
    }
    const sortField = validSorts[sort] || validSorts.dueDate
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
    
    query += ` ORDER BY ${sortField} ${sortOrder}, t.id ASC`

    const [rows] = await pool.query(query, params)

    const formattedRows = rows.map(row => ({
      ...row,
      isOverdue: !!row.isOverdue,
      createdAt: formatISO(row.createdAt),
      completedAt: formatISO(row.completedAt)
    }))

    res.json({ success: true, data: formattedRows })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/v1/tasks/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const task = await findTask(req.params.id, req.user.id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, data: task })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/v1/tasks
 */
router.post('/', async (req, res, next) => {
  try {
    const { courseId, title, description, dueDate, priority = 'medium', status = 'todo' } = req.body

    if (!courseId || !title?.trim() || !dueDate) {
      return res.status(400).json({ success: false, message: 'courseId, title, and dueDate are required.' })
    }

        if (!isValidDateFormat(dueDate)) {
      return res.status(400).json({ success: false, message: 'dueDate must use YYYY-MM-DD format.' })
    }

    if (!isValidPriority(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority value.' })
    }

    if (!isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }


    const [courseRows] = await pool.query(
      `SELECT id FROM courses WHERE id = ? AND user_id = ?`,
      [courseId, req.user.id]
    )
    if (courseRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }

    // due to schema check constraint, if inserting a 'done' task immediately, 
    // it MUST have a completed_at timestamp.
    const completedAt = status === 'done' ? new Date() : null

    const query = `
      INSERT INTO tasks (course_id, title, description, due_date, priority, status, completed_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await pool.query(query, [
      courseId, title.trim(), description?.trim() || null, dueDate, priority, status, completedAt
    ])

    res.status(201).json({
      success: true,
      data: await findTask(result.insertId, req.user.id)
    })
  } catch (error) {
    // Handle invalid courseId (Foreign Key constraint violation)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'The provided courseId does not exist.' })
    }
    next(error)
  }
})

/**
 * PUT /api/v1/tasks/:id
 * Full update. respect  `chk_tasks_completion` constraint.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { courseId, title, description, dueDate, priority, status } = req.body

    if (!courseId || !title?.trim() || !dueDate || !priority || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required for a PUT update.' })
    }

    if (!isValidDateFormat(dueDate)) {
      return res.status(400).json({ success: false, message: 'dueDate must use YYYY-MM-DD format.' })
    }

    if (!isValidPriority(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority value.' })
    }

    if (!isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    const [courseRows] = await pool.query(
      `SELECT id FROM courses WHERE id = ? AND user_id = ?`,
      [courseId, req.user.id]
    )
    if (courseRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }

    // completed_at is assigned BEFORE status on purpose. MySQL applies SET
    // clauses left to right and later ones see the values already written, so
    // with status first the CASE below compares the new status against itself:
    // marking a task done would leave completed_at NULL and trip
    // chk_tasks_completion. Reading the old status keeps the first completion
    // time and only clears it when the task leaves 'done'.
    const query = `
      UPDATE tasks AS t
      JOIN courses AS c ON c.id = t.course_id
      SET completed_at = CASE 
            WHEN ? = 'done' AND status != 'done' THEN CURRENT_TIMESTAMP
            WHEN ? != 'done' THEN NULL
            ELSE completed_at 
          END,
          course_id = ?, title = ?, description = ?, due_date = ?, priority = ?, status = ?
      WHERE t.id = ? AND c.user_id = ?
    `
    const [result] = await pool.query(query, [
      status, status,
      courseId, title.trim(), description?.trim() || null, dueDate, priority, status,
      req.params.id, req.user.id
    ])

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, data: await findTask(req.params.id, req.user.id) })
  } catch (error) {
    // Handle invalid courseId (Foreign Key constraint violation)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'The provided courseId does not exist.' })
    }
    next(error)
  }
})

/**
 * PATCH /api/v1/tasks/:id/status
 * Updates ONLY status. Essential for "mark as done" checklist UI.
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body
    if (!isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    // Same CASE and same ordering as the full update above, so a task's
    // completion time does not depend on which endpoint set its status.
    // Re-selecting 'done' on a finished task must not restamp it.
    const query = `
      UPDATE tasks AS t
      JOIN courses AS c ON c.id = t.course_id
      SET completed_at = CASE 
            WHEN ? = 'done' AND status != 'done' THEN CURRENT_TIMESTAMP
            WHEN ? != 'done' THEN NULL
            ELSE completed_at 
          END,
          status = ?
      WHERE t.id = ? AND c.user_id = ?
    `
    const [result] = await pool.query(query, [status, status, status, req.params.id, req.user.id])

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, data: await findTask(req.params.id, req.user.id) })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/v1/tasks/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `DELETE t FROM tasks AS t
       JOIN courses AS c ON c.id = t.course_id
       WHERE t.id = ? AND c.user_id = ?`,
      [req.params.id, req.user.id]
    )
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
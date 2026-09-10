import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

const formatISO = (dateStr) => {
  if (!dateStr) return null
  return dateStr.replace(' ', 'T') + '+07:00'
}

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
      WHERE 1=1
    `
    const params = []

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
    const query = `
      SELECT 
        t.id, t.title, t.description, t.due_date AS dueDate, 
        t.priority, t.status, t.created_at AS createdAt, t.completed_at AS completedAt,
        c.id AS courseId, c.name AS courseName, c.code AS courseCode, c.color AS courseColor,
        (t.due_date < CURDATE() AND t.status != 'done') AS isOverdue
      FROM tasks t
      JOIN courses c ON t.course_id = c.id
      WHERE t.id = ?
    `
    const [rows] = await pool.query(query, [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    const row = rows[0]
    res.json({
      success: true,
      data: {
        ...row,
        isOverdue: !!row.isOverdue,
        createdAt: formatISO(row.createdAt),
        completedAt: formatISO(row.completedAt)
      }
    })
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

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
    if (dueDate < today) {
        return res.status(400).json({ success: false, message: 'Due date cannot be in the past.' }) 
    }

    // Because of the schema check constraint, if inserting a 'done' task immediately, 
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
      data: { id: result.insertId, title: title.trim(), status }
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

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
    if (dueDate < today) {
        return res.status(400).json({ success: false, message: 'Due date cannot be in the past.' }) 
    }

    const query = `
      UPDATE tasks 
      SET course_id = ?, title = ?, description = ?, due_date = ?, priority = ?, status = ?,
          completed_at = CASE 
            WHEN ? = 'done' AND status != 'done' THEN CURRENT_TIMESTAMP
            WHEN ? != 'done' THEN NULL
            ELSE completed_at 
          END
      WHERE id = ?
    `
    const [result] = await pool.query(query, [
      courseId, title.trim(), description?.trim() || null, dueDate, priority, status, 
      status, status, req.params.id
    ])

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, message: 'Task updated successfully' })
  } catch (error) {
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
    if (!['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    const query = `
      UPDATE tasks 
      SET status = ?,
          completed_at = CASE 
            WHEN ? = 'done' THEN CURRENT_TIMESTAMP
            ELSE NULL 
          END
      WHERE id = ?
    `
    const [result] = await pool.query(query, [status, status, req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, message: `Task status updated to ${status}` })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/v1/tasks/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query(`DELETE FROM tasks WHERE id = ?`, [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Task not found' })

    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Matches the first swatch the course form offers.
const DEFAULT_COURSE_COLOR = '#38846B'

// Helper function to format MySQL DATETIME to +07:00 ISO string
const formatCreatedAt = (dateStr) => {
  if (!dateStr) return null
  return dateStr.replace(' ', 'T') + '+07:00'
}

/**
 * GET /api/v1/courses
 * Returns all courses with camelCase properties, including a taskCount.
 */
router.get('/', async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.id, c.name, c.code, c.color, c.created_at AS createdAt,
        COUNT(t.id) AS taskCount,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) AS completedTaskCount
      FROM courses c
      LEFT JOIN tasks t ON c.id = t.course_id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `
    const [rows] = await pool.query(query, [req.user.id])

    const formattedRows = rows.map(row => ({
      ...row,
      taskCount: Number(row.taskCount), 
      completedTaskCount: Number(row.completedTaskCount),
      createdAt: formatCreatedAt(row.createdAt)
    }))

    res.json({ success: true, data: formattedRows })
  } catch (error) {
    next(error)
  }
})


/**
 * POST /api/v1/courses
 * Create a new course
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, code, color } = req.body

    // basic validation
    if (!name?.trim() || !code?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course name and code are required.' 
      })
    }

    const insertQuery = `INSERT INTO courses (user_id, name, code, color) VALUES (?, ?, ?, ?)`
    const [result] = await pool.query(insertQuery, [
      req.user.id,
      name.trim(), 
      code.trim(), 
      color?.trim() || DEFAULT_COURSE_COLOR
    ])

    const [rows] = await pool.query(
      `SELECT id, name, code, color, created_at AS createdAt FROM courses WHERE id = ? AND user_id = ?`, 
      [result.insertId, req.user.id]
    )

    res.status(201).json({
      success: true,
      data: {
        ...rows[0],
        taskCount: 0,          
        completedTaskCount: 0,
        createdAt: formatCreatedAt(rows[0].createdAt)
      }
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: `Course code '${req.body.code}' already exists.` 
      })
    }
    next(error)
  }
})

/**
 * PUT /api/v1/courses/:id
 * Update an existing course
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, code, color } = req.body

    if (!name?.trim() || !code?.trim() || !color?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, code, and color are required for updates.' 
      })
    }
    
    // update course in database
    const updateQuery = `UPDATE courses SET name = ?, code = ?, color = ? WHERE id = ? AND user_id = ?`
    const [result] = await pool.query(updateQuery, [name.trim(), code.trim(), color.trim(), id, req.user.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }
    
    // fetch the updated course to return in the response
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.code, c.color, c.created_at AS createdAt, COUNT(t.id) AS taskCount
      FROM courses c
      LEFT JOIN tasks t ON t.course_id = c.id
      WHERE c.id = ? AND c.user_id = ?
      GROUP BY c.id`,
      [id, req.user.id]

    )

    res.json({
      success: true,
      data: {
        ...rows[0],
        taskCount: Number(rows[0].taskCount),
        createdAt: formatCreatedAt(rows[0].createdAt)
      }
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: `Course code '${req.body.code}' is already in use by another course.` 
      })
    }
    next(error)
  }
})

/**
 * DELETE /api/v1/courses/:id
 * Delete a course together with every task in it.
 *
 * The schema keeps ON DELETE RESTRICT on tasks.course_id, so a stray DELETE
 * elsewhere still can't drop a course's tasks by accident. This route removes
 * them on purpose, first, inside one transaction: either the course and all its
 * tasks go, or nothing does.
 */
router.delete('/:id', async (req, res, next) => {
  const connection = await pool.getConnection()

  try {
    const { id } = req.params

    await connection.beginTransaction()

    // Lock the course row, and only if it belongs to this user, so no task can
    // be added to it between counting and deleting.
    const [courses] = await connection.query(
      `SELECT id FROM courses WHERE id = ? AND user_id = ? FOR UPDATE`,
      [id, req.user.id]
    )

    if (courses.length === 0) {
      await connection.rollback()
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }

    const [taskResult] = await connection.query(
      `DELETE FROM tasks WHERE course_id = ?`,
      [id]
    )

    await connection.query(
      `DELETE FROM courses WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    )

    await connection.commit()

    res.json({
      success: true,
      message: 'Course deleted successfully.',
      data: { id: Number(id), deletedTaskCount: taskResult.affectedRows }
    })
  } catch (error) {
    await connection.rollback().catch(() => {})
    next(error)
  } finally {
    connection.release()
  }
})


export default router
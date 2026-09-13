import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

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
        COUNT(t.id) AS taskCount
      FROM courses c
      LEFT JOIN tasks t ON c.id = t.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `
    const [rows] = await pool.query(query)

    const formattedRows = rows.map(row => ({
      ...row,
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

    const insertQuery = `INSERT INTO courses (name, code, color) VALUES (?, ?, ?)`
    const [result] = await pool.query(insertQuery, [
      name.trim(), 
      code.trim(), 
      color?.trim() || 'green'
    ])

    const [rows] = await pool.query(
      `SELECT id, name, code, color, created_at AS createdAt FROM courses WHERE id = ?`, 
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      data: {
        ...rows[0],
        taskCount: 0,
        createdAt: formatCreatedAt(rows[0].createdAt)
      }
    })
  } catch (error) {
    // Handle MySQL unique constraint violation for course code
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
    const updateQuery = `UPDATE courses SET name = ?, code = ?, color = ? WHERE id = ?`
    const [result] = await pool.query(updateQuery, [name.trim(), code.trim(), color.trim(), id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }
    
    // fetch the updated course to return in the response
    const [rows] = await pool.query(
      `SELECT
        c.id,
        c.name,
        c.code,
        c.color,
        c.created_at AS createdAt,
        COUNT(t.id) AS taskCount
      FROM courses c
      LEFT JOIN tasks t ON t.course_id = c.id
      WHERE c.id = ?
      GROUP BY c.id`,
      [id]
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
 * Delete a course (blocked if tasks are attached)
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(`DELETE FROM courses WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' })
    }

    res.json({
      success: true,
      message: 'Course deleted successfully.'
    })
  } catch (error) {
    // catch FK `ON DELETE RESTRICT` constraint violation
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      // find out exactly how many tasks are blocking deletion 
      const [taskRows] = await pool.query(
        `SELECT COUNT(*) as count FROM tasks WHERE course_id = ?`, 
        [req.params.id]
      )
      const count = taskRows[0].count
      return res.status(409).json({
        success: false,
        message: `Cannot delete course: ${count} task(s) are currently linked to it.`
      })
    }
    next(error)
  }
})


export default router
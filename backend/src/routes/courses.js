import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

/**
 * GET /api/v1/courses
 * Returns all courses with camelCase properties, including a taskCount.
 */
router.get('/', async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.code, 
        c.color, 
        c.created_at AS createdAt,
        COUNT(t.id) AS taskCount
      FROM courses c
      LEFT JOIN tasks t ON c.id = t.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `
    
    const [rows] = await pool.query(query)

    // Because `dateStrings: true` is on, createdAt is a string like "2026-09-09 10:00:00".
    //  format it to a proper +07:00 ISO string for frontend
    const formattedRows = rows.map(row => {
      // Replace space with T and append +07:00
      const isoDate = row.createdAt ? row.createdAt.replace(' ', 'T') + '+07:00' : null
      return {
        ...row,
        createdAt: isoDate
      }
    })

    res.json({
      success: true,
      data: formattedRows
    })
  } catch (error) {
    next(error) 
  }
})

export default router
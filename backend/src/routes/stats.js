import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

/**
 * GET /api/v1/stats
 * Dashboard metrics: total tasks, completed, overdue, due this week, and completion rate
 */
router.get('/', async (req, res, next) => {
  try {
    const query = `
      SELECT 
        COUNT(*) AS totalTasks,
        
        -- how many are done
        CAST(COALESCE(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS completedCount,
        
        --  how many are overdue (before today in VN time, not done)
        CAST(COALESCE(SUM(CASE WHEN due_date < CURDATE() AND status != 'done' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS overdueCount,
        
        -- how many are due THIS week (Monday to Sunday) and not done
        -- YEARWEEK(..., 1) treats Monday as the first day of the week
        CAST(COALESCE(SUM(CASE WHEN YEARWEEK(due_date, 1) = YEARWEEK(CURDATE(), 1) AND status != 'done' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS dueThisWeekCount
      FROM tasks
    `
    const [rows] = await pool.query(query)
    const stats = rows[0]

    // Calculate completion rate safely in Node
    const total = Number(stats.totalTasks)
    const completed = Number(stats.completedCount)
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

    res.json({
      success: true,
      data: {
        totalTasks: total,
        completedCount: completed,
        overdueCount: Number(stats.overdueCount),
        dueThisWeekCount: Number(stats.dueThisWeekCount),
        completionRate 
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router
import { Router } from 'express'
import { pool } from '../../db.js'

/**
 * Version 1 of the API. Everything mounted here is served under /api/v1.
 *
 * Adding a resource: create ./courses.js exporting a Router, then mount it
 * below. Keep paths as plural nouns with no verbs — the HTTP method is the
 * verb.
 */
const router = Router()

router.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', version: 'v1', database: 'connected' })
  } catch (error) {
    res
      .status(503)
      .json({ error: 'Database unreachable', detail: error.message })
  }
})

// Mount resource routers here as they are built, e.g.
//   import coursesRouter from './courses.js'
//   import tasksRouter from './tasks.js'
//   router.use('/courses', coursesRouter)
//   router.use('/tasks', tasksRouter)

export default router

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
const invalidCredentials = 'Invalid email or password'

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const [rows] = await pool.query(
      `SELECT id, name, email, password_hash AS passwordHash
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    )
    const user = rows[0]
    const passwordMatches = user && typeof password === 'string'
      ? await bcrypt.compare(password, user.passwordHash)
      : false

    if (!user || !passwordMatches) {
      return res.status(401).json({ success: false, message: invalidCredentials })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }

    return res.json({ success: true, data: rows[0] })
  } catch (error) {
    next(error)
  }
})

export default router
import jwt from 'jsonwebtoken'

const unauthorized = (res) => {
  res.status(401).json({ success: false, message: 'Authentication required.' })
}

export function authenticate(req, res, next) {
  const authorization = req.get('Authorization')
  const match = authorization?.match(/^Bearer\s+(\S+)$/)
  const token = match?.[1]

  if (!token) {
    return unauthorized(res)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded || typeof decoded !== 'object' || decoded.id == null) {
      return unauthorized(res)
    }

    req.user = { id: decoded.id }
    return next()
  } catch {
    return unauthorized(res)
  }
}
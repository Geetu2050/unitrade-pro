import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Missing token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

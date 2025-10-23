import jwt from 'jsonwebtoken';
import mockDb from '../mock-db.js';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Apply auth middleware
  authenticateToken(req, res, async () => {
    try {
      const transactions = mockDb.getTransactionsByUser(req.user.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transaction history' });
    }
  });
}

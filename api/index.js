// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mockDb from './mock-db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    if (mockDb.findUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = mockDb.createUser({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = mockDb.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Market Routes
app.get('/api/market/overview', (req, res) => {
  try {
    const marketData = mockDb.getMarketData();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
});

// Transaction Routes
app.post('/api/transactions/execute', authenticateToken, (req, res) => {
  try {
    const { type, assetSymbol, quantity, priceAtTransaction } = req.body;

    if (!type || !assetSymbol || !quantity || !priceAtTransaction) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = mockDb.createTransaction({
      user: req.user.userId,
      type,
      assetSymbol,
      quantity: Number(quantity),
      priceAtTransaction: Number(priceAtTransaction)
    });

    res.status(201).json({
      message: 'Transaction executed successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute transaction' });
  }
});

app.get('/api/transactions/history', authenticateToken, (req, res) => {
  try {
    const transactions = mockDb.getTransactionsByUser(req.user.userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
});

// Wallet Routes
app.get('/api/user/wallet', authenticateToken, (req, res) => {
  try {
    const wallet = mockDb.calculateWallet(req.user.userId);
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate wallet' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Backend is healthy' });
});

// Export the Express app as a Vercel serverless function
export default app;

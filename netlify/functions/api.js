// Netlify serverless function for API routes
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simple in-memory database for Netlify
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.nextUserId = 1;
    this.nextTransactionId = 1;
    
    // Pre-create demo accounts
    this.initializeDemoAccounts();
  }

  initializeDemoAccounts() {
    const demoAccounts = [
      {
        username: 'demo_trader',
        email: 'demo@unitrade.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: 'password'
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: 'password'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: 'password'
      },
      {
        username: 'crypto_enthusiast',
        email: 'crypto@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: 'password'
      }
    ];

    demoAccounts.forEach(account => {
      this.createUser(account);
    });
  }

  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    this.users.set(user.email, user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.get(email) || null;
  }

  createTransaction(transactionData) {
    const transaction = {
      _id: this.nextTransactionId++,
      user: transactionData.user,
      type: transactionData.type,
      assetSymbol: transactionData.assetSymbol,
      quantity: transactionData.quantity,
      priceAtTransaction: transactionData.priceAtTransaction,
      fiatEquivalent: transactionData.quantity * transactionData.priceAtTransaction,
      date: new Date().toISOString()
    };
    this.transactions.set(transaction._id, transaction);
    return transaction;
  }

  getTransactionsByUser(userId) {
    return Array.from(this.transactions.values())
      .filter(t => t.user === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getMarketData() {
    return {
      timestamp: new Date().toISOString(),
      assets: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 150 + Math.random() * 20, change24h: (Math.random() - 0.5) * 10 },
        { symbol: 'MSFT', name: 'Microsoft', price: 300 + Math.random() * 30, change24h: (Math.random() - 0.5) * 8 },
        { symbol: 'GOOGL', name: 'Alphabet', price: 2800 + Math.random() * 200, change24h: (Math.random() - 0.5) * 5 },
        { symbol: 'BTC', name: 'Bitcoin', price: 45000 + Math.random() * 5000, change24h: (Math.random() - 0.5) * 15 },
        { symbol: 'ETH', name: 'Ethereum', price: 3200 + Math.random() * 300, change24h: (Math.random() - 0.5) * 12 }
      ]
    };
  }

  calculateWallet(userId) {
    const transactions = this.getTransactionsByUser(userId);
    const holdingsMap = new Map();
    
    transactions.forEach(tx => {
      const sign = tx.type === 'SELL' ? -1 : 1;
      const current = holdingsMap.get(tx.assetSymbol) || 0;
      holdingsMap.set(tx.assetSymbol, current + (sign * tx.quantity));
    });

    const holdings = Array.from(holdingsMap.entries())
      .map(([symbol, quantity]) => ({ symbol, quantity }))
      .filter(h => h.quantity > 0);

    const marketData = this.getMarketData();
    const symbolToPrice = new Map(marketData.assets.map(a => [a.symbol, a.price]));
    
    const totalNetWorth = holdings.reduce((sum, h) => {
      const price = symbolToPrice.get(h.symbol) || 1;
      return sum + (price * h.quantity);
    }, 0);

    return {
      holdings,
      totalNetWorth,
      timestamp: marketData.timestamp
    };
  }
}

// Create a singleton instance
const mockDb = new MockDatabase();

// Auth middleware
const authenticateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
};

// Netlify serverless function handler
export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const { httpMethod, path, body, headers: requestHeaders } = event;
  const pathSegments = path.replace('/api/', '').split('/');

  try {
    // Auth Routes
    if (pathSegments[0] === 'auth') {
      if (httpMethod === 'POST' && pathSegments[1] === 'register') {
        const { username, email, password } = JSON.parse(body || '{}');

        if (!username || !email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'All fields are required' }),
          };
        }

        if (mockDb.findUserByEmail(email)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'User already exists' }),
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = mockDb.createUser({
          username,
          email,
          password: hashedPassword
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          }),
        };
      }

      if (httpMethod === 'POST' && pathSegments[1] === 'login') {
        const { email, password } = JSON.parse(body || '{}');

        if (!email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Email and password are required' }),
          };
        }

        const user = mockDb.findUserByEmail(email);
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ message: 'Invalid credentials' }),
          };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ message: 'Invalid credentials' }),
          };
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          }),
        };
      }
    }

    // Market Routes
    if (pathSegments[0] === 'market' && pathSegments[1] === 'overview') {
      const marketData = mockDb.getMarketData();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(marketData),
      };
    }

    // Transaction Routes
    if (pathSegments[0] === 'transactions') {
      const authHeader = requestHeaders.authorization || requestHeaders.Authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const user = authenticateToken(token);

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Access token required' }),
        };
      }

      if (httpMethod === 'POST' && pathSegments[1] === 'execute') {
        const { type, assetSymbol, quantity, priceAtTransaction } = JSON.parse(body || '{}');

        if (!type || !assetSymbol || !quantity || !priceAtTransaction) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'All fields are required' }),
          };
        }

        const transaction = mockDb.createTransaction({
          user: user.userId,
          type,
          assetSymbol,
          quantity: Number(quantity),
          priceAtTransaction: Number(priceAtTransaction)
        });

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            message: 'Transaction executed successfully',
            transaction
          }),
        };
      }

      if (httpMethod === 'GET' && pathSegments[1] === 'history') {
        const transactions = mockDb.getTransactionsByUser(user.userId);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(transactions),
        };
      }
    }

    // Wallet Routes
    if (pathSegments[0] === 'user' && pathSegments[1] === 'wallet') {
      const authHeader = requestHeaders.authorization || requestHeaders.Authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const user = authenticateToken(token);

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Access token required' }),
        };
      }

      const wallet = mockDb.calculateWallet(user.userId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(wallet),
      };
    }

    // Health check
    if (pathSegments[0] === 'health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'UP', message: 'Backend is healthy' }),
      };
    }

    // 404 for unknown routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' }),
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

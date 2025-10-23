import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simple in-memory database
const users = new Map();
let nextUserId = 1;

const mockDb = {
  createUser: (userData) => {
    const user = {
      id: nextUserId++,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    users.set(user.email, user);
    return user;
  },
  findUserByEmail: (email) => {
    return users.get(email) || null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}

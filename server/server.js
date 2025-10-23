import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import marketRoutes from './routes/market.js'
import transactionRoutes from './routes/transactions.js'
import walletRoutes from './routes/wallet.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unitrade_pro'

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/user', walletRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()

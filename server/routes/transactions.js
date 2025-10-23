import { Router } from 'express'
import auth from '../middleware/auth.js'
import Transaction from '../models/Transaction.js'

const router = Router()

// Protect all routes below
router.use(auth)

// POST /api/transactions/execute
router.post('/execute', async (req, res) => {
  try {
    const { type, assetSymbol, quantity, priceAtTransaction } = req.body
    if (!type || !assetSymbol || !quantity || !priceAtTransaction) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const fiatEquivalent = Number(quantity) * Number(priceAtTransaction)

    const tx = await Transaction.create({
      user: req.user.userId,
      type,
      assetSymbol,
      quantity,
      priceAtTransaction,
      fiatEquivalent,
    })

    res.status(201).json({ message: 'Transaction recorded', transaction: tx })
  } catch (err) {
    res.status(500).json({ message: 'Failed to execute transaction' })
  }
})

// GET /api/transactions/history
router.get('/history', async (req, res) => {
  try {
    const list = await Transaction.find({ user: req.user.userId }).sort({ date: -1 })
    res.json(list)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' })
  }
})

export default router

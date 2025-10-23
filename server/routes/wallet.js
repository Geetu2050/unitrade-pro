import { Router } from 'express'
import auth from '../middleware/auth.js'
import Transaction from '../models/Transaction.js'
import { getMarketData } from '../utils/dataSimulator.js'

const router = Router()

router.use(auth)

// GET /api/user/wallet
router.get('/wallet', async (req, res) => {
  try {
    const userId = req.user.userId
    const txs = await Transaction.find({ user: userId })

    // Aggregate quantities by assetSymbol
    const holdingsMap = new Map()
    for (const t of txs) {
      const sign = t.type === 'SELL' ? -1 : 1
      const prev = holdingsMap.get(t.assetSymbol) || 0
      holdingsMap.set(t.assetSymbol, prev + sign * Number(t.quantity))
    }

    const holdings = Array.from(holdingsMap.entries()).map(([symbol, quantity]) => ({ symbol, quantity }))

    // Map current prices from simulator
    const market = getMarketData()
    const symbolToPrice = new Map(market.assets.map(a => [a.symbol, a.price]))

    const totalNetWorth = holdings.reduce((sum, h) => {
      const price = symbolToPrice.get(h.symbol) || 1
      return sum + price * h.quantity
    }, 0)

    res.json({ holdings, totalNetWorth, timestamp: market.timestamp })
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute wallet' })
  }
})

export default router

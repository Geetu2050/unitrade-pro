import { Router } from 'express'
import { getMarketData, getExchangeRates } from '../utils/dataSimulator.js'

const router = Router()

router.get('/overview', (_req, res) => {
  res.json(getMarketData())
})

router.get('/rates', (_req, res) => {
  res.json(getExchangeRates())
})

export default router

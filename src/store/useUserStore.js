import { create } from 'zustand'
import { api, authHeader } from '../lib/api'

const useUserStore = create((set, get) => ({
  // Auth
  isLoggedIn: false,
  user: null,
  token: null,

  // Data
  market: { timestamp: null, assets: [] },
  wallet: { holdings: [], totalNetWorth: 0, timestamp: null },
  transactions: [],

  // Auth actions
  register: async ({ username, email, password }) => {
    const res = await api.post('/auth/register', { username, email, password })
    const { token, user } = res.data
    set({ isLoggedIn: true, token, user })
    return { token, user }
  },

  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, user } = res.data
    set({ isLoggedIn: true, token, user })
    return { token, user }
  },

  logout: () => {
    set({ isLoggedIn: false, user: null, token: null, wallet: { holdings: [], totalNetWorth: 0 }, transactions: [] })
  },

  // Fetch market and wallet
  fetchMarket: async () => {
    const res = await api.get('/market/overview')
    set({ market: res.data })
    return res.data
  },

  fetchWallet: async () => {
    const { token } = get()
    if (!token) return
    const res = await api.get('/user/wallet', authHeader(token))
    set({ wallet: res.data })
    return res.data
  },

  fetchHistory: async () => {
    const { token } = get()
    if (!token) return []
    const res = await api.get('/transactions/history', authHeader(token))
    set({ transactions: res.data })
    return res.data
  },

  executeTrade: async ({ type, assetSymbol, quantity, priceAtTransaction }) => {
    const { token } = get()
    const res = await api.post('/transactions/execute', { type, assetSymbol, quantity, priceAtTransaction }, authHeader(token))
    // Refresh wallet and history after trade
    await get().fetchWallet()
    await get().fetchHistory()
    return res.data
  },

  // Computed helpers
  getPriceForSymbol: (symbol) => {
    const { market } = get()
    const asset = market.assets.find(a => a.symbol === symbol)
    return asset ? asset.price : 0
  },

  getTotalPortfolioValue: () => {
    const { wallet, getPriceForSymbol } = get()
    if (!wallet.holdings?.length) return 0
    return wallet.holdings.reduce((sum, h) => sum + getPriceForSymbol(h.symbol) * h.quantity, 0)
  },

  getPortfolioBreakdown: () => {
    const { wallet, getPriceForSymbol } = get()
    const total = get().getTotalPortfolioValue()
    if (!total) return []
    return wallet.holdings.map(h => ({
      name: h.symbol,
      value: getPriceForSymbol(h.symbol) * h.quantity,
      percentage: (getPriceForSymbol(h.symbol) * h.quantity / total) * 100,
    }))
  },
}))

export { useUserStore }
export default useUserStore

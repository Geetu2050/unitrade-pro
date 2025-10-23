export function getMarketData() {
  // 5 stocks, 5 cryptos
  const assets = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'ADA', name: 'Cardano' },
  ]

  const seededRandom = (seed) => {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const now = Date.now()
  const data = assets.map((a, idx) => {
    const base = 50 + idx * 30
    const price = +(base + seededRandom(now / 1000 + idx) * base).toFixed(2)
    const changePct = +((-5 + seededRandom(now / 500 + idx) * 10).toFixed(2))
    return { symbol: a.symbol, name: a.name, price, change24h: changePct }
  })

  return { timestamp: new Date().toISOString(), assets: data }
}

export function getExchangeRates() {
  return {
    base: 'USD',
    timestamp: new Date().toISOString(),
    rates: {
      USD: 1,
      EUR: 0.92,
      INR: 83.1,
    },
  }
}

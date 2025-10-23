export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const marketData = {
      timestamp: new Date().toISOString(),
      assets: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 150 + Math.random() * 20, change24h: (Math.random() - 0.5) * 10 },
        { symbol: 'MSFT', name: 'Microsoft', price: 300 + Math.random() * 30, change24h: (Math.random() - 0.5) * 8 },
        { symbol: 'GOOGL', name: 'Alphabet', price: 2800 + Math.random() * 200, change24h: (Math.random() - 0.5) * 5 },
        { symbol: 'BTC', name: 'Bitcoin', price: 45000 + Math.random() * 5000, change24h: (Math.random() - 0.5) * 15 },
        { symbol: 'ETH', name: 'Ethereum', price: 3200 + Math.random() * 300, change24h: (Math.random() - 0.5) * 12 }
      ]
    };
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
}

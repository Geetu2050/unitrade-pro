import mockDb from '../mock-db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const marketData = mockDb.getMarketData();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
}

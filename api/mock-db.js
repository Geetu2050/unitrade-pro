// Simple in-memory database for Vercel deployment
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.nextUserId = 1;
    this.nextTransactionId = 1;
  }

  // User operations
  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      createdAt: new Date().toISOString()
    };
    this.users.set(user.email, user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.get(email) || null;
  }

  // Transaction operations
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

  // Market data
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

  // Wallet calculation
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

    // Calculate total value using current market prices
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

// Pre-create demo accounts
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

// Initialize demo accounts
demoAccounts.forEach(account => {
  mockDb.createUser(account);
});

export default mockDb;

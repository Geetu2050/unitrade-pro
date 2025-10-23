import { useEffect, useState } from 'react'
import { useUserStore } from '../store/useUserStore'
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'

const History = () => {
  const { transactions, fetchHistory } = useUserStore()
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchHistory() }, [])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'ALL' || transaction.type === filter
    const symbol = transaction.assetSymbol || transaction.symbol
    const matchesSearch = (symbol || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'BUY':
        return <ArrowUpIcon className="w-5 h-5 text-neon-green" />
      case 'SELL':
        return <ArrowDownIcon className="w-5 h-5 text-red-400" />
      case 'CONVERT':
        return <ArrowPathIcon className="w-5 h-5 text-neon-purple" />
      default:
        return <ArrowUpIcon className="w-5 h-5 text-dark-400" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'BUY':
        return 'bg-neon-green/10 border-neon-green/20 text-neon-green'
      case 'SELL':
        return 'bg-red-400/10 border-red-400/20 text-red-400'
      case 'CONVERT':
        return 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple'
      default:
        return 'bg-dark-600/10 border-dark-600/20 text-dark-400'
    }
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-dark-400">View and filter your trading activity</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-dark-400">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{transactions.length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-dark-400" />
            <span className="text-dark-300 font-medium">Filter:</span>
            <div className="flex space-x-2">
              {['ALL', 'BUY', 'SELL', 'CONVERT'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-800/50 border-b border-dark-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Asset</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction._id || transaction.id}
                  className="hover:bg-dark-800/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                      <span className="ml-2">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{transaction.assetSymbol || transaction.symbol}</span>
                      </div>
                      <span className="text-white font-medium">{transaction.assetSymbol || transaction.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {(transaction.quantity || transaction.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {formatCurrency(transaction.priceAtTransaction || transaction.price)}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    {formatCurrency(transaction.fiatEquivalent || transaction.total)}
                  </td>
                  <td className="px-6 py-4 text-dark-300">
                    {formatDate(transaction.date || transaction.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FunnelIcon className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p className="text-dark-400">
              {searchTerm || filter !== 'ALL' 
                ? 'Try adjusting your filters or search terms'
                : 'Start trading to see your transaction history here'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowUpIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Total Buys</h3>
          <p className="text-2xl font-bold text-neon-green">
            {transactions.filter(t => t.type === 'BUY').length}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowDownIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Total Sells</h3>
          <p className="text-2xl font-bold text-red-400">
            {transactions.filter(t => t.type === 'SELL').length}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowPathIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Conversions</h3>
          <p className="text-2xl font-bold text-neon-purple">
            {transactions.filter(t => t.type === 'CONVERT').length}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">$</span>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Volume</h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(transactions.reduce((sum, t) => sum + (t.fiatEquivalent || 0), 0))}
          </p>
        </div>
      </div>
    </div>
  )
}

export default History

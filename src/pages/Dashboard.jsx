import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import MarketSnapshot from '../components/Market/MarketSnapshot'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, fetchMarket, fetchWallet, getTotalPortfolioValue, getPortfolioBreakdown } = useUserStore()

  useEffect(() => {
    fetchMarket()
    fetchWallet()
  }, [])
  
  const totalValue = getTotalPortfolioValue()
  const portfolioBreakdown = getPortfolioBreakdown()
  
  const portfolioChange = 2.5
  const portfolioChangeAmount = (totalValue * portfolioChange) / 100

  const COLORS = ['#00d4ff', '#00ff88', '#8b5cf6', '#f472b6', '#f59e0b']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-neon-blue">
            ${data.value.toLocaleString()} ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-dark-400">
            Here's your portfolio overview for today
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-dark-400">Last updated</p>
          <p className="text-sm text-white">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-400">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {portfolioChange >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 text-neon-green" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${portfolioChange >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
              {portfolioChange >= 0 ? '+' : ''}{portfolioChange}%
            </span>
            <span className="text-sm text-dark-400">
              (${portfolioChangeAmount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Today's Performance */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-neon-green to-green-500 rounded-xl">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-400">Today's Gain</p>
              <p className="text-2xl font-bold text-neon-green">
                +$1,250.00
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-400">vs yesterday</span>
          </div>
        </div>

        {/* Active Positions */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-neon-purple to-purple-500 rounded-xl">
              <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-400">Active Positions</p>
              <p className="text-2xl font-bold text-white">{portfolioBreakdown.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-400">across {portfolioBreakdown.length} assets</span>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown and Market Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Breakdown Chart */}
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Portfolio Breakdown</h3>
          <div className="h-80">
            {portfolioBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '14px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
                    <CurrencyDollarIcon className="w-12 h-12 text-dark-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Holdings Yet</h4>
                  <p className="text-dark-400 mb-4">Start trading to see your portfolio breakdown</p>
                  <button 
                    onClick={() => navigate('/trade')}
                    className="btn-primary"
                  >
                    <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
                    Start Trading
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Snapshot */}
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Market Snapshot</h3>
          <MarketSnapshot />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/trade?type=BUY')}
            className="btn-primary text-center hover:scale-105 transition-transform duration-200"
          >
            <CurrencyDollarIcon className="w-5 h-5 inline mr-2" />
            Buy Assets
          </button>
          <button 
            onClick={() => navigate('/trade?type=SELL')}
            className="btn-secondary text-center hover:scale-105 transition-transform duration-200"
          >
            <ArrowTrendingDownIcon className="w-5 h-5 inline mr-2" />
            Sell Assets
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="btn-secondary text-center hover:scale-105 transition-transform duration-200"
          >
            <ArrowTrendingUpIcon className="w-5 h-5 inline mr-2" />
            View History
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


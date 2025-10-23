import { useEffect } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { useUserStore } from '../../store/useUserStore'

const MarketSnapshot = () => {
  const { market, fetchMarket } = useUserStore()

  useEffect(() => {
    fetchMarket().catch(() => {})
  }, [])

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    }
    return `$${price.toFixed(2)}`
  }

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${Number(change).toFixed(2)}%`
  }

  return (
    <div className="space-y-4">
      {market.assets.map((asset) => (
        <div
          key={asset.symbol}
          className="bg-dark-800/50 hover:bg-dark-800/70 rounded-xl p-4 transition-all duration-300 border border-dark-700 hover:border-dark-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{asset.symbol}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">{asset.symbol}</h4>
                <p className="text-dark-400 text-sm">{asset.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white font-semibold text-lg">
                {formatPrice(asset.price)}
              </p>
              <div className={`flex items-center space-x-1 ${
                asset.change24h >= 0 ? 'text-neon-green' : 'text-red-400'
              }`}>
                {asset.change24h >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {formatChange(asset.change24h)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-4">
        <button className="w-full py-3 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-lg transition-all duration-300 border border-dark-600 hover:border-dark-500">
          View All Markets
        </button>
      </div>
    </div>
  )
}

export default MarketSnapshot


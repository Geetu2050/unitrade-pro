import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const TradePage = () => {
  const [searchParams] = useSearchParams()
  const [tradeType, setTradeType] = useState(searchParams.get('type') || 'BUY')
  const [formData, setFormData] = useState({
    asset: 'BTC',
    quantity: '',
    price: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { market, fetchMarket, executeTrade, getPriceForSymbol } = useUserStore()

  useEffect(() => {
    fetchMarket().then(() => {
      const p = getPriceForSymbol('BTC')
      setFormData((f) => ({ ...f, price: p ? String(p) : '' }))
    })
  }, [])

  const assets = market.assets.length ? market.assets : [
    { symbol: 'BTC', name: 'Bitcoin', price: 0 },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAssetChange = (e) => {
    const symbol = e.target.value
    const price = getPriceForSymbol(symbol)
    setFormData({ ...formData, asset: symbol, price: price ? String(price) : '' })
  }

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0
    const price = parseFloat(formData.price) || 0
    return (quantity * price).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await executeTrade({ type: tradeType, assetSymbol: formData.asset, quantity: Number(formData.quantity), priceAtTransaction: Number(formData.price) })
      setShowSuccess(true)
      setFormData({ asset: formData.asset, quantity: '', price: String(getPriceForSymbol(formData.asset) || '') })
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTradeTypeIcon = (type) => {
    switch (type) {
      case 'BUY':
        return <ArrowUpIcon className="w-5 h-5" />
      case 'SELL':
        return <ArrowDownIcon className="w-5 h-5" />
      case 'CONVERT':
        return <ArrowPathIcon className="w-5 h-5" />
      default:
        return <CurrencyDollarIcon className="w-5 h-5" />
    }
  }

  const getTradeTypeColor = (type) => {
    switch (type) {
      case 'BUY':
        return 'from-neon-green to-green-500'
      case 'SELL':
        return 'from-red-500 to-red-600'
      case 'CONVERT':
        return 'from-neon-purple to-purple-500'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Trading Platform</h1>
        <p className="text-dark-400">Execute trades across multiple asset classes</p>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-neon-green text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up">
          <CheckCircleIcon className="w-6 h-6" />
          <span className="font-medium">Virtual Trade Executed Successfully!</span>
        </div>
      )}

      {/* Trading Form */}
      <div className="glass-effect rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Trade Type Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-4">
              Trade Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['BUY', 'SELL', 'CONVERT'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTradeType(type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    tradeType === type
                      ? `border-transparent bg-gradient-to-r ${getTradeTypeColor(type)} text-white`
                      : 'border-dark-600 bg-dark-800 text-dark-300 hover:border-dark-500 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {getTradeTypeIcon(type)}
                    <span className="font-semibold">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Selection */}
          <div>
            <label htmlFor="asset" className="block text-sm font-medium text-dark-300 mb-2">
              Asset
            </label>
            <select
              id="asset"
              name="asset"
              value={formData.asset}
              onChange={handleAssetChange}
              className="input-field"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name} (${(asset.price || getPriceForSymbol(asset.symbol) || 0).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-dark-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                step="0.00000001"
                className="input-field"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-dark-300 mb-2">
                Price per Unit
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">
              Quick Amounts
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    const currentPrice = parseFloat(formData.price) || getPriceForSymbol(formData.asset) || 1
                    const quantity = amount / currentPrice
                    setFormData(prev => ({ ...prev, quantity: quantity.toFixed(6) }))
                  }}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg border border-dark-600 hover:border-dark-500 transition-all duration-200 text-sm font-medium"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {formData.quantity && formData.price && (
            <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-600">
              <div className="flex justify-between items-center">
                <span className="text-dark-300">Total Value:</span>
                <span className="text-2xl font-bold text-white">
                  ${calculateTotal()}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !formData.quantity || !formData.price}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${getTradeTypeColor(tradeType)} text-white hover:shadow-xl hover:shadow-opacity-25`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Executing {tradeType} Order...
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                {getTradeTypeIcon(tradeType)}
                <span>Execute {tradeType} Order</span>
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Trading Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="glass-effect rounded-xl p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 card-hover"
          onClick={() => {
            // Refresh market data
            fetchMarket()
            // Show a brief notification
            const notification = document.createElement('div')
            notification.className = 'fixed top-4 right-4 z-50 bg-neon-blue text-white px-4 py-2 rounded-lg shadow-lg'
            notification.textContent = 'Market data refreshed!'
            document.body.appendChild(notification)
            setTimeout(() => notification.remove(), 2000)
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Real-time Pricing</h3>
          <p className="text-dark-400 text-sm mb-3">Live market data for accurate trading</p>
          <div className="text-xs text-neon-blue font-medium">Click to refresh prices</div>
        </div>

        <div 
          className="glass-effect rounded-xl p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 card-hover"
          onClick={() => {
            // Auto-fill form with current market price
            const currentPrice = getPriceForSymbol(formData.asset)
            if (currentPrice) {
              setFormData(prev => ({ ...prev, price: String(currentPrice) }))
              const notification = document.createElement('div')
              notification.className = 'fixed top-4 right-4 z-50 bg-neon-green text-white px-4 py-2 rounded-lg shadow-lg'
              notification.textContent = `Price updated to $${currentPrice.toFixed(2)}`
              document.body.appendChild(notification)
              setTimeout(() => notification.remove(), 2000)
            }
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowUpIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Instant Execution</h3>
          <p className="text-dark-400 text-sm mb-3">Orders executed immediately</p>
          <div className="text-xs text-neon-green font-medium">Click to use current price</div>
        </div>

        <div 
          className="glass-effect rounded-xl p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 card-hover"
          onClick={() => {
            // Cycle through different assets
            const assetSymbols = assets.map(a => a.symbol)
            const currentIndex = assetSymbols.indexOf(formData.asset)
            const nextIndex = (currentIndex + 1) % assetSymbols.length
            const nextAsset = assetSymbols[nextIndex]
            const nextPrice = getPriceForSymbol(nextAsset)
            
            setFormData(prev => ({ 
              ...prev, 
              asset: nextAsset, 
              price: nextPrice ? String(nextPrice) : '' 
            }))
            
            const notification = document.createElement('div')
            notification.className = 'fixed top-4 right-4 z-50 bg-neon-purple text-white px-4 py-2 rounded-lg shadow-lg'
            notification.textContent = `Switched to ${nextAsset}`
            document.body.appendChild(notification)
            setTimeout(() => notification.remove(), 2000)
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowPathIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Multi-Asset Trading</h3>
          <p className="text-dark-400 text-sm mb-3">Trade stocks, crypto, and more</p>
          <div className="text-xs text-neon-purple font-medium">Click to switch asset</div>
        </div>
      </div>
    </div>
  )
}

export default TradePage

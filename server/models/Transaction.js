import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BUY', 'SELL', 'CONVERT'], required: true },
  assetSymbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceAtTransaction: { type: Number, required: true },
  fiatEquivalent: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'investment', 'return', 'fee', 'refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    description: String,
    relatedInvestmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
    },
    paymentMethod: {
      method: {
        type: String,
        enum: ['bank_transfer', 'e_wallet', 'credit_card'],
      },
      provider: String,
      reference: String,
    },
    fees: {
      type: Number,
      default: 0,
    },
    receiptUrl: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);

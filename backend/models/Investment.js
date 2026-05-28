const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema(
  {
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'escrow', 'earning', 'completed', 'cancelled'],
      default: 'pending',
    },
    investmentDate: {
      type: Date,
      default: Date.now,
    },
    expectedReturnDate: Date,
    actualReturnDate: Date,
    returnAmount: Number,
    returnForm: {
      type: String,
      enum: ['cash', 'product', 'mixed'],
    },
    escrowInfo: {
      escrowId: mongoose.Schema.Types.ObjectId,
      holdAmount: Number,
      releaseDate: Date,
      conditions: [String],
    },
    documents: [
      {
        type: {
          type: String,
          enum: ['contract', 'receipt', 'delivery_proof'],
        },
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
InvestmentSchema.index({ investorId: 1, status: 1 });
InvestmentSchema.index({ projectId: 1, status: 1 });
InvestmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Investment', InvestmentSchema);

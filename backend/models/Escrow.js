const mongoose = require('mongoose');

const EscrowSchema = new mongoose.Schema(
  {
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
      unique: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['held', 'released', 'returned', 'dispute'],
      default: 'held',
    },
    releaseConditions: [
      {
        condition: String,
        verified: {
          type: Boolean,
          default: false,
        },
        verifiedBy: mongoose.Schema.Types.ObjectId,
        verifiedAt: Date,
      },
    ],
    heldAt: {
      type: Date,
      default: Date.now,
    },
    releaseDate: Date,
    releaseReason: String,
    dispute: {
      reason: String,
      raisedBy: mongoose.Schema.Types.ObjectId,
      status: {
        type: String,
        enum: ['open', 'investigating', 'resolved'],
      },
      resolution: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
EscrowSchema.index({ investmentId: 1 });
EscrowSchema.index({ projectId: 1, status: 1 });
EscrowSchema.index({ status: 1 });

module.exports = mongoose.model('Escrow', EscrowSchema);

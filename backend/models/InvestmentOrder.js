const mongoose = require('mongoose');

const TimelineStepSchema = new mongoose.Schema(
  {
    key: String,
    title: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'blocked', 'cancelled'],
      default: 'pending',
    },
    description: String,
    at: Date,
  },
  { _id: false },
);

const InvestmentOrderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    customerSnapshot: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
    },
    projectSnapshot: {
      name: String,
      category: String,
      location: String,
      expectedReturnRate: String,
      duration: String,
    },
    packageSnapshot: {
      key: String,
      label: String,
      amount: Number,
      isCustom: Boolean,
      rewardDescription: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 1000000,
    },
    delivery: {
      method: {
        type: String,
        enum: ['home_delivery', 'farm_pickup'],
        required: true,
      },
      address: String,
      preferredDate: Date,
      participants: {
        type: Number,
        default: 1,
        min: 1,
      },
      status: {
        type: String,
        enum: ['not_scheduled', 'scheduled', 'packing', 'shipping', 'delivered', 'failed', 'farm_visit_booked', 'checked_in'],
        default: 'not_scheduled',
      },
      provider: String,
      trackingNumber: String,
      scheduledAt: Date,
      deliveredAt: Date,
      farmVisitTime: Date,
      farmCheckInAt: Date,
      note: String,
    },
    payment: {
      method: {
        type: String,
        enum: ['bank_transfer', 'cash_consultation', 'later'],
        default: 'bank_transfer',
      },
      status: {
        type: String,
        enum: ['pending', 'awaiting_payment', 'paid', 'refunded', 'failed'],
        default: 'pending',
      },
      reference: String,
      receiptUrl: String,
      receiptNote: String,
      receiptIssuedAt: Date,
      receiptIssuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      paidAt: Date,
    },
    status: {
      type: String,
      enum: [
        'new',
        'contacting',
        'awaiting_payment',
        'paid',
        'escrow_ready',
        'in_production',
        'ready_to_deliver',
        'completed',
        'cancelled',
      ],
      default: 'new',
    },
    timeline: [TimelineStepSchema],
    internalNote: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    consentAccepted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

InvestmentOrderSchema.index({ status: 1, createdAt: -1 });
InvestmentOrderSchema.index({ projectId: 1, status: 1 });
InvestmentOrderSchema.index({ customerId: 1, createdAt: -1 });

module.exports = mongoose.model('InvestmentOrder', InvestmentOrderSchema);

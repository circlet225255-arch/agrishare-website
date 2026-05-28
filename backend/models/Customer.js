const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Họ tên khách hàng là bắt buộc'],
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    source: {
      type: String,
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'invested', 'follow_up', 'inactive'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    nextFollowUpAt: Date,
    channel: {
      type: String,
      default: 'website',
    },
    notes: [
      {
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastOrderAt: Date,
  },
  {
    timestamps: true,
  },
);

CustomerSchema.index({ phone: 1, email: 1 });
CustomerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Customer', CustomerSchema);

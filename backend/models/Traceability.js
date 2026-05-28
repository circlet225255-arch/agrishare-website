const mongoose = require('mongoose');

const TraceabilitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    batchId: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: Number,
    unit: String,
    harvestDate: Date,
    processingDate: Date,
    packagingDate: Date,
    qualityMetrics: {
      moisture: Number,
      purity: Number,
      defects: Number,
      certification: String,
    },
    distribution: [
      {
        investorId: mongoose.Schema.Types.ObjectId,
        investmentId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        deliveredAt: Date,
        deliveryForm: {
          type: String,
          enum: ['home_delivery', 'farm_pickup'],
        },
        trackingNumber: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
TraceabilitySchema.index({ projectId: 1, batchId: 1 });
TraceabilitySchema.index({ batchId: 1 });

module.exports = mongoose.model('Traceability', TraceabilitySchema);

const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    page: String,
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    orderCode: String,
    metadata: {
      type: Object,
      default: {},
    },
    sessionId: String,
    userAgent: String,
    ip: String,
  },
  {
    timestamps: true,
  },
);

AnalyticsEventSchema.index({ type: 1, createdAt: -1 });
AnalyticsEventSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);

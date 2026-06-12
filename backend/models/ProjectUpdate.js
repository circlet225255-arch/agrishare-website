const mongoose = require('mongoose');

const ProjectUpdateSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    type: {
      type: String,
      enum: ['season_log', 'growth_update', 'harvest_report', 'quality_report', 'milestone'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    images: [String],
    videos: [String],
    updateWeek: {
      type: String,
      trim: true,
      match: /^\d{4}-W\d{2}$/,
    },
    weekStart: Date,
    weekEnd: Date,
    orderCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    farmUnitCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    visibility: {
      type: String,
      enum: ['project', 'order'],
      default: 'project',
    },
    metrics: {
      growthStage: String,
      temperatureAvg: Number,
      rainfall: Number,
      pestCondition: String,
      estimatedYield: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
ProjectUpdateSchema.index({ projectId: 1, createdAt: -1 });
ProjectUpdateSchema.index({ projectId: 1, orderCode: 1, createdAt: -1 });
ProjectUpdateSchema.index({ projectId: 1, updateWeek: -1, farmUnitCode: 1, orderCode: 1 });

module.exports = mongoose.model('ProjectUpdate', ProjectUpdateSchema);

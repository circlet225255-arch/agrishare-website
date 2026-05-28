const mongoose = require('mongoose');

const QualityAuditSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    auditerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['input_control', 'production_monitoring', 'output_quality', 'traceability'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
    },
    auditDate: Date,
    findings: {
      score: Number,
      passed: Boolean,
      issues: [String],
      recommendations: [String],
    },
    documents: [
      {
        type: String,
        url: String,
      },
    ],
    photos: [String],
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
QualityAuditSchema.index({ projectId: 1, auditDate: -1 });
QualityAuditSchema.index({ auditerId: 1, status: 1 });

module.exports = mongoose.model('QualityAudit', QualityAuditSchema);

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên dự án là bắt buộc'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: String,
    farmerStory: String,
    riskDisclosure: String,
    producer: String,
    logo: String,
    facebookUrl: String,
    productIntro: String,
    highlights: [String],
    qualityNotes: String,
    specs: {
      packaging: String,
      referencePrice: String,
      shelfLife: String,
      storage: String,
      deliveryPlan: String,
      returnPolicy: String,
    },
    faq: [
      {
        question: String,
        answer: String,
      },
    ],
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Gạo', 'Mật ong dú', 'Bưởi da xanh', 'Rau sạch', 'Cà phê', 'Sữa', 'Sữa chua'],
      required: true,
    },
    location: {
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [String],
    capitalRequired: {
      type: Number,
      required: true,
    },
    funded: {
      type: Number,
      default: 0,
    },
    fundingPercentage: {
      type: Number,
      default: 0,
    },
    investmentPackages: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        key: String,
        label: String,
        amount: Number,
        isCustom: {
          type: Boolean,
          default: false,
        },
        description: String,
        expectedReturn: Number,
        rewardDescription: String,
        deliveryForm: {
          type: String,
          enum: ['home_delivery', 'farm_pickup'],
        },
        deliveryForms: [
          {
            type: String,
            enum: ['home_delivery', 'farm_pickup'],
          },
        ],
      },
    ],
    duration: String,
    startDate: Date,
    endDate: Date,
    expectedReturnRate: String,
    riskLevel: {
      type: String,
      enum: ['Thấp', 'Trung bình', 'Cao', 'Ổn định chất lượng'],
    },
    tags: [String],
    status: {
      type: String,
      enum: ['drafting', 'active', 'funding', 'ongoing', 'harvest', 'completed', 'failed'],
      default: 'drafting',
    },
    qa_qc: {
      auditerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'passed', 'failed'],
        default: 'pending',
      },
      reports: [mongoose.Schema.Types.ObjectId],
    },
    metrics: {
      expectedYield: Number,
      actualYield: Number,
      qualityScore: Number,
    },
    sales: {
      featured: {
        type: Boolean,
        default: false,
      },
      allowCustomAmount: {
        type: Boolean,
        default: true,
      },
      paymentGuide: String,
      hotline: String,
      zaloUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn
ProjectSchema.index({ farmerId: 1, status: 1 });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ 'location.province': 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ slug: 1 });

module.exports = mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');

const PlatformSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
    },
    payment: {
      bankName: String,
      bankCode: String,
      accountNumber: String,
      accountName: String,
      transferPrefix: {
        type: String,
        default: 'AGS',
      },
      vietQrEnabled: {
        type: Boolean,
        default: true,
      },
    },
    marketing: {
      googleAnalyticsId: String,
      metaPixelId: String,
      tiktokPixelId: String,
      hotline: String,
      zaloUrl: String,
    },
    legal: {
      termsVersion: String,
      privacyVersion: String,
      riskVersion: String,
      ecommerceNoticeStatus: {
        type: String,
        enum: ['not_started', 'preparing', 'submitted', 'approved'],
        default: 'not_started',
      },
    },
    operations: {
      defaultDeliveryProvider: String,
      supportEmail: String,
      businessAddress: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('PlatformSetting', PlatformSettingSchema);

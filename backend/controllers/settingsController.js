const PlatformSetting = require('../models/PlatformSetting');
const logAudit = require('../utils/auditLogger');

const defaultSettings = {
  key: 'default',
  payment: {
    bankName: 'Ngân hàng đang cấu hình',
    bankCode: '',
    accountNumber: '',
    accountName: 'AGRISHARE',
    transferPrefix: 'AGS',
    vietQrEnabled: true,
  },
  marketing: {
    hotline: '',
    zaloUrl: '',
  },
  legal: {
    termsVersion: 'MVP-2026',
    privacyVersion: 'MVP-2026',
    riskVersion: 'MVP-2026',
    ecommerceNoticeStatus: 'preparing',
  },
  operations: {
    defaultDeliveryProvider: 'Tự vận hành',
    supportEmail: '',
    businessAddress: 'Cập nhật trong Admin',
  },
};

const getOrCreateSettings = async () =>
  PlatformSetting.findOneAndUpdate({ key: 'default' }, { $setOnInsert: defaultSettings }, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      settings: {
        payment: settings.payment,
        marketing: settings.marketing,
        legal: settings.legal,
        operations: settings.operations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const before = await PlatformSetting.findOne({ key: 'default' }).lean();
    const settings = await PlatformSetting.findOneAndUpdate(
      { key: 'default' },
      { $set: req.body },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    await logAudit({
      req,
      action: 'settings.updated',
      entityType: 'PlatformSetting',
      entityId: settings._id,
      before,
      after: settings,
    });

    res.status(200).json({ success: true, message: 'Cấu hình đã được cập nhật', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

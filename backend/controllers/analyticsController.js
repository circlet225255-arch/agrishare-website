const AnalyticsEvent = require('../models/AnalyticsEvent');
const InvestmentOrder = require('../models/InvestmentOrder');

exports.recordEvent = async (req, res) => {
  try {
    const { type, page, projectId, orderCode, metadata = {}, sessionId } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Thiếu loại sự kiện' });
    }

    await AnalyticsEvent.create({
      type,
      page,
      projectId: projectId || undefined,
      orderCode,
      metadata,
      sessionId,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSalesAnalytics = async (req, res) => {
  try {
    const [events, orderStats] = await Promise.all([
      AnalyticsEvent.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
      ]),
      InvestmentOrder.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amount: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      events,
      orderStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

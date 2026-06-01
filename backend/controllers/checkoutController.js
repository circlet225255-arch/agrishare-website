const Customer = require('../models/Customer');
const InvestmentOrder = require('../models/InvestmentOrder');
const Project = require('../models/Project');
const ProjectUpdate = require('../models/ProjectUpdate');
const logAudit = require('../utils/auditLogger');

const deliveryLabels = {
  home_delivery: 'Nhận hàng tại nhà',
  farm_pickup: 'Trải nghiệm và nhận sản phẩm tại Farm của nhà nông',
};

const allowedOrderStatuses = [
  'new',
  'contacting',
  'awaiting_payment',
  'paid',
  'escrow_ready',
  'in_production',
  'ready_to_deliver',
  'completed',
  'cancelled',
];

const allowedPaymentStatuses = ['pending', 'awaiting_payment', 'paid', 'refunded', 'failed'];
const allowedDeliveryStatuses = [
  'not_scheduled',
  'scheduled',
  'packing',
  'shipping',
  'delivered',
  'failed',
  'farm_visit_booked',
  'checked_in',
];

const timelineStatusMap = {
  contacting: ['request_received', 'advisor_contact'],
  awaiting_payment: ['request_received', 'advisor_contact'],
  paid: ['request_received', 'advisor_contact', 'payment_confirmation'],
  escrow_ready: ['request_received', 'advisor_contact', 'payment_confirmation', 'escrow_setup'],
  in_production: [
    'request_received',
    'advisor_contact',
    'payment_confirmation',
    'escrow_setup',
    'farm_updates',
  ],
  ready_to_deliver: [
    'request_received',
    'advisor_contact',
    'payment_confirmation',
    'escrow_setup',
    'farm_updates',
  ],
  completed: [
    'request_received',
    'advisor_contact',
    'payment_confirmation',
    'escrow_setup',
    'farm_updates',
    'harvest_delivery',
  ],
};

const normalizePhone = (phone) => String(phone || '').replace(/\s+/g, '').trim();

const buildOrderCode = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `AGS-${date}-${random}`;
};

const getProjectLocation = (project) =>
  [project.location?.district, project.location?.province].filter(Boolean).join(', ');

const buildTimeline = (deliveryMethod) => [
  {
    key: 'request_received',
    title: 'Ghi nhận yêu cầu đầu tư',
    status: 'completed',
    description: 'Hệ thống đã lưu thông tin khách hàng, gói đầu tư và hình thức nhận sản phẩm.',
    at: new Date(),
  },
  {
    key: 'advisor_contact',
    title: 'Tư vấn xác nhận nhu cầu',
    status: 'pending',
    description: 'Đội AgriShare liên hệ để xác nhận thông tin, quyền lợi và lịch thanh toán.',
  },
  {
    key: 'payment_confirmation',
    title: 'Xác nhận thanh toán',
    status: 'pending',
    description: 'Ghi nhận chứng từ thanh toán và chuyển trạng thái đơn sang chờ ký quỹ.',
  },
  {
    key: 'escrow_setup',
    title: 'Thiết lập ký quỹ và hợp đồng',
    status: 'pending',
    description: 'Tạo hợp đồng, điều kiện giải ngân và mốc kiểm soát mùa vụ.',
  },
  {
    key: 'farm_updates',
    title: 'Theo dõi mùa vụ',
    status: 'pending',
    description: 'Cập nhật nhật ký sản xuất, hình ảnh, QA/QC và tiến độ thu hoạch.',
  },
  {
    key: 'harvest_delivery',
    title: deliveryLabels[deliveryMethod],
    status: 'pending',
    description:
      deliveryMethod === 'farm_pickup'
        ? 'Xác nhận lịch trải nghiệm farm và bàn giao sản phẩm trực tiếp.'
        : 'Xác nhận địa chỉ, lịch giao và trạng thái bàn giao sản phẩm.',
  },
];

const syncTimelineWithStatus = (timeline, status) => {
  const completedKeys = timelineStatusMap[status] || [];

  return timeline.map((step) => {
    const plainStep = typeof step.toObject === 'function' ? step.toObject() : step;

    if (completedKeys.includes(step.key)) {
      return {
        ...plainStep,
        status: 'completed',
        at: step.at || new Date(),
      };
    }

    if (status === 'cancelled') {
      return {
        ...plainStep,
        status: step.status === 'completed' ? 'completed' : 'cancelled',
        at: step.at,
      };
    }

    return {
      ...plainStep,
      status: step.status === 'completed' ? 'completed' : 'pending',
      at: step.at,
    };
  });
};

const pickPackage = (project, packageKey) => {
  const packageItem = project.investmentPackages.find((item) => item.key === packageKey);

  if (packageItem) {
    return packageItem;
  }

  return project.investmentPackages.find((item) => item.key === 'custom');
};

exports.createInvestmentOrder = async (req, res) => {
  try {
    const {
      projectId,
      packageKey,
      customAmount,
      customer = {},
      deliveryMethod = 'home_delivery',
      delivery = {},
      paymentMethod = 'bank_transfer',
      note,
      consentAccepted = true,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Thiếu dự án đầu tư' });
    }

    if (!customer.fullName || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập họ tên và số điện thoại khách hàng',
      });
    }

    if (!['home_delivery', 'farm_pickup'].includes(deliveryMethod)) {
      return res.status(400).json({ success: false, message: 'Hình thức nhận sản phẩm không hợp lệ' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Dự án không tồn tại' });
    }

    const selectedPackage = pickPackage(project, packageKey);

    if (!selectedPackage) {
      return res.status(400).json({ success: false, message: 'Dự án chưa có gói đầu tư khả dụng' });
    }

    const amount = selectedPackage.isCustom || selectedPackage.key === 'custom'
      ? Number(customAmount)
      : Number(selectedPackage.amount);

    if (!amount || amount < 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền đầu tư tối thiểu là 1.000.000đ',
      });
    }

    const phone = normalizePhone(customer.phone);
    const customerUpdate = {
      $set: {
        fullName: String(customer.fullName).trim(),
        phone,
        email: customer.email ? String(customer.email).toLowerCase().trim() : '',
        address: customer.address || delivery.address || '',
        source: 'website',
        lastOrderAt: new Date(),
      },
    };

    if (note) {
      customerUpdate.$push = { notes: { content: note } };
    }

    const customerRecord = await Customer.findOneAndUpdate(
      {
        $or: [
          { phone },
          ...(customer.email ? [{ email: String(customer.email).toLowerCase().trim() }] : []),
        ],
      },
      customerUpdate,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    let orderCode = buildOrderCode();
    while (await InvestmentOrder.exists({ orderCode })) {
      orderCode = buildOrderCode();
    }

    const rewardDescription =
      selectedPackage.rewardDescription ||
      'Sản phẩm được quy đổi theo giá trị đầu tư thực tế và xác nhận khi tư vấn.';

    const order = await InvestmentOrder.create({
      orderCode,
      customerId: customerRecord._id,
      projectId: project._id,
      customerSnapshot: {
        fullName: customerRecord.fullName,
        phone: customerRecord.phone,
        email: customerRecord.email,
        address: customerRecord.address,
      },
      projectSnapshot: {
        name: project.name,
        category: project.category,
        location: getProjectLocation(project),
        expectedReturnRate: project.expectedReturnRate,
        duration: project.duration,
      },
      packageSnapshot: {
        key: selectedPackage.key || packageKey || 'custom',
        label: selectedPackage.label || 'Gói tùy chọn',
        amount,
        isCustom: selectedPackage.isCustom || selectedPackage.key === 'custom',
        rewardDescription,
      },
      amount,
      delivery: {
        method: deliveryMethod,
        address: delivery.address || customer.address || '',
        preferredDate: delivery.preferredDate || undefined,
        participants: Number(delivery.participants || 1),
        note: delivery.note || note || '',
      },
      payment: {
        method: paymentMethod,
        status: 'awaiting_payment',
      },
      status: 'contacting',
      timeline: buildTimeline(deliveryMethod),
      internalNote: note || '',
      consentAccepted: Boolean(consentAccepted),
    });

    await logAudit({
      req,
      action: 'order.created',
      entityType: 'InvestmentOrder',
      entityId: order._id,
      after: order,
      metadata: { orderCode: order.orderCode, source: 'website' },
    });

    res.status(201).json({
      success: true,
      message: 'AgriShare đã ghi nhận đơn đầu tư',
      order: {
        orderCode: order.orderCode,
        status: order.status,
        amount: order.amount,
        customer: order.customerSnapshot,
        project: order.projectSnapshot,
        package: order.packageSnapshot,
        delivery: order.delivery,
        timeline: order.timeline,
        createdAt: order.createdAt,
      },
      nextSteps: [
        'AgriShare liên hệ xác nhận thông tin và quyền lợi gói đầu tư.',
        'Khách hàng hoàn tất thanh toán hoặc lịch hẹn tư vấn.',
        'Đơn được chuyển sang ký quỹ, theo dõi mùa vụ và nhận sản phẩm theo lựa chọn.',
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderByCode = async (req, res) => {
  try {
    const order = await InvestmentOrder.findOne({ orderCode: req.params.orderCode })
      .populate('projectId', 'name category duration expectedReturnRate')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đầu tư' });
    }

    const projectId = order.projectId?._id || order.projectId;
    const seasonUpdates = projectId
      ? await ProjectUpdate.find({
        projectId,
        $or: [
          { orderCode: order.orderCode },
          { orderCode: { $exists: false } },
          { orderCode: '' },
        ],
      })
        .populate('createdBy', 'fullName role')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean()
      : [];

    res.status(200).json({
      success: true,
      order: {
        ...order,
        seasonUpdates,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    if (search) {
      const keyword = String(search).trim();
      filter.$or = [
        { orderCode: { $regex: keyword, $options: 'i' } },
        { 'customerSnapshot.fullName': { $regex: keyword, $options: 'i' } },
        { 'customerSnapshot.phone': { $regex: keyword, $options: 'i' } },
        { 'projectSnapshot.name': { $regex: keyword, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      InvestmentOrder.find(filter)
        .populate('customerId', 'fullName phone email')
        .populate('projectId', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InvestmentOrder.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 30 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      const keyword = String(search).trim();
      filter.$or = [
        { fullName: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ lastOrderAt: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);

    const orderStats = await InvestmentOrder.aggregate([
      { $group: { _id: '$customerId', totalAmount: { $sum: '$amount' }, orderCount: { $sum: 1 } } },
    ]);
    const statsMap = new Map(orderStats.map((item) => [String(item._id), item]));

    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      customers: customers.map((customer) => ({
        ...customer.toObject(),
        stats: statsMap.get(String(customer._id)) || { orderCount: 0, totalAmount: 0 },
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { status, note, nextFollowUpAt, channel } = req.body;
    const update = {};

    if (status) update.status = status;
    if (nextFollowUpAt !== undefined) update.nextFollowUpAt = nextFollowUpAt || undefined;
    if (channel !== undefined) update.channel = channel;
    if (note) update.$push = { notes: { content: note } };

    const customer = await Customer.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
    }

    res.status(200).json({
      success: true,
      message: 'Khách hàng đã được cập nhật',
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitPaymentProof = async (req, res) => {
  try {
    const { receiptUrl, receiptNote, paymentReference } = req.body;

    if (!receiptUrl && !paymentReference) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập link biên lai hoặc mã giao dịch',
      });
    }

    const order = await InvestmentOrder.findOne({ orderCode: req.params.orderCode });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đầu tư' });
    }

    const before = order.toObject();
    order.payment.receiptUrl = receiptUrl || order.payment.receiptUrl;
    order.payment.receiptNote = receiptNote || order.payment.receiptNote;
    order.payment.reference = paymentReference || order.payment.reference;
    order.payment.status = 'awaiting_payment';
    order.status = order.status === 'contacting' ? 'awaiting_payment' : order.status;

    await order.save();

    await logAudit({
      req,
      action: 'order.payment_proof_submitted',
      entityType: 'InvestmentOrder',
      entityId: order._id,
      before,
      after: order,
      metadata: { orderCode: order.orderCode },
    });

    res.status(200).json({
      success: true,
      message: 'AgriShare đã nhận thông tin biên lai, admin sẽ xác nhận thanh toán',
      orderCode: order.orderCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      paymentReference,
      receiptUrl,
      internalNote,
      deliveryNote,
      deliveryStatus,
      deliveryProvider,
      trackingNumber,
      scheduledAt,
      deliveredAt,
      farmVisitTime,
      farmCheckInAt,
    } = req.body;
    const order = await InvestmentOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đầu tư' });
    }

    const before = order.toObject();

    if (status) {
      if (!allowedOrderStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Trạng thái đơn không hợp lệ' });
      }

      order.status = status;
      order.timeline = syncTimelineWithStatus(order.timeline, status);

      if (status === 'awaiting_payment') {
        order.payment.status = 'awaiting_payment';
      }

      if (status === 'paid' && order.payment.status !== 'paid') {
        order.payment.status = 'paid';
        order.payment.paidAt = new Date();
      }
    }

    if (paymentStatus) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Trạng thái thanh toán không hợp lệ' });
      }

      order.payment.status = paymentStatus;
      if (paymentStatus === 'paid' && !order.payment.paidAt) {
        order.payment.paidAt = new Date();
      }
    }

    if (paymentReference !== undefined) {
      order.payment.reference = paymentReference;
    }

    if (receiptUrl !== undefined) {
      order.payment.receiptUrl = receiptUrl;
    }

    if (internalNote !== undefined) {
      order.internalNote = internalNote;
    }

    if (deliveryNote !== undefined) {
      order.delivery.note = deliveryNote;
    }

    if (deliveryStatus !== undefined) {
      if (!allowedDeliveryStatuses.includes(deliveryStatus)) {
        return res.status(400).json({ success: false, message: 'Trạng thái giao nhận không hợp lệ' });
      }
      order.delivery.status = deliveryStatus;
    }
    if (deliveryProvider !== undefined) order.delivery.provider = deliveryProvider;
    if (trackingNumber !== undefined) order.delivery.trackingNumber = trackingNumber;
    if (scheduledAt !== undefined) order.delivery.scheduledAt = scheduledAt || undefined;
    if (deliveredAt !== undefined) order.delivery.deliveredAt = deliveredAt || undefined;
    if (farmVisitTime !== undefined) order.delivery.farmVisitTime = farmVisitTime || undefined;
    if (farmCheckInAt !== undefined) order.delivery.farmCheckInAt = farmCheckInAt || undefined;

    if (order.payment.status === 'paid' && !order.payment.receiptIssuedAt) {
      order.payment.receiptIssuedAt = new Date();
      order.payment.receiptIssuedBy = req.user._id;
    }

    await order.save();

    await logAudit({
      req,
      action: 'order.updated',
      entityType: 'InvestmentOrder',
      entityId: order._id,
      before,
      after: order,
      metadata: { orderCode: order.orderCode },
    });

    res.status(200).json({
      success: true,
      message: 'Đơn đầu tư đã được cập nhật',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderReceipt = async (req, res) => {
  try {
    const order = await InvestmentOrder.findOne({ orderCode: req.params.orderCode }).lean();

    if (!order) {
      return res.status(404).send('Không tìm thấy đơn đầu tư');
    }

    const formatCurrency = (value) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(value || 0);
    const issuedAt = order.payment?.receiptIssuedAt || order.payment?.paidAt || order.updatedAt;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Biên nhận ${order.orderCode}</title>
    <style>
      body { margin: 0; color: #263227; font-family: Arial, sans-serif; background: #f7f3e9; }
      main { max-width: 760px; margin: 32px auto; border: 1px solid #ded6c7; border-radius: 8px; padding: 32px; background: #fff; }
      h1 { margin: 0 0 8px; color: #388e3c; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      td { border-bottom: 1px solid #ded6c7; padding: 12px 0; vertical-align: top; }
      td:first-child { width: 220px; color: #6d756c; font-weight: 700; }
      .total { color: #8b5a2b; font-size: 1.35rem; font-weight: 800; }
      .print { margin-top: 24px; }
      button { border: 0; border-radius: 8px; padding: 12px 18px; font-weight: 800; background: #f5a623; cursor: pointer; }
      @media print { body { background: #fff; } main { border: 0; margin: 0; } .print { display: none; } }
    </style>
  </head>
  <body>
    <main>
      <h1>AgriShare - Biên nhận đầu tư</h1>
      <p>Mã đơn: <strong>${order.orderCode}</strong></p>
      <table>
        <tr><td>Khách hàng</td><td>${order.customerSnapshot?.fullName || ''}</td></tr>
        <tr><td>Điện thoại</td><td>${order.customerSnapshot?.phone || ''}</td></tr>
        <tr><td>Dự án</td><td>${order.projectSnapshot?.name || ''}</td></tr>
        <tr><td>Gói đầu tư</td><td>${order.packageSnapshot?.label || ''}</td></tr>
        <tr><td>Quyền lợi sản phẩm</td><td>${order.packageSnapshot?.rewardDescription || ''}</td></tr>
        <tr><td>Giá trị ghi nhận</td><td class="total">${formatCurrency(order.amount)}</td></tr>
        <tr><td>Trạng thái thanh toán</td><td>${order.payment?.status || ''}</td></tr>
        <tr><td>Mã giao dịch</td><td>${order.payment?.reference || 'Chưa cập nhật'}</td></tr>
        <tr><td>Ngày phát hành</td><td>${issuedAt ? new Date(issuedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}</td></tr>
      </table>
      <p>Biên nhận này được tạo từ hệ thống AgriShare để xác nhận thông tin đơn đầu tư. Nội dung pháp lý chính thức cần đối chiếu với hợp đồng/điều khoản đã ký.</p>
      <div class="print"><button onclick="window.print()">In hoặc lưu PDF</button></div>
    </main>
  </body>
</html>`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

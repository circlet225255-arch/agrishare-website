const Investment = require('../models/Investment');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Escrow = require('../models/Escrow');

// @desc    Create investment
// @route   POST /api/v1/investments
exports.createInvestment = async (req, res, next) => {
  try {
    const { projectId, packageId, amount } = req.body;

    // Validate project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Dự án không tìm thấy',
      });
    }

    // Validate investment amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền đầu tư phải lớn hơn 0',
      });
    }

    // Create investment
    const investment = await Investment.create({
      investorId: req.user._id,
      projectId,
      packageId,
      amount,
      status: 'pending',
    });

    // Create transaction
    await Transaction.create({
      userId: req.user._id,
      type: 'investment',
      amount,
      status: 'pending',
      description: `Đầu tư vào dự án: ${project.name}`,
      relatedInvestmentId: investment._id,
    });

    res.status(201).json({
      success: true,
      message: 'Đầu tư được tạo thành công',
      investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Confirm investment (move to escrow)
// @route   PUT /api/v1/investments/:id/confirm
exports.confirmInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id).populate('projectId');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Khoản đầu tư không tìm thấy',
      });
    }

    // Check if user is investor or admin
    if (investment.investorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xác nhận khoản đầu tư này',
      });
    }

    // Create escrow
    const escrow = await Escrow.create({
      investmentId: investment._id,
      projectId: investment.projectId._id,
      investorId: investment.investorId,
      farmerId: investment.projectId.farmerId,
      amount: investment.amount,
      status: 'held',
      releaseConditions: [
        {
          condition: 'Farm registration verified',
          verified: false,
        },
        {
          condition: 'QA/QC passed',
          verified: false,
        },
      ],
    });

    // Update investment status
    investment.status = 'escrow';
    investment.escrowInfo = {
      escrowId: escrow._id,
      holdAmount: investment.amount,
      releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    await investment.save();

    // Update project funding
    const project = await Project.findById(investment.projectId);
    project.funded += investment.amount;
    project.fundingPercentage = Math.min(100, (project.funded / project.capitalRequired) * 100);

    if (project.fundingPercentage >= 100) {
      project.status = 'active';
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Khoản đầu tư được xác nhận và đưa vào ký quỹ',
      investment,
      escrow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all investments by investor
// @route   GET /api/v1/investments
exports.getMyInvestments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { investorId: req.user._id };

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const investments = await Investment.find(filter)
      .populate('projectId', 'name category location fundingPercentage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Investment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: investments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      investments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single investment
// @route   GET /api/v1/investments/:id
exports.getInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('investorId', 'fullName email')
      .populate('projectId')
      .populate('escrowInfo.escrowId');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Khoản đầu tư không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all investments (admin)
// @route   GET /api/v1/admin/investments
exports.getAllInvestments = async (req, res, next) => {
  try {
    const { status, projectId, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (projectId) filter.projectId = projectId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const investments = await Investment.find(filter)
      .populate('investorId', 'fullName email')
      .populate('projectId', 'name category')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Investment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: investments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      investments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel investment
// @route   PUT /api/v1/investments/:id/cancel
exports.cancelInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Khoản đầu tư không tìm thấy',
      });
    }

    // Check if user is investor or admin
    if (investment.investorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy khoản đầu tư này',
      });
    }

    // Only cancel if status is pending
    if (investment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy khoản đầu tư ở trạng thái pending',
      });
    }

    investment.status = 'cancelled';
    await investment.save();

    res.status(200).json({
      success: true,
      message: 'Khoản đầu tư được hủy thành công',
      investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

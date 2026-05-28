const Project = require('../models/Project');
const ProjectUpdate = require('../models/ProjectUpdate');
const logAudit = require('../utils/auditLogger');

const toSlug = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const fallbackImages = {
  'Bưởi da xanh': 'assets/agrishare-concept-01.jpg',
  Gạo: 'assets/agrishare-concept-02.jpg',
  'Mật ong dú': 'assets/agrishare-concept-02.jpg',
  'Sữa chua': 'assets/agrishare-concept-03.jpg',
};

const mapProjectForMarketplace = (project) => {
  const locationParts = [project.location?.district, project.location?.province].filter(Boolean);

  return {
    id: String(project._id),
    name: project.name,
    category: project.category,
    location: locationParts.join(', ') || project.location?.province || 'Đang cập nhật',
    image: project.images?.[0] || fallbackImages[project.category] || 'assets/agrishare-concept-01.jpg',
    capital: project.capitalRequired,
    funded: project.fundingPercentage || Math.round(((project.funded || 0) / project.capitalRequired) * 100) || 0,
    duration: project.duration,
    returnRate: project.expectedReturnRate,
    risk: project.riskLevel,
    tags: project.tags || [],
    cta: 'Lựa chọn gói đầu tư',
    summary: project.description,
    slug: project.slug,
    shortDescription: project.shortDescription,
    farmerStory: project.farmerStory,
    riskDisclosure: project.riskDisclosure,
    producer: project.producer,
    logo: project.logo,
    facebookUrl: project.facebookUrl,
    productIntro: project.productIntro,
    highlights: project.highlights || [],
    qualityNotes: project.qualityNotes,
    specs: project.specs || {},
    faq: project.faq || [],
    sales: project.sales || {},
    packages: project.investmentPackages || [],
  };
};

// @desc    Create new project
// @route   POST /api/v1/projects
exports.createProject = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      farmerStory,
      riskDisclosure,
      producer,
      logo,
      facebookUrl,
      productIntro,
      highlights,
      qualityNotes,
      specs,
      faq,
      category,
      location,
      images,
      capitalRequired,
      funded,
      fundingPercentage,
      investmentPackages,
      duration,
      expectedReturnRate,
      riskLevel,
      tags,
      status,
      metrics,
      sales,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      slug: toSlug(name),
      shortDescription,
      farmerStory,
      riskDisclosure,
      producer,
      logo,
      facebookUrl,
      productIntro,
      highlights,
      qualityNotes,
      specs,
      faq,
      farmerId: req.user._id,
      category,
      location,
      images,
      capitalRequired,
      funded,
      fundingPercentage,
      investmentPackages,
      duration,
      expectedReturnRate,
      riskLevel,
      tags,
      status: status || 'drafting',
      metrics,
      sales,
      specs,
    });

    await logAudit({
      req,
      action: 'project.created',
      entityType: 'Project',
      entityId: project._id,
      after: project,
      metadata: { name: project.name },
    });

    res.status(201).json({
      success: true,
      message: 'Dự án được tạo thành công',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all projects
// @route   GET /api/v1/projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const { category, status, province, page = 1, limit = 10, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (province) filter['location.province'] = province;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(filter)
      .populate('farmerId', 'fullName email phone')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get marketplace projects for frontend
// @route   GET /api/v1/projects/marketplace
exports.getMarketplaceProjects = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { status: { $in: ['funding', 'active', 'ongoing'] } };

    if (category) {
      filter.category = category;
    }

    const priority = {
      'Bưởi da xanh': 1,
      Gạo: 2,
      'Mật ong dú': 3,
      'Sữa chua': 4,
    };
    const projects = (await Project.find(filter)).sort(
      (a, b) => (priority[a.category] || 99) - (priority[b.category] || 99),
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects.map(mapProjectForMarketplace),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const query = req.params.id.match(/^[a-f\d]{24}$/i) ? { _id: req.params.id } : { slug: req.params.id };
    const project = await Project.findOne(query).populate('farmerId', 'fullName email phone');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Dự án không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Dự án không tìm thấy',
      });
    }

    const canUpdateProject =
      req.user.role === 'admin' ||
      req.user.role === 'farm' ||
      project.farmerId.toString() === req.user._id.toString();

    if (!canUpdateProject) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật dự án này',
      });
    }

    const before = project.toObject();
    const payload = { ...req.body };
    if (payload.name && !payload.slug) {
      payload.slug = toSlug(payload.name);
    }

    project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    await logAudit({
      req,
      action: 'project.updated',
      entityType: 'Project',
      entityId: project._id,
      before,
      after: project,
      metadata: { name: project.name },
    });

    res.status(200).json({
      success: true,
      message: 'Dự án được cập nhật thành công',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Dự án không tìm thấy',
      });
    }

    // Check if user is project owner or admin
    if (project.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa dự án này',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Dự án được xóa thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjectUpdates = async (req, res) => {
  try {
    const updates = await ProjectUpdate.find({ projectId: req.params.id })
      .populate('createdBy', 'fullName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProjectUpdate = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Dự án không tìm thấy' });
    }

    const canCreateUpdate =
      req.user.role === 'admin' ||
      req.user.role === 'farm' ||
      req.user.role === 'auditor' ||
      project.farmerId.toString() === req.user._id.toString();

    if (!canCreateUpdate) {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật nhật ký dự án' });
    }

    const update = await ProjectUpdate.create({
      ...req.body,
      projectId: project._id,
      createdBy: req.user._id,
    });

    await logAudit({
      req,
      action: 'project_update.created',
      entityType: 'ProjectUpdate',
      entityId: update._id,
      after: update,
      metadata: { projectId: project._id, projectName: project.name, type: update.type },
    });

    res.status(201).json({
      success: true,
      message: 'Nhật ký mùa vụ đã được tạo',
      update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get projects by farmer
// @route   GET /api/v1/projects/farmer/:farmerId
exports.getProjectsByFarmer = async (req, res, next) => {
  try {
    const projects = await Project.find({ farmerId: req.params.farmerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project funding
// @route   PUT /api/v1/projects/:id/funding
exports.updateProjectFunding = async (req, res, next) => {
  try {
    const { amountToAdd } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Dự án không tìm thấy',
      });
    }

    project.funded += amountToAdd;
    project.fundingPercentage = Math.min(100, (project.funded / project.capitalRequired) * 100);

    if (project.fundingPercentage >= 100) {
      project.status = 'active';
    }

    await project.save();

    await logAudit({
      req,
      action: 'project.funding_updated',
      entityType: 'Project',
      entityId: project._id,
      after: project,
      metadata: { amountToAdd },
    });

    res.status(200).json({
      success: true,
      message: 'Tài chính dự án được cập nhật',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

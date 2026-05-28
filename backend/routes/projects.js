const express = require('express');
const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectsByFarmer,
  updateProjectFunding,
  getMarketplaceProjects,
  getProjectUpdates,
  createProjectUpdate,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/marketplace', getMarketplaceProjects);
router.get('/farmer/:farmerId', getProjectsByFarmer);
router.get('/', getAllProjects);
router.get('/:id/updates', getProjectUpdates);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, authorize('farmer', 'farm', 'admin'), createProject);
router.put('/:id', protect, authorize('farmer', 'farm', 'admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);
router.put('/:id/funding', protect, authorize('admin', 'sale'), updateProjectFunding);
router.post('/:id/updates', protect, authorize('farmer', 'farm', 'auditor', 'admin'), createProjectUpdate);

module.exports = router;

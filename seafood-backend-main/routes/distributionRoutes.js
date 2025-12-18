// routes/distributorRoutes.js
const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributionController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ DISTRIBUTOR
router.get('/my-lots', verifyToken, authorizeRoles('Distributor'), distributorController.getMyLots);
router.get('/detail/:id', verifyToken, authorizeRoles('Distributor'), distributorController.getLotDetail);
router.post('/distribution/:id', verifyToken, authorizeRoles('Distributor'), distributorController.addDistributionInfo);
router.post('/transfer/:id', verifyToken, authorizeRoles('Distributor'), distributorController.transferToRetailer);

module.exports = router;

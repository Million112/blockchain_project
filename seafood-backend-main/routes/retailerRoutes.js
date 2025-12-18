// routes/retailerRoutes.js
const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ RETAILER
router.get('/inventory', verifyToken, authorizeRoles('Retailer'), retailerController.getMyInventory);
router.get('/detail/:id', verifyToken, authorizeRoles('Retailer'), retailerController.getLotDetail);
router.post('/receive/:id', verifyToken, authorizeRoles('Retailer'), retailerController.receiveSeafood);
router.post('/sell/:id', verifyToken, authorizeRoles('Retailer'), retailerController.sellSeafood);

module.exports = router;



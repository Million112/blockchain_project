// routes/transportRoutes.js
const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ TRANSPORT mới dùng
router.get('/my-shipments', verifyToken, authorizeRoles('Transporter'), transportController.getMyShipments);
router.get('/detail/:id', verifyToken, authorizeRoles('Transporter'), transportController.getShipmentDetail);
router.post('/start/:id', verifyToken, authorizeRoles('Transporter'), transportController.startTransport);
router.post('/complete/:id', verifyToken, authorizeRoles('Transporter'), transportController.completeTransport);
router.post('/transfer/:id', verifyToken, authorizeRoles('Transporter'), transportController.transferToDistributor);

module.exports = router;


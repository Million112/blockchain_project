const express = require('express');
const router = express.Router();
const fishermanController = require('../controllers/fishermanController');

// Middleware auth nếu có (JWT, cookie, ...)

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Tạo lô hàng
router.post('/create', verifyToken,authorizeRoles("Fisherman"), fishermanController.createCatch);

// Cập nhật thông tin lô hàng
router.put('/update/:id', verifyToken, fishermanController.updateCatchInfo);

// Chuyển lô hàng cho Processor
router.post('/transfer/:id', verifyToken, fishermanController.transferCatch);

// Lấy danh sách lô hàng của mình
router.get('/my-catches', verifyToken, fishermanController.getMyCatches);

// Xem chi tiết lô hàng
router.get('/detail/:id', verifyToken, fishermanController.getCatchDetail);

module.exports = router;

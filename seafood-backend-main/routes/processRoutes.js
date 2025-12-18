// const express = require('express');
// const router = express.Router();
// const processorCtrl = require('../controllers/processorController');

// router.post('/receive', processorCtrl.receiveFromFisherman);
// router.post('/update', processorCtrl.updateProcessingStatus);
// router.get('/owned/:ownerId', processorCtrl.getOwnedSeafoods);
// router.get('/history/:seafoodId', processorCtrl.getSeafoodHistory);

// module.exports = router;


// routes/processorRoutes.js
const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Chỉ PROCESSOR mới truy cập
router.get('/my-lots', verifyToken, authorizeRoles('Processor'), processorController.getMyLots);
router.get('/detail/:id', verifyToken, authorizeRoles('Processor'), processorController.getLotDetail);
router.post('/process/:id', verifyToken, authorizeRoles('Processor'), processorController.addProcessInfo);
router.post('/transfer/:id', verifyToken, authorizeRoles('Processor'), processorController.transferToTransport);

module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllSeafoods, createSeafood, readSeafood } = require('../controllers/seafoodController');

router.get('/',verifyToken, authorizeRoles('Fisherman','Admin'), getAllSeafoods);
router.post('/',verifyToken, authorizeRoles('Fisherman'), createSeafood);
router.get('/:id',verifyToken, authorizeRoles('Fisherman'), readSeafood);

module.exports = router;

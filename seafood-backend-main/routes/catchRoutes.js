const express = require('express');
const router = express.Router();
const { addCatchInfo } = require('../controllers/catchController');

router.post('/', addCatchInfo);

module.exports = router;

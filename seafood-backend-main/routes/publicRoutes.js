// routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

// Public trace: không cần verifyAuth
router.get("/trace/:id", publicController.traceSeafood);

module.exports = router;

const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/reporting.controller');
const { authMiddleware } = require('../middlewares/basicAuth');

router.get('/overdue-last-month', authMiddleware, reportingController.getOverdueBorrowsLastMonth);
router.get('/all-borrows-last-month', authMiddleware, reportingController.getAllBorrowsLastMonth);

module.exports = router;

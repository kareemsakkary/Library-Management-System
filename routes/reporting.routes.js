const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/reporting.controller');

router.get('/overdue-last-month', reportingController.getOverdueBorrowsLastMonth);
router.get('/all-borrows-last-month', reportingController.getAllBorrowsLastMonth);

module.exports = router;

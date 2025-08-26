const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing.controller');
const { validateBorrow, validateReturn, validateBorrowedBooks } = require('../middlewares/validation');

router.post('/checkout', validateBorrow, borrowingController.checkoutBook);
router.put('/return/:id', validateReturn, borrowingController.returnBook);
router.get('/borrower/:borrower_id', validateBorrowedBooks, borrowingController.getBorrowedBooks);
router.get('/overdue', borrowingController.getOverdueBooks);

module.exports = router;

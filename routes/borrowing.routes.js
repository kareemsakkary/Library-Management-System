const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing.controller');
const { validateBorrow, validateReturn, validateBorrowedBooks } = require('../middlewares/validation');
const { authMiddleware } = require('../middlewares/basicAuth');

router.post('/checkout', authMiddleware, validateBorrow, borrowingController.checkoutBook);
router.put('/return/:id', authMiddleware, validateReturn, borrowingController.returnBook);
router.get('/borrower/:borrower_id', validateBorrowedBooks, borrowingController.getBorrowedBooks);
router.get('/overdue', borrowingController.getOverdueBooks);

module.exports = router;

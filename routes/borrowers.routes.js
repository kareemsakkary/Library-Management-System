const express = require('express');
const router = express.Router();
const borrowersController = require('../controllers/borrowers.controller');
const { validateBorrower, validateBorrowerUpdate } = require('../middlewares/validation');
const { createBorrowerRateLimiter } = require('../middlewares/rateLimiter');
const { authMiddleware } = require('../middlewares/basicAuth');

router.post('/', authMiddleware, createBorrowerRateLimiter, validateBorrower, borrowersController.createBorrower);
router.put('/:id', validateBorrowerUpdate, borrowersController.updateBorrower);
router.delete('/:id', borrowersController.deleteBorrower);
router.get('/', borrowersController.getAllBorrowers);

module.exports = router;

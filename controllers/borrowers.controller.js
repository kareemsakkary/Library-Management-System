const borrowerService = require('../services/borrowers.service');

exports.createBorrower = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const borrower = await borrowerService.createBorrower(name, email);
    res.status(201).json(borrower);
  } catch (err) {
    next(err);
  }
};

exports.updateBorrower = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const borrower = await borrowerService.updateBorrower(id, name, email);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.status(200).json(borrower);
  } catch (err) {
    next(err);
  }
};

exports.deleteBorrower = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await borrowerService.deleteBorrower(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getAllBorrowers = async (req, res, next) => {
  try {
    const borrowers = await borrowerService.getAllBorrowers();
    res.status(200).json(borrowers);
  } catch (err) {
    next(err);
  }
};

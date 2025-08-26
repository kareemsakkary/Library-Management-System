const reportingService = require('../services/reporting.service');

exports.getOverdueBorrowsLastMonth = async (req, res, next) => {
  try {
    const data = await reportingService.getOverdueBorrowsLastMonth();
    const format = req.query.format || 'json'; // Default to JSON

    if (format === 'csv') {
      const csv = await reportingService.generateCsv(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('overdue_borrows_last_month.csv');
      return res.send(csv);
    } else if (format === 'xlsx') {
      const buffer = await reportingService.generateXlsx(data, 'Overdue Borrows Last Month');
      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment('overdue_borrows_last_month.xlsx');
      return res.send(buffer);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllBorrowsLastMonth = async (req, res, next) => {
  try {
    const data = await reportingService.getAllBorrowsLastMonth();
    const format = req.query.format || 'json'; // Default to JSON

    if (format === 'csv') {
      const csv = await reportingService.generateCsv(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('all_borrows_last_month.csv');
      return res.send(csv);
    } else if (format === 'xlsx') {
      const buffer = await reportingService.generateXlsx(data, 'All Borrows Last Month');
      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment('all_borrows_last_month.xlsx');
      return res.send(buffer);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    next(err);
  }
};

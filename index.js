const express = require('express');
require('dotenv').config();
const booksRoutes = require('./routes/books.routes');
const borrowersRoutes = require('./routes/borrowers.routes');
const borrowingRoutes = require('./routes/borrowing.routes');
const reportingRoutes = require('./routes/reporting.routes');
const { CustomError } = require('./utils/CustomError');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/borrowers', borrowersRoutes);
app.use('/api/borrowing', borrowingRoutes);
app.use('/api/reports', reportingRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details
    });
  }

  // Handle express-validator errors specifically
  if (err.array) { // Check if it's an express-validator error object
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: err.array()
    });
  }

  // Default to 500 Internal Server Error for unhandled exceptions
  res.status(500).json({
    status: 'error',
    message: 'An unexpected internal server error occurred.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

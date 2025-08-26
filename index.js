const express = require('express');
require('dotenv').config();
const booksRoutes = require('./routes/books.routes');
const borrowersRoutes = require('./routes/borrowers.routes');
const borrowingRoutes = require('./routes/borrowing.routes');
const reportingRoutes = require('./routes/reporting.routes');

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
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

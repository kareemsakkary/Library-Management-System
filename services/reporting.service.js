const db = require('../db');
const { stringify } = require('csv-stringify');
const ExcelJS = require('exceljs');

exports.getOverdueBorrowsLastMonth = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { rows } = await db.query(
    `SELECT 
      br.id as record_id,
      b.title as book_title,
      b.author as book_author,
      bor.name as borrower_name,
      bor.email as borrower_email,
      br.borrow_date,
      br.due_date
    FROM borrow_records br
    JOIN books b ON br.book_id = b.id
    JOIN borrowers bor ON br.borrower_id = bor.id
    WHERE br.return_date IS NULL 
    AND br.due_date < CURRENT_DATE
    AND br.borrow_date >= $1;`,
    [thirtyDaysAgo]
  );
  return rows;
};

exports.getAllBorrowsLastMonth = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { rows } = await db.query(
    `SELECT 
      br.id as record_id,
      b.title as book_title,
      b.author as book_author,
      bor.name as borrower_name,
      bor.email as borrower_email,
      br.borrow_date,
      br.due_date,
      br.return_date
    FROM borrow_records br
    JOIN books b ON br.book_id = b.id
    JOIN borrowers bor ON br.borrower_id = bor.id
    WHERE br.borrow_date >= $1;`,
    [thirtyDaysAgo]
  );
  return rows;
};

exports.generateCsv = (data) => {
  return new Promise((resolve, reject) => {
    stringify(data, { header: true }, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
};

exports.generateXlsx = async (data, sheetName = 'Report') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (data.length > 0) {
    // Add headers
    worksheet.columns = Object.keys(data[0]).map(key => ({ header: key.replace(/_/g, ' ').toUpperCase(), key: key }));
    // Add rows
    worksheet.addRows(data);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

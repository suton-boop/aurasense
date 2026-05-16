const mysql = require('mysql2/promise');

async function checkColumns() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'aurasense' });
  try {
    const [rows] = await pool.query('SHOW COLUMNS FROM products');
    console.log(rows);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
checkColumns();

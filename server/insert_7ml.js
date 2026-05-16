const mysql = require('mysql2/promise');

async function insert7ml() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'aurasense' });
  try {
    await pool.query("INSERT IGNORE INTO supplies (id, name, type, size_ml, stock_qty, min_stock) VALUES ('SUP7', 'Botol Decant 7ml', 'botol', 7, 0, 20)");
    console.log('Inserted 7ml supply');
  } catch (err) {
    console.log('Error:', err.message);
  }
  process.exit(0);
}
insert7ml();

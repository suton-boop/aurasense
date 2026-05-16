const mysql = require('mysql2/promise');

async function clearData() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aurasense',
  });

  try {
    console.log('Menghapus data transaksi...');
    await pool.query('TRUNCATE TABLE transactions');
    
    console.log('Menghapus data pengeluaran...');
    await pool.query('TRUNCATE TABLE expenses');

    console.log('Mereset stok botol dan supply menjadi 0...');
    await pool.query('UPDATE supplies SET stock_qty = 0');
    
    console.log('Data berhasil dibersihkan! Master produk tetap aman.');
  } catch (err) {
    console.error('Terjadi kesalahan:', err.message);
  } finally {
    process.exit(0);
  }
}

clearData();

const mysql = require('mysql2/promise');

async function testInsert() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'aurasense' });
  try {
    const payload = {
      id: 'PRD9999', brand: 'Test', variant: 'Test', category: 'EDP', bottle_capacity: 100, stock_ml: 10, image: '', note: '',
      prices: { 1: 1000 }, capital_price: 100, barcode: '123', aroma_category: 'Woody'
    };
    await pool.query(
        `INSERT INTO products (id, brand, variant, category, bottle_capacity, stock_ml, image, note, prices, capital_price, barcode, aroma_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [payload.id, payload.brand, payload.variant, payload.category, payload.bottle_capacity, payload.stock_ml, payload.image, payload.note, JSON.stringify(payload.prices), payload.capital_price, payload.barcode, payload.aroma_category]
      );
    console.log('Success');
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
testInsert();

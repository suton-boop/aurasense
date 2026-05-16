const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

const payload = JSON.stringify({
  id: 'PRD9998', brand: 'Test2', variant: 'Test2', category: 'EDP', bottle_capacity: 100, stock_ml: 10, image: '', note: '',
  prices: { 1: 1000 }, capital_price: 100, barcode: '123', aroma_category: 'Woody'
});

req.write(payload);
req.end();

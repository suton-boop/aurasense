const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf-8');
content = content.replace(/\.toLocaleString\(\)/g, ".toLocaleString('id-ID')");
fs.writeFileSync('src/App.jsx', content);

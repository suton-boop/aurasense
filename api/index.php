<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove '/api' prefix if present
if (strpos($path, '/api') === 0) {
    $path = substr($path, 4);
}
// Remove base folder path if running from subfolder (e.g. /aurasense/api)
// A more robust way is to replace the script folder path
$script_path = dirname($_SERVER['SCRIPT_NAME']); // usually /api or /aurasense/api
if ($script_path !== '/' && strpos($path, $script_path) === 0) {
    $path = substr($path, strlen($script_path));
}

$path = rtrim($path, '/');
if ($path === '') $path = '/';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

try {
    // === AUTH ===
    if ($method === 'POST' && $path === '/login') {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND password = ?');
        $stmt->execute([$username, $password]);
        $user = $stmt->fetch();
        if ($user) {
            jsonResponse(['success' => true, 'user' => ['username' => $user['username'], 'role' => $user['role']]]);
        } else {
            jsonResponse(['success' => false, 'message' => 'Username atau password salah'], 401);
        }
    }

    // === USERS ===
    elseif ($method === 'GET' && $path === '/users') {
        $stmt = $pdo->query('SELECT id, username, role FROM users');
        jsonResponse($stmt->fetchAll());
    }
    elseif ($method === 'POST' && $path === '/users') {
        $stmt = $pdo->prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
        $stmt->execute([
            $input['username'] ?? '',
            $input['password'] ?? '',
            $input['role'] ?? 'ADMIN'
        ]);
        jsonResponse(['success' => true]);
    }
    elseif ($method === 'PUT' && preg_match('/^\/users\/(.+)$/', $path, $matches)) {
        $id = $matches[1];
        if (!empty($input['password'])) {
            $stmt = $pdo->prepare('UPDATE users SET username=?, password=?, role=? WHERE id=?');
            $stmt->execute([$input['username'] ?? '', $input['password'], $input['role'] ?? 'ADMIN', $id]);
        } else {
            $stmt = $pdo->prepare('UPDATE users SET username=?, role=? WHERE id=?');
            $stmt->execute([$input['username'] ?? '', $input['role'] ?? 'ADMIN', $id]);
        }
        jsonResponse(['success' => true]);
    }
    elseif ($method === 'DELETE' && preg_match('/^\/users\/(.+)$/', $path, $matches)) {
        $id = $matches[1];
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
    }

    // === UPLOAD ===
    elseif ($method === 'POST' && $path === '/upload') {
        if (!isset($_FILES['image'])) {
            jsonResponse(['error' => 'No file uploaded'], 400);
        }
        $target_dir = __DIR__ . '/uploads/';
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = time() . '.' . $ext;
        $target_file = $target_dir . $filename;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'];
            $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
            $url = $protocol . '://' . $host . $base . '/uploads/' . $filename;
            jsonResponse(['url' => $url]);
        } else {
            jsonResponse(['error' => 'Upload failed'], 500);
        }
    }

    // === PRODUCTS ===
    elseif ($method === 'GET' && $path === '/products') {
        $stmt = $pdo->query('SELECT * FROM products');
        $products = $stmt->fetchAll();
        foreach ($products as &$p) {
            $p['prices'] = is_string($p['prices']) ? json_decode($p['prices'], true) : $p['prices'];
        }
        jsonResponse($products);
    }
    elseif ($method === 'POST' && $path === '/products') {
        $id = !empty($input['id']) ? $input['id'] : 'PRD' . substr((string)time(), -4);
        $prices = isset($input['prices']) ? json_encode($input['prices']) : '[]';
        
        $stmt = $pdo->prepare("INSERT INTO products (id, brand, variant, category, bottle_capacity, stock_ml, image, note, prices, capital_price, barcode, aroma_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id, $input['brand'] ?? '', $input['variant'] ?? '', $input['category'] ?? '', 
            $input['bottle_capacity'] ?? null, $input['stock_ml'] ?? 0, $input['image'] ?? '', 
            $input['note'] ?? '', $prices, $input['capital_price'] ?? 0, 
            $input['barcode'] ?? '', $input['aroma_category'] ?? ''
        ]);
        jsonResponse(['success' => true]);
    }
    elseif ($method === 'PUT' && preg_match('/^\/products\/(.+)$/', $path, $matches)) {
        $id = $matches[1];
        $prices = isset($input['prices']) ? json_encode($input['prices']) : '[]';
        
        $stmt = $pdo->prepare("UPDATE products SET brand=?, variant=?, category=?, bottle_capacity=?, stock_ml=?, image=?, note=?, prices=?, capital_price=?, barcode=?, aroma_category=? WHERE id=?");
        $stmt->execute([
            $input['brand'] ?? '', $input['variant'] ?? '', $input['category'] ?? '', 
            $input['bottle_capacity'] ?? null, $input['stock_ml'] ?? 0, $input['image'] ?? '', 
            $input['note'] ?? '', $prices, $input['capital_price'] ?? 0, 
            $input['barcode'] ?? '', $input['aroma_category'] ?? '', $id
        ]);
        jsonResponse(['success' => true]);
    }
    elseif ($method === 'DELETE' && preg_match('/^\/products\/(.+)$/', $path, $matches)) {
        $id = $matches[1];
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
    }

    // === TRANSACTIONS ===
    elseif ($method === 'GET' && $path === '/transactions') {
        $stmt = $pdo->query('SELECT * FROM transactions');
        $transactions = $stmt->fetchAll();
        foreach ($transactions as &$t) {
            $t['items'] = is_string($t['items']) ? json_decode($t['items'], true) : $t['items'];
        }
        jsonResponse($transactions);
    }
    elseif ($method === 'POST' && $path === '/transactions') {
        $transaction = $input;
        $id = (string)time();
        $transaction_id = 'TRX' . strtoupper(substr(md5(uniqid()), 0, 9));
        $timestamp = date('Y-m-d H:i:s');
        
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("INSERT INTO transactions (id, transaction_id, customer_name, shipping_type, shipping_cost, payment_method, total_amount, timestamp, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id, $transaction_id, $transaction['customer_name'] ?? '', 
            $transaction['shipping_type'] ?? '', $transaction['shipping_cost'] ?? 0, 
            $transaction['payment_method'] ?? '', $transaction['total_amount'] ?? 0, 
            $timestamp, json_encode($transaction['items'] ?? [])
        ]);
        
        if (isset($transaction['items']) && is_array($transaction['items'])) {
            foreach ($transaction['items'] as $item) {
                $qty = $item['quantity'] ?? 1;
                $size = $item['selected_size'] ?? 1;
                $total_ml = $qty * $size;
                
                $stmt = $pdo->prepare('UPDATE products SET stock_ml = stock_ml - ? WHERE id = ?');
                $stmt->execute([$total_ml, $item['id']]);
                
                $stmt = $pdo->prepare('UPDATE supplies SET stock_qty = stock_qty - ? WHERE type = "botol" AND size_ml = ?');
                $stmt->execute([$qty, $size]);
            }
        }
        
        $pdo->exec('UPDATE supplies SET stock_qty = GREATEST(0, stock_qty - 1) WHERE id IN ("SUP_PLSTK", "SUP_STIKER")');
        
        $pdo->commit();
        jsonResponse(['success' => true, 'transaction_id' => $transaction_id]);
    }

    // === SUPPLIES ===
    elseif ($method === 'GET' && $path === '/supplies') {
        $stmt = $pdo->query('SELECT * FROM supplies');
        jsonResponse($stmt->fetchAll());
    }
    elseif ($method === 'PUT' && preg_match('/^\/supplies\/(.+)$/', $path, $matches)) {
        $id = $matches[1];
        $stmt = $pdo->prepare('UPDATE supplies SET stock_qty = ? WHERE id = ?');
        $stmt->execute([$input['stock_qty'] ?? 0, $id]);
        jsonResponse(['success' => true]);
    }

    // === EXPENSES ===
    elseif ($method === 'GET' && $path === '/expenses') {
        $stmt = $pdo->query('SELECT * FROM expenses ORDER BY date DESC');
        jsonResponse($stmt->fetchAll());
    }
    elseif ($method === 'POST' && $path === '/expenses') {
        $id = 'EXP' . time();
        $date = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare('INSERT INTO expenses (id, date, category, amount, description) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $id, $date, $input['category'] ?? '', 
            $input['amount'] ?? 0, $input['description'] ?? ''
        ]);
        
        if (!empty($input['supply_id']) && !empty($input['supply_qty'])) {
            $stmt = $pdo->prepare('UPDATE supplies SET stock_qty = stock_qty + ? WHERE id = ?');
            $stmt->execute([$input['supply_qty'], $input['supply_id']]);
        }
        jsonResponse(['success' => true]);
    }

    // 404
    else {
        jsonResponse(['error' => 'Endpoint Not Found'], 404);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>

<?php
require_once __DIR__ . '/api/db.php';
try {
    $pdo->exec("ALTER TABLE products ADD COLUMN is_active TINYINT(1) DEFAULT 1;");
    echo "Success";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

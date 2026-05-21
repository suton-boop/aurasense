<?php
require_once __DIR__ . '/api/db.php';
try {
    // Ensure column is_active exists
    try {
        $pdo->exec("ALTER TABLE products ADD COLUMN is_active TINYINT(1) DEFAULT 1;");
    } catch (Exception $ex) {
        // Ignore if column already exists
    }
    
    // Ensure SUP1 (Botol Decant 1ml) exists in supplies
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM supplies WHERE id = 'SUP1'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO supplies (id, name, type, size_ml, stock_qty, min_stock) VALUES ('SUP1', 'Botol Decant 1ml', 'botol', 1, 0, 20);");
        echo "Inserted SUP1 successfully. ";
    }
    
    echo "Success";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>


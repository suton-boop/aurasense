<?php
$host = 'localhost'; // Nanti ubah saat di Hostinger
$db   = 'u122685751_aurasense'; // Ubah sesuai nama database di Hostinger
$user = 'u122685751_aurasense'; // Ubah sesuai user database di Hostinger
$pass = '@Talita31102014#'; // Ubah sesuai password database di Hostinger

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];



try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
     exit();
}
?>

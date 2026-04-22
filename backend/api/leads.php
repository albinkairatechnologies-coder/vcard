<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

function jsonResponse(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method !== 'POST') {
    jsonResponse(405, ['error' => 'Method not allowed.']);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$slug = trim($body['slug'] ?? '');
$name = substr(trim($body['name'] ?? ''), 0, 120);
$email = substr(trim($body['email'] ?? ''), 0, 190);
$phone = substr(trim($body['phone'] ?? ''), 0, 30);
$note = trim($body['note'] ?? '');

if (!$slug) jsonResponse(400, ['error' => 'Slug is required.']);
if (!$name) jsonResponse(422, ['error' => 'Name is required.']);
if (!$email && !$phone) jsonResponse(422, ['error' => 'Email or phone is required.']);
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) jsonResponse(422, ['error' => 'Invalid email format.']);

try {
    $db = getDB();

    $db->exec("
        CREATE TABLE IF NOT EXISTS card_leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            card_id INT NOT NULL,
            lead_name VARCHAR(120) NOT NULL,
            lead_email VARCHAR(190) NULL,
            lead_phone VARCHAR(30) NULL,
            lead_note TEXT NULL,
            source VARCHAR(40) NOT NULL DEFAULT 'public_card',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_card_id (card_id),
            CONSTRAINT fk_card_leads_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $stmt = $db->prepare("
        SELECT c.id
        FROM cards c
        JOIN users u ON u.id = c.user_id
        WHERE u.slug = ? AND c.is_active = 1
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $card = $stmt->fetch();

    if (!$card) jsonResponse(404, ['error' => 'Card not found.']);

    $insert = $db->prepare("
        INSERT INTO card_leads (card_id, lead_name, lead_email, lead_phone, lead_note, source)
        VALUES (?, ?, ?, ?, ?, 'public_card')
    ");
    $insert->execute([(int)$card['id'], $name, $email ?: null, $phone ?: null, $note ?: null]);

    jsonResponse(201, ['message' => 'Lead captured successfully.']);
} catch (Exception $e) {
    jsonResponse(500, ['error' => 'Failed to capture lead.']);
}

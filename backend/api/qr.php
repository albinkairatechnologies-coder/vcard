<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

function jsonError(int $status, string $message): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError(405, 'Method not allowed.');
}

$slug = trim($_GET['slug'] ?? '');
if (!$slug) jsonError(400, 'Slug is required.');

// Verify slug exists in DB
try {
    $db   = getDB();
    $stmt = $db->prepare("SELECT id FROM users WHERE slug = ?");
    $stmt->execute([$slug]);
    if (!$stmt->fetch()) jsonError(404, 'User not found.');
} catch (Exception $e) {
    jsonError(500, 'Database error.');
}

$target = trim($_GET['target'] ?? '');
if ($target && !filter_var($target, FILTER_VALIDATE_URL)) {
    jsonError(422, 'Invalid target URL.');
}

$cardUrl = $target ?: ('https://vcardfrontendnew.vercel.app/card/' . $slug);

$options = new QROptions([
    'outputType'  => QRCode::OUTPUT_IMAGE_PNG,
    'eccLevel'    => QRCode::ECC_M,
    'scale'       => 8,
    'imageBase64' => false,
    'quietzoneSize' => 2,
]);

header('Content-Type: image/png');
header('Cache-Control: public, max-age=86400');
header('Content-Disposition: inline; filename="qr-' . $slug . '.png"');

echo (new QRCode($options))->render($cardUrl);

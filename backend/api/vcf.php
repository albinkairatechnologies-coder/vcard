<?php
require_once __DIR__ . '/../config/db.php';

function jsonError(int $status, string $message): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

function vcfEscape(string $value): string {
    return addcslashes($value, "\\\n,;:");
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

try {
    $db = getDB();

    $stmt = $db->prepare("
        SELECT u.name, u.email, u.slug,
               c.id, c.title, c.company, c.bio, c.photo
        FROM users u
        JOIN cards c ON c.user_id = u.id
        WHERE u.slug = ? AND c.is_active = 1
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $card = $stmt->fetch();

    if (!$card) jsonError(404, 'Card not found.');

    $stmt = $db->prepare(
        "SELECT type, label, url FROM card_links WHERE card_id = ? ORDER BY sort_order ASC"
    );
    $stmt->execute([$card['id']]);
    $links = $stmt->fetchAll();
} catch (Exception $e) {
    jsonError(500, 'Database error.');
}

// Build .vcf content
$lines = [];
$lines[] = 'BEGIN:VCARD';
$lines[] = 'VERSION:3.0';
$lines[] = 'FN:'  . vcfEscape($card['name']);
$lines[] = 'N:'   . vcfEscape($card['name']) . ';;;;';

if ($card['title'] || $card['company']) {
    $lines[] = 'ORG:'   . vcfEscape($card['company'] ?? '');
    $lines[] = 'TITLE:' . vcfEscape($card['title']   ?? '');
}

if ($card['email']) {
    $lines[] = 'EMAIL;TYPE=INTERNET:' . vcfEscape($card['email']);
}

if ($card['bio']) {
    $lines[] = 'NOTE:' . vcfEscape($card['bio']);
}

// Map link types to vCard fields
foreach ($links as $link) {
    $type = strtolower($link['type']);
    $url  = $link['url'];

    switch ($type) {
        case 'phone':
        case 'whatsapp':
            // Strip non-numeric for TEL
            $tel = preg_replace('/[^\d+]/', '', $url);
            if ($tel) $lines[] = 'TEL;TYPE=CELL:' . $tel;
            break;

        case 'email':
            $lines[] = 'EMAIL;TYPE=INTERNET:' . vcfEscape($url);
            break;

        case 'website':
            $lines[] = 'URL:' . vcfEscape($url);
            break;

        case 'linkedin':
        case 'github':
        case 'twitter':
        case 'instagram':
            $lines[] = 'URL;TYPE=' . strtoupper($type) . ':' . vcfEscape($url);
            break;

        default:
            if (filter_var($url, FILTER_VALIDATE_URL)) {
                $lines[] = 'URL:' . vcfEscape($url);
            }
            break;
    }
}

// Photo URL as vCard photo
if ($card['photo']) {
    $scheme   = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host     = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $photoUrl = $scheme . '://' . $host . '/smartcard/backend/uploads/' . basename($card['photo']);
    $lines[]  = 'PHOTO;VALUE=URI:' . $photoUrl;
}

$lines[] = 'END:VCARD';

$vcf      = implode("\r\n", $lines) . "\r\n";
$filename = $slug . '.vcf';

header('Content-Type: text/vcard; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($vcf));
header('Cache-Control: no-cache');

echo $vcf;

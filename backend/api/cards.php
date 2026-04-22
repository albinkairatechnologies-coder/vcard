<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/jwt.php';

header('Content-Type: application/json');

function jsonResponse(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function requireAuth(): object {
    $user = getAuthUser();
    if (!$user) {
        jsonResponse(401, ['error' => 'Unauthorized. Valid token required.']);
    }
    return $user;
}

function getCardWithLinks(PDO $db, int $cardId): ?array {
    $stmt = $db->prepare("SELECT * FROM cards WHERE id = ?");
    $stmt->execute([$cardId]);
    $card = $stmt->fetch();
    if (!$card) return null;

    $stmt = $db->prepare(
        "SELECT id, type, label, url, sort_order FROM card_links WHERE card_id = ? ORDER BY sort_order ASC"
    );
    $stmt->execute([$cardId]);
    $card['links'] = $stmt->fetchAll();
    return $card;
}

function saveLinks(PDO $db, int $cardId, array $links): void {
    $db->prepare("DELETE FROM card_links WHERE card_id = ?")->execute([$cardId]);
    if (empty($links)) return;

    $stmt = $db->prepare(
        "INSERT INTO card_links (card_id, type, label, url, sort_order) VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($links as $i => $link) {
        $type  = substr(trim($link['type']  ?? ''), 0, 30);
        $label = substr(trim($link['label'] ?? ''), 0, 100);
        $url   = substr(trim($link['url']   ?? ''), 0, 500);
        if ($url) {
            $stmt->execute([$cardId, $type, $label, $url, $i]);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Public route — no auth: GET /api/cards/public/:slug
if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'public') {
    $slug = trim($_GET['slug'] ?? '');
    if (!$slug) jsonResponse(400, ['error' => 'Slug is required.']);

    try {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT u.name, u.email, u.slug, c.id, c.title, c.company, c.bio, c.photo, c.theme
             FROM users u
             JOIN cards c ON c.user_id = u.id
             WHERE u.slug = ? AND c.is_active = 1
             LIMIT 1"
        );
        $stmt->execute([$slug]);
        $card = $stmt->fetch();

        if (!$card) jsonResponse(404, ['error' => 'Card not found.']);

        $stmt = $db->prepare(
            "SELECT type, label, url FROM card_links WHERE card_id = ? ORDER BY sort_order ASC"
        );
        $stmt->execute([$card['id']]);
        $card['links'] = $stmt->fetchAll();

        jsonResponse(200, ['card' => $card]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to fetch card.']);
    }
}

// All routes below require auth
$auth = requireAuth();
$userId = (int) $auth->user_id;
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// GET /api/cards — get current user's card
if ($method === 'GET' && !isset($_GET['action'])) {
    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT id FROM cards WHERE user_id = ? LIMIT 1");
        $stmt->execute([$userId]);
        $row  = $stmt->fetch();

        if (!$row) jsonResponse(404, ['error' => 'No card found. Please create one.']);

        $card = getCardWithLinks($db, (int) $row['id']);
        jsonResponse(200, ['card' => $card]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to fetch card.']);
    }
}

// POST /api/cards/upload — upload profile photo (auth required)
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'upload') {
    if (empty($_FILES['photo'])) {
        jsonResponse(400, ['error' => 'No file uploaded.']);
    }

    $file     = $_FILES['photo'];
    $allowed  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $mimeType = mime_content_type($file['tmp_name']);

    if (!in_array($mimeType, $allowed)) {
        jsonResponse(422, ['error' => 'Only JPEG, PNG, GIF, and WebP images are allowed.']);
    }
    if ($file['size'] > 5 * 1024 * 1024) {
        jsonResponse(422, ['error' => 'File size must be under 5 MB.']);
    }

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('photo_', true) . '.' . strtolower($ext);
    $dest     = __DIR__ . '/../uploads/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonResponse(500, ['error' => 'Failed to save file.']);
    }

    jsonResponse(200, ['filename' => $filename]);
}

// POST /api/cards — create card
if ($method === 'POST') {
    try {
        $db = getDB();

        // One card per user
        $stmt = $db->prepare("SELECT id FROM cards WHERE user_id = ?");
        $stmt->execute([$userId]);
        if ($stmt->fetch()) jsonResponse(409, ['error' => 'Card already exists. Use PUT to update.']);

        $stmt = $db->prepare(
            "INSERT INTO cards (user_id, title, company, bio, photo, theme)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $userId,
            substr(trim($body['title']   ?? ''), 0, 100),
            substr(trim($body['company'] ?? ''), 0, 100),
            trim($body['bio']   ?? ''),
            trim($body['photo'] ?? ''),
            trim($body['theme'] ?? 'default'),
        ]);
        $cardId = (int) $db->lastInsertId();

        if (!empty($body['links']) && is_array($body['links'])) {
            saveLinks($db, $cardId, $body['links']);
        }

        $card = getCardWithLinks($db, $cardId);
        jsonResponse(201, ['card' => $card]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to create card.']);
    }
}

// PUT /api/cards/:id — update card
if ($method === 'PUT' && isset($_GET['id'])) {
    $cardId = (int) $_GET['id'];

    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT id FROM cards WHERE id = ? AND user_id = ?");
        $stmt->execute([$cardId, $userId]);
        if (!$stmt->fetch()) jsonResponse(403, ['error' => 'Card not found or access denied.']);

        $stmt = $db->prepare(
            "UPDATE cards SET title = ?, company = ?, bio = ?, photo = ?, theme = ?
             WHERE id = ? AND user_id = ?"
        );
        $stmt->execute([
            substr(trim($body['title']   ?? ''), 0, 100),
            substr(trim($body['company'] ?? ''), 0, 100),
            trim($body['bio']   ?? ''),
            trim($body['photo'] ?? ''),
            trim($body['theme'] ?? 'default'),
            $cardId,
            $userId,
        ]);

        if (isset($body['links']) && is_array($body['links'])) {
            saveLinks($db, $cardId, $body['links']);
        }

        $card = getCardWithLinks($db, $cardId);
        jsonResponse(200, ['card' => $card]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to update card.']);
    }
}

// DELETE /api/cards/:id — delete card and links
if ($method === 'DELETE' && isset($_GET['id'])) {
    $cardId = (int) $_GET['id'];

    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT id FROM cards WHERE id = ? AND user_id = ?");
        $stmt->execute([$cardId, $userId]);
        if (!$stmt->fetch()) jsonResponse(403, ['error' => 'Card not found or access denied.']);

        $db->prepare("DELETE FROM card_links WHERE card_id = ?")->execute([$cardId]);
        $db->prepare("DELETE FROM cards WHERE id = ? AND user_id = ?")->execute([$cardId, $userId]);

        jsonResponse(200, ['message' => 'Card deleted successfully.']);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to delete card.']);
    }
}



jsonResponse(404, ['error' => 'Endpoint not found.']);

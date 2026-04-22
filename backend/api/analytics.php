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
    if (!$user) jsonResponse(401, ['error' => 'Unauthorized. Valid token required.']);
    return $user;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POST /api/analytics/view — log a card view (public, no auth)
if ($method === 'POST' && $action === 'view') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $cardId = (int) ($body['card_id'] ?? 0);

    if (!$cardId) jsonResponse(400, ['error' => 'card_id is required.']);

    try {
        $db = getDB();

        // Verify card exists
        $stmt = $db->prepare("SELECT id FROM cards WHERE id = ? AND is_active = 1");
        $stmt->execute([$cardId]);
        if (!$stmt->fetch()) jsonResponse(404, ['error' => 'Card not found.']);

        $ip        = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        $ip        = substr(trim(explode(',', $ip)[0]), 0, 45);
        $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500);

        $stmt = $db->prepare(
            "INSERT INTO card_views (card_id, visitor_ip, user_agent) VALUES (?, ?, ?)"
        );
        $stmt->execute([$cardId, $ip, $userAgent]);

        jsonResponse(201, ['message' => 'View logged.']);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to log view.']);
    }
}

// GET /api/analytics/:card_id — get stats (auth required)
if ($method === 'GET' && isset($_GET['card_id'])) {
    $auth   = requireAuth();
    $userId = (int) $auth->user_id;
    $cardId = (int) $_GET['card_id'];

    try {
        $db = getDB();

        // Verify card belongs to user
        $stmt = $db->prepare("SELECT id FROM cards WHERE id = ? AND user_id = ?");
        $stmt->execute([$cardId, $userId]);
        if (!$stmt->fetch()) jsonResponse(403, ['error' => 'Card not found or access denied.']);

        // Total views
        $stmt = $db->prepare("SELECT COUNT(*) AS total FROM card_views WHERE card_id = ?");
        $stmt->execute([$cardId]);
        $total = (int) $stmt->fetchColumn();

        // Last 7 days — one row per day
        $stmt = $db->prepare("
            SELECT
                DATE(viewed_at) AS date,
                COUNT(*)        AS views
            FROM card_views
            WHERE card_id = ?
              AND viewed_at >= CURDATE() - INTERVAL 6 DAY
            GROUP BY DATE(viewed_at)
            ORDER BY date ASC
        ");
        $stmt->execute([$cardId]);
        $daily = $stmt->fetchAll();

        // Fill in missing days with 0
        $map  = array_column($daily, 'views', 'date');
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date   = date('Y-m-d', strtotime("-{$i} days"));
            $days[] = ['date' => $date, 'views' => (int) ($map[$date] ?? 0)];
        }

        jsonResponse(200, [
            'total_views' => $total,
            'last_7_days' => $days,
        ]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Failed to fetch analytics.']);
    }
}

jsonResponse(404, ['error' => 'Endpoint not found.']);

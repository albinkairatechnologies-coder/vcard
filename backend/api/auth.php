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

function generateSlug(string $name, PDO $db): string {
    $base = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($name)));
    $base = trim($base, '-');
    $slug = $base;
    $i = 1;
    while (true) {
        $stmt = $db->prepare("SELECT id FROM users WHERE slug = ?");
        $stmt->execute([$slug]);
        if (!$stmt->fetch()) break;
        $slug = $base . '-' . $i++;
    }
    return $slug;
}

$method = $_SERVER['REQUEST_METHOD'];
$path   = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
// Extract last segment: register or login
$action = basename($path);

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

// POST /api/auth/register
if ($method === 'POST' && $action === 'register') {
    $name     = trim($body['name'] ?? '');
    $email    = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$name || !$email || !$password) {
        jsonResponse(422, ['error' => 'Name, email, and password are required.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(422, ['error' => 'Invalid email address.']);
    }
    if (strlen($password) < 6) {
        jsonResponse(422, ['error' => 'Password must be at least 6 characters.']);
    }

    try {
        $db = getDB();

        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            jsonResponse(409, ['error' => 'Email already registered.']);
        }

        $slug   = generateSlug($name, $db);
        $hashed = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $db->prepare(
            "INSERT INTO users (name, email, password, slug) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$name, $email, $hashed, $slug]);
        $userId = (int) $db->lastInsertId();

        $token = encodeJWT(['user_id' => $userId, 'slug' => $slug]);

        jsonResponse(201, [
            'token' => $token,
            'user'  => ['id' => $userId, 'name' => $name, 'email' => $email, 'slug' => $slug],
        ]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Registration failed. Please try again.']);
    }
}

// POST /api/auth/login
if ($method === 'POST' && $action === 'login') {
    $email    = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        jsonResponse(422, ['error' => 'Email and password are required.']);
    }

    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT id, name, email, password, slug FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(401, ['error' => 'Invalid email or password.']);
        }

        $token = encodeJWT(['user_id' => $user['id'], 'slug' => $user['slug']]);

        jsonResponse(200, [
            'token' => $token,
            'user'  => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'slug'  => $user['slug'],
            ],
        ]);
    } catch (Exception $e) {
        jsonResponse(500, ['error' => 'Login failed. Please try again.']);
    }
}

jsonResponse(404, ['error' => 'Endpoint not found.']);

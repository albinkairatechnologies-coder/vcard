-- SmartCard Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Business cards table
CREATE TABLE IF NOT EXISTS cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100),
  company VARCHAR(100),
  bio TEXT,
  photo VARCHAR(255),
  theme VARCHAR(30) DEFAULT 'default',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Card links (social media, contact info)
CREATE TABLE IF NOT EXISTS card_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id INT NOT NULL,
  type VARCHAR(30),
  label VARCHAR(100),
  url VARCHAR(500),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  INDEX idx_card_id (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Card views analytics
CREATE TABLE IF NOT EXISTS card_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id INT NOT NULL,
  visitor_ip VARCHAR(45),
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  INDEX idx_card_id (card_id),
  INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Card leads
CREATE TABLE IF NOT EXISTS card_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id INT NOT NULL,
  lead_name VARCHAR(120) NOT NULL,
  lead_email VARCHAR(190) DEFAULT NULL,
  lead_phone VARCHAR(30) DEFAULT NULL,
  lead_note TEXT,
  source VARCHAR(40) NOT NULL DEFAULT 'public_card',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  INDEX idx_card_id (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

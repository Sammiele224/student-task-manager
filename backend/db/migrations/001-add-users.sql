-- =============================================================================
-- Migration 001 - add users, and give every course an owner
--
-- For a database made before the users table existed. A new database gets all
-- of this from schema.sql and SeedData.sql, and doesn't need it.
--
-- What it does:
--   1. creates the users table
--   2. creates the demo user, alex@school.edu
--   3. adds courses.user_id and gives every existing course to the demo user
--   4. makes course codes unique per user instead of across the database
--   5. links courses to users
--
-- Your existing courses and tasks are kept. Safe to run more than once: every
-- step checks the database first and skips itself if it has already happened.
--
-- It lives in db/migrations/, not db/, on purpose. Docker runs every .sql file
-- sitting directly in db/ when it creates a new database; subfolders are left
-- alone.
--
-- Kept to plain ASCII so PowerShell can pipe it in without mangling it.
-- =============================================================================

USE student_task_manager;


-- -----------------------------------------------------------------------------
-- 1. Users table - identical to schema.sql
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_username (username),
    CONSTRAINT chk_users_name CHECK (CHAR_LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_users_username CHECK (CHAR_LENGTH(TRIM(username)) > 0),
    CONSTRAINT chk_users_email CHECK (email LIKE '_%@_%'),
    CONSTRAINT chk_users_password_hash CHECK (CHAR_LENGTH(password_hash) > 0)
) ENGINE = InnoDB;


-- -----------------------------------------------------------------------------
-- 2. Demo user - the owner for every course that exists today
--    password_hash is bcrypt, cost 10, of 'password123'. Development only.
-- -----------------------------------------------------------------------------

INSERT IGNORE INTO users (name, username, email, password_hash, created_at)
VALUES ('Alex Morgan', 'alexmorgan', 'alex@school.edu',
        '$2b$10$/KzKPuS/FVzdZdeUMM/MUON9ihR9D2KJFEg/tigz5Kd5EW9h/aOMe',
        '2026-09-01 00:00:00');

SET @demo_user_id = (SELECT id FROM users WHERE email = 'alex@school.edu');


-- -----------------------------------------------------------------------------
-- 3. courses.user_id - added empty, filled in, then made required
-- -----------------------------------------------------------------------------

SET @step = IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses'
        AND COLUMN_NAME = 'user_id') = 0,
    'ALTER TABLE courses ADD COLUMN user_id INT UNSIGNED NULL AFTER id',
    'DO 0');
PREPARE run_step FROM @step; EXECUTE run_step; DEALLOCATE PREPARE run_step;

UPDATE courses SET user_id = @demo_user_id WHERE user_id IS NULL;

SET @step = IF(
    (SELECT IS_NULLABLE FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses'
        AND COLUMN_NAME = 'user_id') = 'YES',
    'ALTER TABLE courses MODIFY user_id INT UNSIGNED NOT NULL',
    'DO 0');
PREPARE run_step FROM @step; EXECUTE run_step; DEALLOCATE PREPARE run_step;


-- -----------------------------------------------------------------------------
-- 4. Course codes unique per user. The new key goes on before the old one comes
--    off, so there is never a moment with no uniqueness rule at all.
-- -----------------------------------------------------------------------------

SET @step = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses'
        AND INDEX_NAME = 'uq_courses_user_code') = 0,
    'ALTER TABLE courses ADD UNIQUE KEY uq_courses_user_code (user_id, code)',
    'DO 0');
PREPARE run_step FROM @step; EXECUTE run_step; DEALLOCATE PREPARE run_step;

SET @step = IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses'
        AND INDEX_NAME = 'uq_courses_code') > 0,
    'ALTER TABLE courses DROP INDEX uq_courses_code',
    'DO 0');
PREPARE run_step FROM @step; EXECUTE run_step; DEALLOCATE PREPARE run_step;


-- -----------------------------------------------------------------------------
-- 5. The link from courses to users
-- -----------------------------------------------------------------------------

SET @step = IF(
    (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses'
        AND CONSTRAINT_NAME = 'fk_courses_user') = 0,
    'ALTER TABLE courses ADD CONSTRAINT fk_courses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT',
    'DO 0');
PREPARE run_step FROM @step; EXECUTE run_step; DEALLOCATE PREPARE run_step;

-- =============================================================================
-- University Student Task Manager
-- MySQL Database Schema — V1
--
-- Requires: MySQL 8.0.16+
--
-- Core relationships:
--   users (1) ----< courses (N) ----< tasks (N)
--
-- A task belongs to a user through its course, so tasks carry no user_id of
-- their own: a second copy could only ever disagree with the course's owner.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS student_task_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE student_task_manager;


-- =============================================================================
-- USERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- Display name, e.g. "Alex Morgan".
    name VARCHAR(120) NOT NULL,

    username VARCHAR(50) NOT NULL,

    email VARCHAR(255) NOT NULL,

    -- A bcrypt hash, never the password itself.
    password_hash VARCHAR(255) NOT NULL,

    avatar_url VARCHAR(500) NULL,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- One account per email and per username. The collation ignores case, so
    -- Alex@school.edu and alex@school.edu count as the same address.
    UNIQUE KEY uq_users_email (email),

    UNIQUE KEY uq_users_username (username),

    -- Prevent blank values such as '' or '   '.
    CONSTRAINT chk_users_name
        CHECK (CHAR_LENGTH(TRIM(name)) > 0),

    CONSTRAINT chk_users_username
        CHECK (CHAR_LENGTH(TRIM(username)) > 0),

    -- At least one character either side of an @. Full validation is the API's.
    CONSTRAINT chk_users_email
        CHECK (email LIKE '_%@_%'),

    CONSTRAINT chk_users_password_hash
        CHECK (CHAR_LENGTH(password_hash) > 0)

) ENGINE = InnoDB;


-- =============================================================================
-- COURSES
-- =============================================================================

CREATE TABLE IF NOT EXISTS courses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- The student this course belongs to.
    user_id INT UNSIGNED NOT NULL,

    name VARCHAR(120) NOT NULL,

    code VARCHAR(20) NOT NULL,

    color VARCHAR(20) NOT NULL DEFAULT 'green',

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- A code is unique within one student's courses, so two students can each
    -- have their own CS201. user_id leads, so this also indexes the foreign key.
    UNIQUE KEY uq_courses_user_code (user_id, code),

    -- Prevent blank values such as '' or '   '.
    CONSTRAINT chk_courses_name
        CHECK (CHAR_LENGTH(TRIM(name)) > 0),

    CONSTRAINT chk_courses_code
        CHECK (CHAR_LENGTH(TRIM(code)) > 0),

    CONSTRAINT chk_courses_color
        CHECK (CHAR_LENGTH(TRIM(color)) > 0),

    -- -------------------------------------------------------------------------
    -- Relationships
    -- -------------------------------------------------------------------------

    -- A user who still has courses can't be deleted, the same rule tasks use
    -- for their course.
    CONSTRAINT fk_courses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT

) ENGINE = InnoDB;


-- =============================================================================
-- TASKS
-- =============================================================================

CREATE TABLE IF NOT EXISTS tasks (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    course_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NULL,

    due_date DATE NOT NULL,

    priority ENUM(
        'low',
        'medium',
        'high'
    )
        NOT NULL
        DEFAULT 'medium',

    status ENUM(
        'todo',
        'in_progress',
        'done'
    )
        NOT NULL
        DEFAULT 'todo',

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    completed_at DATETIME NULL,

    PRIMARY KEY (id),

    -- -------------------------------------------------------------------------
    -- Relationships
    -- -------------------------------------------------------------------------

    CONSTRAINT fk_tasks_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    -- -------------------------------------------------------------------------
    -- Business integrity
    -- -------------------------------------------------------------------------

    CONSTRAINT chk_tasks_title
        CHECK (CHAR_LENGTH(TRIM(title)) > 0),

    -- completed_at only exists for completed tasks.
    CONSTRAINT chk_tasks_completion
        CHECK (
            (status = 'done' AND completed_at IS NOT NULL)
            OR
            (status <> 'done' AND completed_at IS NULL)
        ),

    -- -------------------------------------------------------------------------
    -- Indexes
    -- -------------------------------------------------------------------------

    -- Course detail / task list:
    -- WHERE course_id = ? ORDER BY due_date
    KEY idx_tasks_course_due (
        course_id,
        due_date
    ),

    -- Upcoming / overdue tasks.
    KEY idx_tasks_due_date (
        due_date
    ),

    -- Status filters / dashboard.
    KEY idx_tasks_status (
        status
    )

) ENGINE = InnoDB;
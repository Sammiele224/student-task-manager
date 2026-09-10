-- =============================================================================
-- University Student Task Manager
-- MySQL Database Schema — V1
--
-- Requires: MySQL 8.0.16+
--
-- Core relationship:
--   courses (1) ----< tasks (N)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS student_task_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE student_task_manager;


-- =============================================================================
-- COURSES
-- =============================================================================

CREATE TABLE IF NOT EXISTS courses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(120) NOT NULL,

    code VARCHAR(20) NOT NULL,

    color VARCHAR(20) NOT NULL DEFAULT 'green',

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- A course code uniquely identifies a course.
    UNIQUE KEY uq_courses_code (code),

    -- Prevent blank values such as '' or '   '.
    CONSTRAINT chk_courses_name
        CHECK (CHAR_LENGTH(TRIM(name)) > 0),

    CONSTRAINT chk_courses_code
        CHECK (CHAR_LENGTH(TRIM(code)) > 0),

    CONSTRAINT chk_courses_color
        CHECK (CHAR_LENGTH(TRIM(color)) > 0)

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
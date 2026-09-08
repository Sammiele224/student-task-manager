-- =============================================================================
-- University Student Task Manager — MySQL schema
--
-- Run once per machine:  mysql -u root -p < backend/db/schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS student_task_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_task_manager;

-- -----------------------------------------------------------------------------
-- courses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL,
  -- Course codes must be unique. The DB enforces this so a duplicate fails
  -- even if a validation check is missed in application code.
  code        VARCHAR(20)  NOT NULL,
  -- Hex colour, e.g. '#3B82F6'. CHECK is enforced on MySQL 8.0.16+.
  color       CHAR(7)      NOT NULL DEFAULT '#4E6B4C',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_code (code),
  CONSTRAINT chk_courses_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- tasks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id     INT UNSIGNED NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT         NULL,
  due_date      DATE         NOT NULL,
  priority      ENUM('low', 'medium', 'high')          NOT NULL DEFAULT 'medium',
  status        ENUM('todo', 'in_progress', 'done')    NOT NULL DEFAULT 'todo',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Set when the task reaches "done", cleared if it moves back.
  completed_at  DATETIME     NULL,
  PRIMARY KEY (id),
  -- RESTRICT means deleting a course that still has tasks fails at the
  -- database level, so tasks are never silently destroyed.
  CONSTRAINT fk_tasks_course
    FOREIGN KEY (course_id) REFERENCES courses (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  KEY idx_tasks_course (course_id),
  -- Supports the upcoming/overdue view and the dashboard counts.
  KEY idx_tasks_due_date (due_date),
  KEY idx_tasks_status (status)
) ENGINE = InnoDB;

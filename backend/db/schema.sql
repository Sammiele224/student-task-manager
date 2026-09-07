-- =============================================================================
-- University Student Task Manager — MySQL schema
-- Matches the data model in section A.6 of the project documentation.
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
  -- US-01 / US-03: course codes must be unique. The DB enforces this so a
  -- duplicate fails even if a validation check is missed in application code.
  code        VARCHAR(20)  NOT NULL,
  color       VARCHAR(20)  NOT NULL DEFAULT 'green',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_code (code)
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
  -- US-09: set when the task reaches "done", cleared if it moves back.
  completed_at  DATETIME     NULL,
  PRIMARY KEY (id),
  -- US-04: RESTRICT means deleting a course that still has tasks fails at the
  -- database level, so tasks are never silently destroyed.
  CONSTRAINT fk_tasks_course
    FOREIGN KEY (course_id) REFERENCES courses (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  KEY idx_tasks_course (course_id),
  -- Supports the upcoming/overdue view (US-10) and the dashboard (US-13).
  KEY idx_tasks_due_date (due_date),
  KEY idx_tasks_status (status)
) ENGINE = InnoDB;

-- =============================================================================
-- University Student Task Manager — Development seed data
-- Source: Seed Data - The Last of Us.xlsx
--
-- Safe to re-run:
--   - courses are protected by UNIQUE(code) + INSERT IGNORE
--   - tasks are inserted only when the same title does not already exist
--     within the same course
--
-- Expected schema: student_task_manager
-- =============================================================================

USE student_task_manager;

-- -----------------------------------------------------------------------------
-- Courses (5 rows)
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO courses (name, code, color, created_at)
VALUES
  ('Data Structures and Algorithms', 'CS201', '#4F46E5', '2026-09-01 00:00:00'),
  ('Database Systems', 'CS202', '#059669', '2026-09-01 00:00:00'),
  ('Computer Networks', 'CS301', '#DC2626', '2026-09-01 00:00:00'),
  ('Web Development', 'CS302', '#D97706', '2026-09-01 00:00:00'),
  ('Discrete Mathematics', 'MA201', '#7C3AED', '2026-09-01 00:00:00');

-- -----------------------------------------------------------------------------
-- Temporary staging table for task seed data
-- course_code is used instead of hard-coded course_id values.
-- -----------------------------------------------------------------------------
DROP TEMPORARY TABLE IF EXISTS seed_tasks;

CREATE TEMPORARY TABLE seed_tasks (
  course_code   VARCHAR(20)  NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT         NULL,
  due_date      DATE         NOT NULL,
  priority      ENUM('low', 'medium', 'high')       NOT NULL,
  status        ENUM('todo', 'in_progress', 'done') NOT NULL,
  created_at    DATETIME     NOT NULL,
  completed_at  DATETIME     NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Tasks (35 rows)
-- -----------------------------------------------------------------------------
INSERT INTO seed_tasks (
  course_code,
  title,
  description,
  due_date,
  priority,
  status,
  created_at,
  completed_at
)
VALUES
  (
    'CS201',
    'Graph Traversal Exercise',
    'Seed task: Graph Traversal Exercise',
    '2026-09-05',
    'medium',
    'todo',
    '2026-08-31 00:00:00',
    NULL
  ),
  (
    'CS301',
    'TCP/IP Assignment',
    'Seed task: TCP/IP Assignment',
    '2026-09-05',
    'high',
    'todo',
    '2026-09-01 00:00:00',
    NULL
  ),
  (
    'MA201',
    'Equivalence Relations Exercise',
    'Seed task: Equivalence Relations Exercise',
    '2026-08-30',
    'medium',
    'todo',
    '2026-08-27 00:00:00',
    NULL
  ),
  (
    'CS201',
    'Submit Heap Sort Code',
    'Seed task: Submit Heap Sort Code',
    '2026-08-31',
    'medium',
    'in_progress',
    '2026-08-26 00:00:00',
    NULL
  ),
  (
    'CS302',
    'REST API Exercise with Express',
    'Seed task: REST API Exercise with Express',
    '2026-08-31',
    'high',
    'in_progress',
    '2026-08-26 00:00:00',
    NULL
  ),
  (
    'CS202',
    'Transaction & Locking Report',
    'Seed task: Transaction & Locking Report',
    '2026-09-05',
    'medium',
    'todo',
    '2026-09-02 00:00:00',
    NULL
  ),
  (
    'CS202',
    'Index & Query Optimization Exercise',
    'Seed task: Index & Query Optimization Exercise',
    '2026-08-30',
    'medium',
    'in_progress',
    '2026-08-25 00:00:00',
    NULL
  ),
  (
    'MA201',
    'Combinatorics & Probability Exercise',
    'Seed task: Combinatorics & Probability Exercise',
    '2026-09-08',
    'medium',
    'in_progress',
    '2026-09-04 00:00:00',
    NULL
  ),
  (
    'CS202',
    'Quiz: Relational Model',
    'Seed task: Quiz: Relational Model',
    '2026-09-08',
    'high',
    'in_progress',
    '2026-09-06 00:00:00',
    NULL
  ),
  (
    'CS302',
    'Write Unit Tests for API',
    'Seed task: Write Unit Tests for API',
    '2026-09-08',
    'high',
    'in_progress',
    '2026-09-03 00:00:00',
    NULL
  ),
  (
    'CS301',
    'Lab: Wireshark Packet Capture',
    'Seed task: Lab: Wireshark Packet Capture',
    '2026-09-11',
    'low',
    'todo',
    '2026-09-06 00:00:00',
    NULL
  ),
  (
    'MA201',
    'Submit Midterm Assignment',
    'Seed task: Submit Midterm Assignment',
    '2026-09-12',
    'low',
    'todo',
    '2026-09-07 00:00:00',
    NULL
  ),
  (
    'CS201',
    'Linked List Assignment',
    'Seed task: Linked List Assignment',
    '2026-09-09',
    'high',
    'todo',
    '2026-09-05 00:00:00',
    NULL
  ),
  (
    'CS302',
    'Build Login Page with React',
    'Seed task: Build Login Page with React',
    '2026-09-11',
    'medium',
    'todo',
    '2026-09-04 00:00:00',
    NULL
  ),
  (
    'CS202',
    'Normalization Exercise',
    'Seed task: Normalization Exercise',
    '2026-09-12',
    'low',
    'todo',
    '2026-09-07 00:00:00',
    NULL
  ),
  (
    'CS302',
    'Integrate MySQL into Backend',
    'Seed task: Integrate MySQL into Backend',
    '2026-09-11',
    'medium',
    'todo',
    '2026-09-04 00:00:00',
    NULL
  ),
  (
    'CS202',
    'ER Diagram for Project',
    'Seed task: ER Diagram for Project',
    '2026-09-16',
    'medium',
    'todo',
    '2026-09-08 00:00:00',
    NULL
  ),
  (
    'MA201',
    'Propositional Logic Exercise',
    'Seed task: Propositional Logic Exercise',
    '2026-09-18',
    'high',
    'todo',
    '2026-09-05 00:00:00',
    NULL
  ),
  (
    'CS301',
    'OSI Model Exercise',
    'Seed task: OSI Model Exercise',
    '2026-09-19',
    'high',
    'todo',
    '2026-09-06 00:00:00',
    NULL
  ),
  (
    'CS202',
    'Submit Database Project Part 1',
    'Seed task: Submit Database Project Part 1',
    '2026-09-19',
    'high',
    'todo',
    '2026-09-06 00:00:00',
    NULL
  ),
  (
    'MA201',
    'Proof by Induction',
    'Seed task: Proof by Induction',
    '2026-09-16',
    'high',
    'todo',
    '2026-09-05 00:00:00',
    NULL
  ),
  (
    'CS302',
    'Deploy App to Render',
    'Seed task: Deploy App to Render',
    '2026-09-22',
    'high',
    'todo',
    '2026-09-06 00:00:00',
    NULL
  ),
  (
    'CS201',
    'Midterm Review',
    'Seed task: Midterm Review',
    '2026-09-17',
    'high',
    'todo',
    '2026-09-05 00:00:00',
    NULL
  ),
  (
    'CS301',
    'Subnetting Report',
    'Seed task: Subnetting Report',
    '2026-09-22',
    'high',
    'todo',
    '2026-09-05 00:00:00',
    NULL
  ),
  (
    'CS201',
    'Implement Binary Search Tree',
    'Seed task: Implement Binary Search Tree',
    '2026-08-23',
    'high',
    'done',
    '2026-08-17 00:00:00',
    '2026-08-21 00:00:00'
  ),
  (
    'CS301',
    'Quiz: Routing Protocols',
    'Seed task: Quiz: Routing Protocols',
    '2026-09-02',
    'high',
    'done',
    '2026-08-27 00:00:00',
    '2026-08-31 00:00:00'
  ),
  (
    'CS202',
    'Design Database Schema',
    'Seed task: Design Database Schema',
    '2026-08-24',
    'low',
    'done',
    '2026-08-19 00:00:00',
    '2026-08-22 00:00:00'
  ),
  (
    'MA201',
    'Quiz: Graph Theory',
    'Seed task: Quiz: Graph Theory',
    '2026-08-30',
    'high',
    'done',
    '2026-08-26 00:00:00',
    '2026-08-30 00:00:00'
  ),
  (
    'CS301',
    'Lab: Router Configuration',
    'Seed task: Lab: Router Configuration',
    '2026-08-30',
    'medium',
    'done',
    '2026-08-26 00:00:00',
    '2026-08-30 00:00:00'
  ),
  (
    'CS302',
    'Fix Responsive Layout Bug',
    'Seed task: Fix Responsive Layout Bug',
    '2026-08-19',
    'high',
    'done',
    '2026-08-15 00:00:00',
    '2026-08-18 00:00:00'
  ),
  (
    'CS201',
    'Quiz: Sorting Algorithms',
    'Seed task: Quiz: Sorting Algorithms',
    '2026-09-02',
    'high',
    'done',
    '2026-08-27 00:00:00',
    '2026-08-31 00:00:00'
  ),
  (
    'CS201',
    'Dynamic Programming Report',
    'Seed task: Dynamic Programming Report',
    '2026-08-19',
    'medium',
    'done',
    '2026-08-14 00:00:00',
    '2026-08-19 00:00:00'
  ),
  (
    'CS302',
    'Midterm Report: CRUD App',
    'Seed task: Midterm Report: CRUD App',
    '2026-08-21',
    'low',
    'done',
    '2026-08-18 00:00:00',
    '2026-08-20 00:00:00'
  ),
  (
    'CS202',
    'Advanced SQL Queries',
    'Seed task: Advanced SQL Queries',
    '2026-08-20',
    'high',
    'done',
    '2026-08-14 00:00:00',
    '2026-08-19 00:00:00'
  ),
  (
    'CS301',
    'Basic Network Security Report',
    'Seed task: Basic Network Security Report',
    '2026-09-03',
    'medium',
    'done',
    '2026-08-28 00:00:00',
    '2026-09-01 00:00:00'
  );

-- Insert seed tasks by resolving the foreign key from courses.code.
-- NOT EXISTS prevents duplicate seed tasks on repeated runs.
INSERT INTO tasks (
  course_id,
  title,
  description,
  due_date,
  priority,
  status,
  created_at,
  completed_at
)
SELECT
  c.id,
  s.title,
  s.description,
  s.due_date,
  s.priority,
  s.status,
  s.created_at,
  s.completed_at
FROM seed_tasks AS s
JOIN courses AS c
  ON c.code = s.course_code
WHERE NOT EXISTS (
  SELECT 1
  FROM tasks AS t
  WHERE t.course_id = c.id
    AND t.title = s.title
);

DROP TEMPORARY TABLE seed_tasks;
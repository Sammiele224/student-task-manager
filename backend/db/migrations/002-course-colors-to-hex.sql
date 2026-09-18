-- =============================================================================
-- Migration 002 - store course colours as hex
--
-- For a database made while courses held a colour *name* ('green', 'teal',
-- 'sage', 'blue'). The API documentation specifies a #RRGGBB string, so the
-- stored value becomes the colour itself. A new database gets hex from
-- schema.sql and SeedData.sql, and doesn't need this.
--
-- The four hex values are the same ones the palette already drew in both the
-- Light and Cyber themes, so no course changes colour.
--
-- Rows that already hold a hex value are left alone. Safe to run more than
-- once: a second run matches nothing.
--
-- Kept to plain ASCII so PowerShell can pipe it in without mangling it.
-- =============================================================================

USE student_task_manager;

UPDATE courses SET color = '#38846B' WHERE color = 'green';
UPDATE courses SET color = '#50878C' WHERE color = 'teal';
UPDATE courses SET color = '#63956A' WHERE color = 'sage';
UPDATE courses SET color = '#6A85A5' WHERE color = 'blue';

-- Any other name predates the palette; give it the default rather than leave a
-- value nothing can render.
UPDATE courses SET color = '#38846B' WHERE color NOT LIKE '#%';

-- New courses default to the first swatch instead of the old name.
ALTER TABLE courses ALTER COLUMN color SET DEFAULT '#38846B';

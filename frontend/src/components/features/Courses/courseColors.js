/**
 * Course colours.
 *
 * The courses table stores a colour *name* — the column is VARCHAR(20) and
 * defaults to 'green' — and the design system owns what each name looks like.
 * Keeping the hex out of the database means a palette change lands in one
 * file instead of a migration.
 */

export const COURSE_COLORS = {
  green: { label: 'Green', token: '--course-software' },
  teal: { label: 'Teal', token: '--course-design' },
  sage: { label: 'Sage', token: '--course-data' },
  blue: { label: 'Blue', token: '--course-math' },
}

export const DEFAULT_COURSE_COLOR = 'green'

export const COURSE_COLOR_OPTIONS = Object.entries(COURSE_COLORS).map(
  ([value, { label, token }]) => ({ value, label, token })
)

/**
 * A CSS colour for a stored value, for `--course-color` or any colour property.
 *
 * Rows seeded before the palette existed hold a hex string instead of a name.
 * Those are passed straight through so old data still shows its own colour
 * rather than collapsing to the default.
 */
export function courseColorValue(stored) {
  if (typeof stored === 'string' && stored.trim().startsWith('#')) return stored.trim()
  const entry = COURSE_COLORS[stored] ?? COURSE_COLORS[DEFAULT_COURSE_COLOR]
  return `var(${entry.token})`
}

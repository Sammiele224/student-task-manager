/**
 * Course colours.
 *
 * The courses table stores the colour itself, as a `#RRGGBB` string, which is
 * what the API documentation specifies. The four below are the palette the
 * course form offers; any other hex a course already holds is shown as it is.
 *
 * These four read the same in Light and Cyber, so storing the hex rather than a
 * token name costs nothing in either theme.
 */

export const COURSE_COLORS = [
  { value: '#38846B', label: 'Green' },
  { value: '#50878C', label: 'Teal' },
  { value: '#63956A', label: 'Sage' },
  { value: '#6A85A5', label: 'Blue' },
]

export const DEFAULT_COURSE_COLOR = '#38846B'

export const COURSE_COLOR_OPTIONS = COURSE_COLORS

/**
 * Colour names the database used before it held hex. Rows made then still
 * carry a name, so they keep their own colour instead of collapsing to the
 * default. New courses never write one.
 */
const LEGACY_COLOR_NAMES = {
  green: '#38846B',
  teal: '#50878C',
  sage: '#63956A',
  blue: '#6A85A5',
}

/** A CSS colour for a stored value, for `--course-color` or any colour property. */
export function courseColorValue(stored) {
  if (typeof stored !== 'string') return DEFAULT_COURSE_COLOR

  const value = stored.trim()
  if (value.startsWith('#')) return value

  return LEGACY_COLOR_NAMES[value.toLowerCase()] ?? DEFAULT_COURSE_COLOR
}

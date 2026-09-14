/**
 * Semesters, worked out from when a course was added.
 *
 * The courses table has no semester column, so rather than invent one this
 * treats created_at as the term the course belongs to. That is right for the
 * ordinary case — you add a course when you start taking it — and wrong if you
 * back-fill an old course today, which is the trade for not touching the
 * schema.
 *
 * Months are the usual northern-hemisphere split: Spring runs January to May,
 * Summer June to July, Autumn August to December.
 */

const TERMS = [
  { name: 'Spring', from: 0, to: 4 },
  { name: 'Summer', from: 5, to: 6 },
  { name: 'Fall', from: 7, to: 11 },
]

export const ALL_SEMESTERS = 'All'

/** `{ key, label }` for a course, or null when it has no usable date. */
export function semesterOf(createdAt) {
  if (!createdAt) return null

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null

  const month = date.getMonth()
  const year = date.getFullYear()
  const term = TERMS.find((t) => month >= t.from && month <= t.to)
  if (!term) return null

  return {
    /* Sorts chronologically as a string, newest last. */
    key: `${year}-${String(term.from).padStart(2, '0')}`,
    label: `${term.name} Semester ${year}`,
  }
}

/**
 * Every semester present in a set of courses, newest first, so the dropdown
 * only ever offers terms that actually have something in them.
 */
export function semesterOptions(courses) {
  const seen = new Map()

  for (const course of courses) {
    const semester = semesterOf(course.createdAt ?? course.created_at)
    if (semester && !seen.has(semester.key)) seen.set(semester.key, semester)
  }

  return [...seen.values()].sort((a, b) => b.key.localeCompare(a.key))
}

/** The courses belonging to one semester key, or all of them. */
export function filterBySemester(courses, key) {
  if (key === ALL_SEMESTERS) return courses
  return courses.filter(
    (course) => semesterOf(course.createdAt ?? course.created_at)?.key === key
  )
}

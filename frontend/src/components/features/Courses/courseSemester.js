/**
 * Semesters, worked out from when a course was added.
 *
 * The courses table has no semester column, so rather than invent one this
 * treats created_at as the term the course belongs to. That is right for the
 * ordinary case — you add a course when you start taking it — and wrong if you
 * back-fill an old course today, which is the trade for not touching the
 * schema.
 *
 * Teaching terms, not seasons: September to December is the autumn term,
 * January to May the spring one, and the months between are the break. This is
 * the single definition — Overview's header reads from it too, so the label on
 * the dashboard and the filter on the courses page can never disagree.
 */

export const ALL_SEMESTERS = 'All'

/** Terms in the order a picker should offer them. */
export const TERMS = [
  { id: 'spring', label: 'Spring', months: [0, 1, 2, 3, 4] },
  { id: 'summer', label: 'Summer', months: [5, 6, 7] },
  { id: 'fall', label: 'Fall', months: [8, 9, 10, 11] },
]

/** The term a date falls in. */
export function termOf(date) {
  const month = date.getMonth()
  return TERMS.find((t) => t.months.includes(month)) ?? TERMS[2]
}

/** The key a year and term combine into, e.g. "2026-fall". */
export function semesterKey(year, termId) {
  return `${year}-${termId}`
}

/** How a year and term read on screen, e.g. "Fall Semester 2026". */
export function semesterLabelFor(year, termId) {
  const term = TERMS.find((t) => t.id === termId) ?? TERMS[2]
  return `${term.label} Semester ${year}`
}

/** `{ key, label, year, term }` for a date, or null when there isn't one. */
export function semesterOf(createdAt) {
  if (!createdAt) return null

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null

  const term = termOf(date)
  const year = date.getFullYear()

  return {
    key: semesterKey(year, term.id),
    label: semesterLabelFor(year, term.id),
    year,
    term: term.id,
  }
}

/** Today's semester — what a picker should open on. */
export function currentSemester(date = new Date()) {
  const term = termOf(date)
  return { year: date.getFullYear(), term: term.id }
}

/** The label for today, for a header that just states the term. */
export function semesterLabel(date = new Date()) {
  const { year, term } = currentSemester(date)
  return semesterLabelFor(year, term)
}

/** Which semester keys actually hold a course, so a picker can mark them. */
export function semestersInUse(courses) {
  const keys = new Set()
  for (const course of courses) {
    const semester = semesterOf(course.createdAt ?? course.created_at)
    if (semester) keys.add(semester.key)
  }
  return keys
}

/** The courses belonging to one semester key, or all of them. */
export function filterBySemester(courses, key) {
  if (key === ALL_SEMESTERS) return courses
  return courses.filter(
    (course) => semesterOf(course.createdAt ?? course.created_at)?.key === key
  )
}

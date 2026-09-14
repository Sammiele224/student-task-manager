/**
 * Dates the dashboard needs: the greeting line, the semester label and the
 * Monday-to-Sunday strip in the week panel.
 */

const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** "Tuesday, September 8" for the line above the greeting. */
export function greetingDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * "Fall Semester 2026".
 * Teaching terms, not seasons: September through December is the autumn term,
 * January through May the spring one, and the months between are the break.
 */
export function semesterLabel(date = new Date()) {
  const month = date.getMonth()
  const term = month >= 8 ? 'Fall' : month <= 4 ? 'Spring' : 'Summer'
  return `${term} Semester ${date.getFullYear()}`
}

/**
 * The ISO-8601 week number, which is what a university timetable means by
 * "week 37". Week 1 is the one holding the first Thursday of the year.
 */
export function isoWeekNumber(date = new Date()) {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  /* Shift to the Thursday of this week, then count weeks from 1 January. */
  const dayOfWeek = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayOfWeek + 3)

  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayOfWeek = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayOfWeek + 3)

  return 1 + Math.round((target - firstThursday) / (7 * 86400000))
}

/** "September 2026" for the week panel's caption. */
export function monthAndYear(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * The seven days of the week holding `date`, Monday first.
 * Each carries its initial, its number, and whether it is today.
 */
export function weekStrip(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))

  const todayKey = new Date().toLocaleDateString('en-CA')

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    const key = day.toLocaleDateString('en-CA')

    return {
      key,
      date: day,
      initial: WEEKDAY_INITIALS[index],
      dayOfMonth: day.getDate(),
      isToday: key === todayKey,
    }
  })
}

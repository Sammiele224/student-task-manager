/**
 * Date maths for the month grid.
 *
 * Everything here is local-time and whole-day: the calendar never cares what
 * time an assignment is due, only which square it belongs in. Days are keyed
 * by their local `YYYY-MM-DD` string, the same shape `toDateInputValue` uses,
 * so a task and a cell agree without any timezone arithmetic.
 */

/** Monday first, matching the handoff. */
export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** `YYYY-MM-DD` in the reader's own timezone. */
export function toDayKey(date) {
  return new Date(date).toLocaleDateString('en-CA')
}

export function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export function isSameDay(a, b) {
  return Boolean(a) && Boolean(b) && toDayKey(a) === toDayKey(b)
}

/** First of the month holding `date`, at midnight. */
export function startOfMonth(date) {
  const start = new Date(date)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return start
}

/**
 * Steps whole months without the day-of-month overflow that makes
 * `setMonth` turn 31 January into 3 March.
 */
export function addMonths(date, count) {
  return startOfMonth(new Date(date.getFullYear(), date.getMonth() + count, 1))
}

/** "September 2026" */
export function monthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * The six Monday-to-Sunday weeks that cover `date`'s month.
 *
 * Always six rows, so the grid does not change height as the reader pages
 * through the year. Each cell carries whether it belongs to the month, which
 * is what greys out the leading and trailing days.
 */
export function buildMonthGrid(date) {
  const first = startOfMonth(date)

  /* getDay() is 0 on Sunday, which is the last column in a Monday-first week. */
  const leadingDays = (first.getDay() + 6) % 7

  const cursor = new Date(first)
  cursor.setDate(cursor.getDate() - leadingDays)

  return Array.from({ length: 6 }, () =>
    Array.from({ length: 7 }, () => {
      const day = new Date(cursor)
      cursor.setDate(cursor.getDate() + 1)
      return {
        date: day,
        key: toDayKey(day),
        dayOfMonth: day.getDate(),
        inMonth: day.getMonth() === first.getMonth(),
      }
    })
  )
}

/**
 * Tasks bucketed by due day.
 *
 * Unfinished work sorts above finished work inside a day, then by title, so
 * the chips a student still has to act on sit at the top of the square.
 */
export function groupTasksByDay(tasks) {
  const byDay = new Map()

  for (const task of tasks) {
    if (!task.dueDate) continue
    const key = toDayKey(task.dueDate)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key).push(task)
  }

  for (const list of byDay.values()) {
    list.sort((a, b) => {
      const aDone = a.status === 'done'
      const bDone = b.status === 'done'
      if (aDone !== bDone) return aDone ? 1 : -1
      return a.title.localeCompare(b.title)
    })
  }

  return byDay
}

/** "Tuesday" and "September 8" for the daily view heading. */
export function dayHeading(date) {
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
  }
}

/** "SEP" / "8" for the small date tile beside a task in the daily view. */
export function dayTile(date) {
  const day = new Date(date)
  return {
    month: day.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(day.getDate()),
  }
}

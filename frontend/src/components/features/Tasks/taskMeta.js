/**
 * One source of truth for task vocabulary and date formatting.
 * Rows, cards, the form and the detail page all read from here so a label
 * only ever has to change in one place.
 */

export const PRIORITY_META = {
  low: { label: 'Low', formLabel: 'Low — when you can', cssClass: 'low' },
  medium: { label: 'Medium', formLabel: 'Medium — keep it moving', cssClass: 'medium' },
  high: { label: 'High', formLabel: 'High — focus on this', cssClass: 'high' },
}

export const STATUS_META = {
  todo: { label: 'To do', cssClass: 'todo' },
  in_progress: { label: 'In progress', cssClass: 'in-progress' },
  done: { label: 'Done', cssClass: 'done' },
}

export const PRIORITY_VALUES = Object.keys(PRIORITY_META)
export const STATUS_VALUES = Object.keys(STATUS_META)

export const PRIORITY_OPTIONS = PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_META[value].label,
}))

export const STATUS_OPTIONS = STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_META[value].label,
}))

export function priorityMeta(priority) {
  return PRIORITY_META[priority] ?? { label: priority, cssClass: '' }
}

export function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, cssClass: '' }
}

/** Midnight today, so day comparisons ignore the clock. */
function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

/** Whole days from today to `dateStr`; negative means the date has passed. */
function daysUntil(dateStr) {
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.round((due - startOfToday()) / 86400000)
}

/** A task is late only while it is still unfinished. */
export function isTaskOverdue(task) {
  if (!task?.dueDate || task.status === 'done') return false
  return daysUntil(task.dueDate) < 0
}

/**
 * The short due-date label used in list rows and board cards.
 * Returns `{ label, overdue }` — "2d overdue", "Due today", "Sep 17".
 */
export function formatDue(dateStr, status) {
  if (!dateStr) return { label: 'No due date', overdue: false }

  const diffDays = daysUntil(dateStr)
  const shortDate = new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  /* A finished task is never late, however long ago it was due. */
  if (status === 'done') return { label: shortDate, overdue: false }

  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true }
  if (diffDays === 0) return { label: 'Due today', overdue: false }
  if (diffDays === 1) return { label: 'Due tomorrow', overdue: false }

  return { label: shortDate, overdue: false }
}

/** "Thursday, September 17, 2026" — used on the detail page. */
export function formatFullDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** "Sep 17, 2026, 10:00 AM" — used for created and completed stamps. */
export function formatTimestamp(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** `YYYY-MM-DD` for the date input, which refuses any other shape. */
export function toDateInputValue(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-CA')
}

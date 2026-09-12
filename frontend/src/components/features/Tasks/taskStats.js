/**
 * Dashboard figures derived from the task list.
 *
 * These mirror GET /api/v1/stats exactly, so the numbers a student sees while
 * working offline match the ones the API returns once it is wired up:
 *   overdue      due before today and not done
 *   due this week  Monday to Sunday of the current week, and not done
 *   completion   completed / total, rounded
 */

import { isTaskOverdue } from './taskMeta'

function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function atMidnight(dateStr) {
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date
}

/** Monday 00:00 and Sunday 23:59 of the week containing today. */
function currentWeekBounds() {
  const start = startOfToday()
  /* getDay() is 0 on Sunday, which belongs to the week that began six days ago. */
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)

  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export function isDueThisWeek(task) {
  if (!task?.dueDate || task.status === 'done') return false
  const { start, end } = currentWeekBounds()
  const due = atMidnight(task.dueDate)
  return due >= start && due <= end
}

/** The four headline numbers plus the completion rate. */
export function getDashboardStats(tasks) {
  const totalTasks = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'done').length

  return {
    totalTasks,
    completedCount,
    overdueCount: tasks.filter(isTaskOverdue).length,
    dueThisWeekCount: tasks.filter(isDueThisWeek).length,
    completionRate: totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100),
  }
}

/** Unfinished work that is not yet late, soonest first. */
export function getUpcomingTasks(tasks, limit = 4) {
  const today = startOfToday()
  return tasks
    .filter((t) => t.status !== 'done' && t.dueDate && atMidnight(t.dueDate) >= today)
    .sort((a, b) => atMidnight(a.dueDate) - atMidnight(b.dueDate))
    .slice(0, limit)
}

/** Late work, the most overdue first. */
export function getOverdueTasks(tasks, limit = 3) {
  return tasks
    .filter(isTaskOverdue)
    .sort((a, b) => atMidnight(a.dueDate) - atMidnight(b.dueDate))
    .slice(0, limit)
}

/** Whole days a task is past its due date. */
export function daysOverdue(task) {
  return Math.round((startOfToday() - atMidnight(task.dueDate)) / 86400000)
}

/** Midnight seven days from today — the far edge of the "next 7 days" window. */
function endOfHorizon() {
  const end = startOfToday()
  end.setDate(end.getDate() + 7)
  end.setHours(23, 59, 59, 999)
  return end
}

/**
 * Unfinished work due between today and seven days out.
 * The Upcoming page counts this for its horizon banner and its "Next 7 days"
 * tab, so both always agree. Overdue work is excluded: it has its own tab.
 */
export function isOnHorizon(task) {
  if (!task?.dueDate || task.status === 'done') return false
  const due = atMidnight(task.dueDate)
  return due >= startOfToday() && due <= endOfHorizon()
}

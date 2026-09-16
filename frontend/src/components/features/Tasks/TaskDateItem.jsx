import { Link } from 'react-router-dom'
import { formatDue, statusMeta } from './taskMeta'

/** "SEP" / "8" for the small date tile. */
function tile(dateStr) {
  const date = new Date(dateStr)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
  }
}

/**
 * One task as a dated line: a date tile, the title, then the course and how
 * the deadline stands. Used by the calendar's daily view and the dashboard's
 * week panel, which show the same thing in different places.
 */
export default function TaskDateItem({ task }) {
  const stamp = tile(task.dueDate)
  const done = task.status === 'done'
  const due = formatDue(task.dueDate, task.status)

  return (
    <li className="task-date-item">
      <span className="task-date-tile" aria-hidden="true">
        <span className="task-date-tile-month">{stamp.month}</span>
        <span className="task-date-tile-day">{stamp.day}</span>
      </span>

      <div className="task-date-text">
        <Link to={`/tasks/${task.id}`} className={`task-date-title ${done ? 'is-done' : ''}`}>
          {task.title}
        </Link>
        <p className="task-date-meta">
          <span
            className="task-date-dot"
            style={{ '--course-color': task.courseColor }}
            aria-hidden="true"
          />
          {task.courseCode}
          <span aria-hidden="true"> · </span>
          <span className={due.overdue ? 'is-overdue' : ''}>
            {done ? statusMeta(task.status).label : due.label}
          </span>
        </p>
      </div>
    </li>
  )
}

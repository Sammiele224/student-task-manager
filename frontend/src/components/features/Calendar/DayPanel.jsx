import { Link } from 'react-router-dom'
import { Plus, Sun } from 'lucide-react'
import { Button } from '../../ui'
import { formatDue, statusMeta } from '../Tasks/taskMeta'
import { dayHeading, dayTile } from './calendarGrid'

/**
 * The daily view beside the grid: everything due on the selected day, with a
 * calm empty state for a day that asks nothing of you.
 */
export default function DayPanel({ day, tasks, onAdd }) {
  const heading = dayHeading(day)

  return (
    <aside className="calendar-day-panel">
      <span className="u-eyebrow">Your daily view</span>

      <h2 className="calendar-panel-weekday u-display">{heading.weekday}</h2>
      <p className="calendar-panel-date">{heading.date}</p>

      <p className="calendar-panel-count">
        {tasks.length} {tasks.length === 1 ? 'assignment' : 'assignments'} on the calendar
      </p>

      {tasks.length === 0 ? (
        <div className="calendar-panel-empty">
          <Sun aria-hidden="true" />
          <p className="calendar-panel-empty-title u-display">A little space to breathe.</p>
          <p className="calendar-panel-empty-text">No assignments due on this day.</p>
        </div>
      ) : (
        <ul className="calendar-panel-list">
          {tasks.map((task) => {
            const tile = dayTile(task.dueDate)
            const done = task.status === 'done'
            const due = formatDue(task.dueDate, task.status)

            return (
              <li key={task.id} className="calendar-panel-item">
                <span className="calendar-panel-tile" aria-hidden="true">
                  <span className="calendar-panel-tile-month">{tile.month}</span>
                  <span className="calendar-panel-tile-day">{tile.day}</span>
                </span>

                <div className="calendar-panel-item-text">
                  <Link
                    to={`/tasks/${task.id}`}
                    className={`calendar-panel-item-title ${done ? 'is-done' : ''}`}
                  >
                    {task.title}
                  </Link>
                  <p className="calendar-panel-item-meta">
                    <span
                      className="calendar-panel-item-dot"
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
          })}
        </ul>
      )}

      <Button variant="secondary" fullWidth iconLeft={<Plus size={16} />} onClick={onAdd}>
        Add an assignment
      </Button>
    </aside>
  )
}

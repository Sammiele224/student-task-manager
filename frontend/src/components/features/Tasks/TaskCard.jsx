import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import StatusSelect from './StatusSelect'
import { formatDue, priorityMeta } from './taskMeta'

/**
 * One task as a board card: course, priority badge, title, notes, due date,
 * status. Same information as TaskRow, stacked for the grid view.
 */
export default function TaskCard({ task, onStatusChange }) {
  const due = formatDue(task.dueDate, task.status)
  const priority = priorityMeta(task.priority)
  const done = task.status === 'done'

  return (
    <article className="tasks-board-card">
      <div className="tasks-board-card-top">
        <span className="tasks-board-card-course">
          <span
            className="tasks-course-dot"
            style={{ '--course-color': task.courseColor }}
            aria-hidden="true"
          />
          {task.courseCode}
        </span>
        <span className={`tasks-priority ${priority.cssClass}`}>{priority.label}</span>
      </div>

      <Link to={`/tasks/${task.id}`} className={`tasks-board-card-title ${done ? 'done' : ''}`}>
        {task.title}
      </Link>

      {task.description && <p className="tasks-board-card-desc">{task.description}</p>}

      <div className="tasks-board-card-footer">
        <span className={`tasks-board-card-due ${due.overdue ? 'overdue' : ''}`}>
          <Clock size={12} aria-hidden="true" />
          {due.label}
        </span>

        <StatusSelect
          value={task.status}
          onChange={(status) => onStatusChange(task.id, status)}
          label={`Status for ${task.title}`}
          size="sm"
        />
      </div>
    </article>
  )
}

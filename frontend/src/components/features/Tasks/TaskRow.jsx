import { Link } from 'react-router-dom'
import { AlertTriangle, Check, Pencil, Trash2 } from 'lucide-react'
import StatusSelect from './StatusSelect'
import { formatDue, isTaskOverdue, priorityMeta } from './taskMeta'

/**
 * One task as a table row: title, course, due date, priority badge, status.
 * The title links to the task detail page; the pencil opens the edit dialog
 * and the bin asks the page to confirm before removing the task.
 */
export default function TaskRow({ task, onToggleDone, onStatusChange, onEdit, onDelete }) {
  const due = formatDue(task.dueDate, task.status)
  const overdue = isTaskOverdue(task)
  const done = task.status === 'done'
  const priority = priorityMeta(task.priority)

  return (
    <div className={`tasks-row ${overdue ? 'overdue' : ''}`}>
      <div className="tasks-assignment">
        <button
          type="button"
          onClick={() => onToggleDone(task.id)}
          className={`tasks-checkbox ${done ? 'done' : ''}`}
          aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
          aria-pressed={done}
        >
          {done && <Check strokeWidth={3} />}
        </button>

        <div className="tasks-assignment-text">
          <Link to={`/tasks/${task.id}`} className={`tasks-title-text ${done ? 'done' : ''}`}>
            {task.title}
          </Link>
          <p className="tasks-subtext">
            <span
              className="tasks-course-dot"
              style={{ '--course-color': task.courseColor }}
              aria-hidden="true"
            />
            {task.courseCode} · {task.courseName}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="tasks-row-actions">
            {onEdit && (
              <button
                type="button"
                className="tasks-row-action"
                onClick={() => onEdit(task)}
                aria-label={`Edit "${task.title}"`}
              >
                <Pencil size={14} aria-hidden="true" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="tasks-row-action tasks-row-action--danger"
                onClick={() => onDelete(task)}
                aria-label={`Delete "${task.title}"`}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={`tasks-due ${due.overdue ? 'overdue' : ''}`}>
        {due.overdue && <AlertTriangle aria-hidden="true" />}
        {due.label}
      </div>

      <div>
        <span className={`tasks-priority ${priority.cssClass}`}>
          <span className={`tasks-priority-dot ${priority.cssClass}`} aria-hidden="true" />
          {priority.label}
        </span>
      </div>

      <StatusSelect
        value={task.status}
        onChange={(status) => onStatusChange(task.id, status)}
        label={`Status for ${task.title}`}
      />
    </div>
  )
}

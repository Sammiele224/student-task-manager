import { X, Clock, CalendarDays, Flag, CircleDot, CheckCircle2 } from 'lucide-react'

const PRIORITY_META = {
  low: { label: 'Low', cssClass: 'low' },
  medium: { label: 'Medium', cssClass: 'medium' },
  high: { label: 'High', cssClass: 'high' },
}

const STATUS_META = {
  todo: { label: 'To do', cssClass: 'todo' },
  in_progress: { label: 'In progress', cssClass: 'in-progress' },
  done: { label: 'Done', cssClass: 'done' },
}

const STATUS_VALUES = Object.keys(STATUS_META)

function formatFullDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimestamp(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TaskDetailDrawer({ task, onClose, onStatusChange }) {
  if (!task) return null

  const priorityMeta = PRIORITY_META[task.priority] ?? { label: task.priority, cssClass: '' }
  const statusMeta = STATUS_META[task.status] ?? { label: task.status, cssClass: '' }

  return (
    <div className="task-detail-overlay" onClick={onClose}>
      <div className="task-detail-drawer" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="task-detail-header">
          <div
            className="task-detail-course"
            style={{ '--course-color': task.courseColor }}
          >
            <span className="task-detail-course-dot" />
            {task.courseCode} · {task.courseName}
          </div>
          <button className="task-detail-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="task-detail-body">
          <h2 className="task-detail-title">{task.title}</h2>

          <div className="task-detail-badges">
            <span className={`tasks-priority ${priorityMeta.cssClass}`}>
              <Flag size={12} />
              {priorityMeta.label} priority
            </span>

            {task.isOverdue && (
              <span className="task-detail-overdue-badge">
                <Clock size={12} />
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <div className="task-detail-section">
              <p className="task-detail-section-label">Description</p>
              <p className="task-detail-description">{task.description}</p>
            </div>
          )}

          <div className="task-detail-section">
            <p className="task-detail-section-label">Status</p>
            <div className={`tasks-status task-detail-status ${statusMeta.cssClass}`}>
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
              >
                {STATUS_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {STATUS_META[v].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="task-detail-meta">
            <div className="task-detail-meta-row">
              <CalendarDays size={15} />
              <div>
                <p className="task-detail-meta-label">Due date</p>
                <p className={`task-detail-meta-value ${task.isOverdue ? 'overdue' : ''}`}>
                  {formatFullDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="task-detail-meta-row">
              <CircleDot size={15} />
              <div>
                <p className="task-detail-meta-label">Created</p>
                <p className="task-detail-meta-value">{formatTimestamp(task.createdAt)}</p>
              </div>
            </div>

            <div className="task-detail-meta-row">
              <CheckCircle2 size={15} />
              <div>
                <p className="task-detail-meta-label">Completed</p>
                <p className="task-detail-meta-value">
                  {task.completedAt ? formatTimestamp(task.completedAt) : 'Not completed yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
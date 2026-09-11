import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clock,
  Flag,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import StatusSelect from '../components/features/Tasks/StatusSelect'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import {
  formatDue,
  formatFullDate,
  formatTimestamp,
  isTaskOverdue,
  priorityMeta,
} from '../components/features/Tasks/taskMeta'
import { PageContainer, PageHeader } from '../components/layout'
import { Button, Card } from '../components/ui'

import '../styles/features/Task/Tasks.css'
import '../styles/features/Task/TaskForm.css'
import '../styles/features/Task/TaskDetailPage.css'

/** One task in full, with the controls to change it. Route: /tasks/:id */
export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTaskById, courses, loading, updateTask, deleteTask, setTaskStatus, toggleDone } = useTasks()

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const task = getTaskById(id)

  if (loading) {
    return (
      <PageContainer>
        <p className="task-detail-loading">Loading this assignment…</p>
      </PageContainer>
    )
  }

  if (!task) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Nothing here"
          title="We couldn't find that task."
          subtitle="It may have been deleted, or the link points somewhere that no longer exists."
        />
        <Card padding="lg">
          <Button as={Link} to="/tasks" iconLeft={<ArrowLeft size={16} />}>
            Back to all tasks
          </Button>
        </Card>
      </PageContainer>
    )
  }

  const due = formatDue(task.dueDate, task.status)
  const overdue = isTaskOverdue(task)
  const priority = priorityMeta(task.priority)
  const done = task.status === 'done'

  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
      navigate('/tasks')
    } catch {
      /* The task stays put and the context reports why. */
      setShowDelete(false)
    }
  }

  return (
    <PageContainer>
      <Link to="/tasks" className="task-detail-back">
        <ArrowLeft size={15} aria-hidden="true" />
        All tasks
      </Link>

      <PageHeader
        eyebrow={
          <span className="task-detail-course">
            <span
              className="tasks-course-dot"
              style={{ '--course-color': task.courseColor }}
              aria-hidden="true"
            />
            {task.courseCode} · {task.courseName}
          </span>
        }
        title={task.title}
        subtitle={due.overdue ? `This one is ${due.label}.` : `Due ${formatFullDate(task.dueDate)}.`}
        actions={
          <div className="task-detail-actions">
            <Button iconLeft={<Pencil size={15} />} onClick={() => setShowEdit(true)}>
              Edit task
            </Button>
            <Button
              variant="ghost"
              className="is-danger"
              iconLeft={<Trash2 size={15} />}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div className="task-detail-grid">
        <div className="task-detail-main">
          <Card padding="lg">
            <div className="task-detail-badges">
              <span className={`tasks-priority ${priority.cssClass}`}>
                <Flag size={12} aria-hidden="true" />
                {priority.label} priority
              </span>

              {overdue && (
                <span className="tasks-priority high">
                  <Clock size={12} aria-hidden="true" />
                  {due.label}
                </span>
              )}
            </div>

            <div className="task-detail-section">
              <p className="task-detail-section-label">Notes</p>
              <p className="task-detail-description">
                {task.description || 'No notes on this one yet.'}
              </p>
            </div>

            <div className="task-detail-section">
              <p className="task-detail-section-label">Status</p>
              <div className="task-detail-status-row">
                <StatusSelect
                  value={task.status}
                  onChange={(status) => setTaskStatus(task.id, status).catch(() => {})}
                  label="Task status"
                  className="task-detail-status"
                />

                <button
                  type="button"
                  className={`task-detail-complete ${done ? 'done' : ''}`}
                  onClick={() => toggleDone(task.id).catch(() => {})}
                  aria-pressed={done}
                >
                  <span className={`tasks-checkbox ${done ? 'done' : ''}`} aria-hidden="true">
                    {done && <Check strokeWidth={3} />}
                  </span>
                  {done ? 'Completed' : 'Mark as complete'}
                </button>
              </div>
            </div>
          </Card>
        </div>

        <Card padding="lg" className="task-detail-meta-card">
          <p className="task-detail-section-label">Details</p>

          <div className="task-detail-meta">
            <div className="task-detail-meta-row">
              <CalendarDays size={15} aria-hidden="true" />
              <div>
                <p className="task-detail-meta-label">Due date</p>
                <p className={`task-detail-meta-value ${overdue ? 'overdue' : ''}`}>
                  {formatFullDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="task-detail-meta-row">
              <CircleDot size={15} aria-hidden="true" />
              <div>
                <p className="task-detail-meta-label">Created</p>
                <p className="task-detail-meta-value">{formatTimestamp(task.createdAt)}</p>
              </div>
            </div>

            <div className="task-detail-meta-row">
              <CheckCircle2 size={15} aria-hidden="true" />
              <div>
                <p className="task-detail-meta-label">Completed</p>
                <p className="task-detail-meta-value">
                  {task.completedAt ? formatTimestamp(task.completedAt) : 'Not completed yet'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <EditTaskModal
        open={showEdit}
        task={task}
        courses={courses}
        onClose={() => setShowEdit(false)}
        onSave={updateTask}
        onDelete={() => {
          setShowEdit(false)
          setShowDelete(true)
        }}
      />

      <TaskMessageDialog
        open={showDelete}
        title="Delete this task?"
        message={`“${task.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete task"
        tone="danger"
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </PageContainer>
  )
}

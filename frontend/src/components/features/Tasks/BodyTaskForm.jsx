import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '../../ui'
import {
  PRIORITY_META,
  PRIORITY_VALUES,
  STATUS_VALUES,
  statusMeta,
  toDateInputValue,
} from './taskMeta'

const EMPTY_VALUES = {
  title: '',
  courseId: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
  description: '',
}

/** Task-shaped values become form-shaped values: every field a string. */
function toFormValues(task) {
  return {
    title: task.title ?? '',
    courseId: task.courseId != null ? String(task.courseId) : '',
    dueDate: toDateInputValue(task.dueDate),
    priority: task.priority ?? 'medium',
    status: task.status ?? 'todo',
    description: task.description ?? '',
  }
}

/**
 * The body of the edit-task dialog. Kept separate from the dialog shell so an
 * add-task dialog can reuse it: pass no initialValues and hide the status field.
 *
 * @param {object} initialValues  task-shaped values to prefill
 * @param {Array} courses         course options for the required course field
 * @param {string} submitLabel    the confirming action's label
 * @param {boolean} showStatus    the status field only appears when editing
 * @param {Function} onSubmit     receives cleaned values
 * @param {Function} onCancel
 * @param {Function} onDelete     renders the destructive footer action when given
 */
export function TaskForm({
  initialValues = EMPTY_VALUES,
  courses = [],
  submitLabel = 'Save changes',
  showStatus = false,
  onSubmit,
  onCancel,
  onDelete,
}) {
  /* Prefilled from the first render, so an edit never flashes an empty form. */
  const [values, setValues] = useState(() => toFormValues(initialValues))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValues(toFormValues(initialValues))
    setError('')
  }, [initialValues])

  const setField = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return

    if (!values.title.trim()) {
      setError('Please give your task a title.')
      return
    }
    if (!values.courseId) {
      setError('Please choose a course for this task.')
      return
    }
    if (!values.dueDate) {
      setError('Please pick a due date.')
      return
    }

    /* onSubmit may talk to the API, so wait for it. A rejection keeps the
       dialog open with the reason on screen rather than closing silently. */
    try {
      setSaving(true)
      await onSubmit({
        title: values.title.trim(),
        courseId: Number(values.courseId),
        dueDate: values.dueDate,
        priority: values.priority,
        status: showStatus ? values.status : initialValues.status ?? 'todo',
        description: values.description.trim(),
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong saving this task.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="modal-form task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="task-title">
          Task title <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="What are you working on?"
          value={values.title}
          onChange={setField('title')}
          autoFocus
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-course">
          Course <span className="required">*</span>
        </label>
        <select id="task-course" value={values.courseId} onChange={setField('courseId')}>
          <option value="" disabled>
            Choose a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} · {course.code}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="task-due">
            Due date <span className="required">*</span>
          </label>
          <input
            id="task-due"
            type="date"
            value={values.dueDate}
            onChange={setField('dueDate')}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={values.priority} onChange={setField('priority')}>
            {PRIORITY_VALUES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_META[priority].formLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showStatus && (
        <div className="form-field">
          <label htmlFor="task-status">Status</label>
          <select id="task-status" value={values.status} onChange={setField('status')}>
            {STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {statusMeta(status).label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="task-notes">
          Notes <span className="optional">(optional)</span>
        </label>
        <textarea
          id="task-notes"
          rows={4}
          placeholder="Ideas, instructions, or a little reminder for future you…"
          value={values.description}
          onChange={setField('description')}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className={`modal-footer ${onDelete ? 'modal-footer--split' : ''}`}>
        {onDelete && (
          <Button variant="danger" type="button" onClick={onDelete} disabled={saving}>
            Delete task
          </Button>
        )}
        <div className="modal-footer-actions">
          <Button variant="ghost" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} iconRight={<ArrowUpRight size={16} />}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}

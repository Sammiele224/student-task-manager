import { useMemo } from 'react'
import { Modal } from '../../ui/Modal'
import { TaskForm } from './BodyTaskForm'
import { toDateInputValue } from './taskMeta'

/**
 * The add-task dialog. Same form body as the edit dialog, without the status
 * field — a task nobody has started is always to-do.
 *
 * @param {string} dueDate  optional date to prefill, e.g. the day picked on the calendar
 * @param {Function} onCreate  receives the cleaned values; may reject
 */
export function CreateTaskModal({ open, courses, dueDate, onClose, onCreate }) {
  /* A fresh object each render would re-run the form's prefill effect and wipe
     what is being typed, so this is tied to the one value that can change. */
  const initialValues = useMemo(
    () => ({
      title: '',
      courseId: '',
      dueDate: dueDate ? toDateInputValue(dueDate) : '',
      priority: 'medium',
      status: 'todo',
      description: '',
    }),
    [dueDate]
  )

  if (!open) return null

  /* Close only once the create has gone through. A rejection travels back to
     the form, which keeps the dialog open with the reason on screen. */
  const handleSubmit = async (values) => {
    await onCreate(values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Your learning space"
      title="One step closer."
      subtitle="A little intention. A clear next action."
    >
      <TaskForm
        initialValues={initialValues}
        courses={courses}
        submitLabel="Create task"
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

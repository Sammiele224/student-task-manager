import { Modal } from '../../ui/Modal'
import { TaskForm } from './BodyTaskForm'

export function EditTaskModal({ open, task, onClose, onSave, onDelete, courses }) {
  if (!task) return null

  /* Close only once the save has actually gone through. If onSave rejects,
     the error travels back to the form, which keeps the dialog open. */
  const handleSubmit = async (values) => {
    await onSave(task.id, values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Your learning space"
      title="Shape your next step."
      subtitle="Update the details and keep things moving."
    >
      <TaskForm
        initialValues={task}
        courses={courses}
        submitLabel="Save changes"
        showStatus
        onCancel={onClose}
        onSubmit={handleSubmit}
        onDelete={onDelete ? () => onDelete(task) : undefined}
      />
    </Modal>
  )
}

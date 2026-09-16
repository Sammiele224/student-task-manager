import { Modal } from '../../ui/Modal'
import { CourseForm } from './BodyCourseForm'

export function CreateCourseModal({ open, onClose, onCreate }) {
  const handleSubmit = (values) => {
    onCreate(values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Your learning space"
      title="A new chapter starts here."
      subtitle="Give your learning a little room to grow."
    >
      <CourseForm submitLabel="Create course" onCancel={onClose} onSubmit={handleSubmit} />
    </Modal>
  )
}
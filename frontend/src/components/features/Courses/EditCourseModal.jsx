import { Modal } from '../../ui/Modal'
import { CourseForm } from './BodyCourseForm'

export function EditCourseModal({ open, onClose, course, onSave }) {
  if (!course) return null

  const handleSubmit = (values) => {
    onSave(course.id, values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Your learning space"
      title="Edit Course"
      subtitle="Make this course feels like yours"
    >
      <CourseForm
        initialValues={{ name: course.name, code: course.code, color: course.color }}
        submitLabel="Save changes"
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}
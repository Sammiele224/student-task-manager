import { useState } from 'react'
import { Modal } from '../../ui/Modal'
import { CourseForm } from './BodyCourseForm'

export function EditCourseModal({ open, onClose, course, onSave }) {
  const [error, setError] = useState('')

  if (!course) return null

  /* Same as creating: a refused save keeps the dialog and says why. */
  const handleSubmit = async (values) => {
    setError('')

    try {
      await onSave(course.id, values)
      onClose()
    } catch (err) {
      setError(err?.message || 'Could not save this course. Please try again.')
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      eyebrow="Your learning space"
      title="Edit Course"
      subtitle="Make this course feels like yours"
    >
      {error && (
        <p className="course-form-error" role="alert">
          {error}
        </p>
      )}

      <CourseForm
        initialValues={{ name: course.name, code: course.code, color: course.color }}
        submitLabel="Save changes"
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

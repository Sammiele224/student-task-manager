import { useState } from 'react'
import { Modal } from '../../ui/Modal'
import { CourseForm } from './BodyCourseForm'

export function CreateCourseModal({ open, onClose, onCreate }) {
  const [error, setError] = useState('')

  /* The dialog stays open when the API refuses — a duplicate course code, say —
     so the reason lands beside the fields and nothing typed is lost. */
  const handleSubmit = async (values) => {
    setError('')

    try {
      await onCreate(values)
      onClose()
    } catch (err) {
      setError(err?.message || 'Could not create this course. Please try again.')
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
      title="A new chapter starts here."
      subtitle="Give your learning a little room to grow."
    >
      {error && (
        <p className="course-form-error" role="alert">
          {error}
        </p>
      )}

      <CourseForm submitLabel="Create course" onCancel={handleClose} onSubmit={handleSubmit} />
    </Modal>
  )
}

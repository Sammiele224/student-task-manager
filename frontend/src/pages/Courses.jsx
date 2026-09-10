import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui'
import { CourseCard, AddCourseCard } from '../components/features/Courses/CourseCard'
import { CoursesToolbar } from '../components/features/Courses/CourseToolBar'
import { CreateCourseModal } from '../components/features/Courses/CreateCourseModal'
import { EditCourseModal } from '../components/features/Courses/EditCourseModal'
import PagePlaceholder from './PagePlaceholder'

import coursesData from '../data/course.json'
import '../styles/features/Course/Course.css'
import '../styles/features/Course/CourseForm.css'

export default function Courses() {
  const [courses, setCourses] = useState(coursesData.data)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null) // course object or null

  const handleCreateCourse = (values) => {
    setCourses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...values, activeCount: 0, done: 0, total: 0 },
    ])
  }

  const handleSaveCourse = (id, values) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...values } : c)))
  }

  const handleRemoveCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <>
      <PagePlaceholder
        eyebrow="Your academic world"
        title="A home for every course."
        subtitle="Keep your subjects organized. Give every assignment a place to belong."
        actions={<Button iconLeft={<Plus />} onClick={() => setShowCreateModal(true)}>New course</Button>}
      />

      <div className="courses-wrapper">
        <CoursesToolbar count={courses.length} semester="Fall Semester 2026" />

        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => setEditingCourse(course)}
              onRemove={() => handleRemoveCourse(course.id)}
            />
          ))}
          <AddCourseCard onClick={() => setShowCreateModal(true)} />
        </div>
      </div>

      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCourse}
      />

      <EditCourseModal
        open={!!editingCourse}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSave={handleSaveCourse}
      />
    </>
  )
}
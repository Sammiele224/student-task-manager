import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui'
import { CourseCard, AddCourseCard } from '../components/features/Courses/CourseCard'
import { CoursesToolbar } from '../components/features/Courses/CourseToolBar'
import { CreateCourseModal } from '../components/features/Courses/CreateCourseModal'
import { EditCourseModal } from '../components/features/Courses/EditCourseModal'
import DeleteConfirmDialog from '../components/ui/DeleteConfirmDialog'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../api/CourseApi'
import { PageContainer, PageHeader } from '../components/layout'

import '../styles/features/Course/Course.css'
import '../styles/features/Course/CourseForm.css'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [error, setError] = useState('')
  const [editingCourse, setEditingCourse] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const COURSES_PER_PAGE = 5

  // get courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getCourses()

        setCourses(data)
      } catch (error) {
        console.error(error)
        setError(error.message || 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // post course
  const handleCreateCourse = async (values) => {
    try {
      setError('')

      const newCourse = await createCourse(values)

      setCourses((prev) => [...prev, newCourse])

      // move to last page after created
      const newTotalPages = Math.ceil(
        (courses.length + 1) / COURSES_PER_PAGE
      )

      setCurrentPage(newTotalPages)

      setShowCreateModal(false)
    } catch (error) {
      console.error(error)
      setError(error.message || 'Failed to create course')

      throw error
    }
  }

  // put course
  const handleSaveCourse = async (id, values) => {
    try {
      setError('')

      const updatedCourse = await updateCourse(id, values)

      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? updatedCourse : course
        )
      )

      setEditingCourse(null)
    } catch (error) {
      console.error(error)
      setError(error.message || 'Failed to update course')
    }
  }

  // delete course
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return

    const id = courseToDelete.id

    await deleteCourse(id)

    setCourses((prev) => {
      const updatedCourses = prev.filter(
        (course) => course.id !== id
      )

      const newTotalPages = Math.max(
        1,
        Math.ceil(
          updatedCourses.length / COURSES_PER_PAGE
        )
      )

      setCurrentPage((current) =>
        Math.min(current, newTotalPages)
      )

      return updatedCourses
    })
  }

  // page total
  const totalPages = Math.ceil(
    courses.length / COURSES_PER_PAGE
  )

  // get current courses for the current page
  const startIndex =
    (currentPage - 1) * COURSES_PER_PAGE

  const currentCourses = courses.slice(
    startIndex,
    startIndex + COURSES_PER_PAGE
  )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Your academic world"
        title="A home for every course."
        subtitle="Keep your subjects organized. Give every assignment a place to belong."
        actions={
          <Button
            iconLeft={<Plus />}
            onClick={() => setShowCreateModal(true)}
          >
            New course
          </Button>
        }
      />

      <div className="courses-wrapper">
        <CoursesToolbar
          count={courses.length}
          semester="Fall Semester 2026"
        />

        {error && (
          <div className="course-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="courses-loading">
            Loading courses...
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={() => setEditingCourse(course)}
                  onRemove={() =>
                    setCourseToDelete(course)
                  }
                />
              ))}

              <AddCourseCard
                onClick={() => setShowCreateModal(true)}
              />
            </div>

            <DeleteConfirmDialog
              open={!!courseToDelete}
              onCancel={() => setCourseToDelete(null)}
              title="Delete this course?"
              message={
                <>
                  "{courseToDelete?.name}" will be permanently removed.
                  This cannot be undone.
                </>
              }
              successTitle="Course deleted successfully"
              successMessage={`"${courseToDelete?.name}" has been removed.`}
              onConfirm={handleConfirmDelete}
            />

            {/* pagination */}
            {totalPages > 1 && (
              <div className="courses-pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page
                      ? 'pagination-button--active'
                      : ''
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
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
    </PageContainer>
  )
}
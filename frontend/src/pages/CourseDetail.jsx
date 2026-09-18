import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import TaskListPanel from '../components/features/Tasks/TaskListPanel'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { CreateTaskModal } from '../components/features/Tasks/CreateTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import { EditCourseModal } from '../components/features/Courses/EditCourseModal'
import CourseProgressPanel from '../components/features/Courses/CourseProgressPanel'
import { courseColorValue } from '../components/features/Courses/courseColors'
import { isTaskOverdue } from '../components/features/Tasks/taskMeta'
import { updateCourse } from '../api/CourseApi'
import { PageContainer, PageHeader } from '../components/layout'
import { Button, Card } from '../components/ui'

import '../styles/features/Task/Tasks.css'
/* CourseForm.css holds the modal shell and base field styles despite its name. */
import '../styles/features/Course/CourseForm.css'
import '../styles/features/Task/TaskForm.css'
import '../styles/features/Course/CourseDetail.css'

const TASKS_PER_PAGE = 8

/** One course and everything due for it. Route: /courses/:id */
export default function CourseDetail() {
  const { id } = useParams()
  const {
    tasks,
    courses,
    loading,
    error,
    clearError,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    setTaskStatus,
  } = useTasks()

  const [creating, setCreating] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [editingCourse, setEditingCourse] = useState(false)
  const [course, setCourse] = useState(null)

  /* The route param is a string and the record's id is a number. */
  const fromList = courses.find((c) => String(c.id) === String(id)) ?? null

  /* A course edited here is held locally so the header updates immediately;
     the list from the context refreshes on its own next load. */
  const shown = course ?? fromList

  const courseTasks = useMemo(
    () => tasks.filter((t) => String(t.courseId) === String(id)),
    [tasks, id]
  )

  const counts = useMemo(() => {
    const done = courseTasks.filter((t) => t.status === 'done').length
    return {
      done,
      active: courseTasks.length - done,
      overdue: courseTasks.filter(isTaskOverdue).length,
    }
  }, [courseTasks])

  const handleStatusChange = async (taskId, status) => {
    try {
      await setTaskStatus(taskId, status)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  const handleToggleDone = async (taskId) => {
    try {
      await toggleDone(taskId)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  const handleConfirmDelete = async () => {
    const taskId = taskToDelete.id
    setTaskToDelete(null)
    setEditingTask(null)
    try {
      await deleteTask(taskId)
    } catch {
      /* The context holds the reason and shows it above the list. */
    }
  }

  const handleSaveCourse = async (courseId, values) => {
    try {
      setCourse(await updateCourse(courseId, values))
    } catch (err) {
      console.error(err)
    }
  }

  /* Courses arrive with the task list, so an unknown id before that lands is
     still loading rather than missing. */
  if (loading) {
    return (
      <PageContainer>
        <p className="course-detail-loading">Loading this course…</p>
      </PageContainer>
    )
  }

  if (!shown) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Nothing here"
          title="We couldn't find that course."
          subtitle="It may have been deleted, or the link points somewhere that no longer exists."
        />
        <Card padding="lg">
          <Button as={Link} to="/courses" iconLeft={<ArrowLeft size={16} />}>
            Back to my courses
          </Button>
        </Card>
      </PageContainer>
    )
  }

  const color = courseColorValue(shown.color)

  return (
    <PageContainer className="course-detail">
      <PageHeader
        eyebrow={shown.code}
        title={shown.name}
        subtitle="Every assignment for this course, and how far through them you are."
        actions={
          <div className="course-detail__actions">
            <Button
              variant="secondary"
              iconLeft={<Pencil size={16} />}
              onClick={() => setEditingCourse(true)}
            >
              Edit course
            </Button>
            <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
              New task
            </Button>
          </div>
        }
      />

      {error && (
        <div className="tasks-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <CourseProgressPanel
        done={counts.done}
        active={counts.active}
        overdue={counts.overdue}
        color={color}
      />

      <TaskListPanel
        tasks={courseTasks}
        courses={courses}
        loading={loading}
        pageSize={TASKS_PER_PAGE}
        emptyTitle="No tasks in this course yet."
        emptyText="Add your first task to start managing your work."
        onToggleDone={handleToggleDone}
        onStatusChange={handleStatusChange}
        onEdit={setEditingTask}
        onDelete={setTaskToDelete}
      />

      {/* Opened from a course, so that course is already chosen. */}
      <CreateTaskModal
        open={creating}
        courses={courses}
        courseId={shown.id}
        onClose={() => setCreating(false)}
        onCreate={addTask}
      />

      <EditTaskModal
        open={Boolean(editingTask)}
        task={editingTask}
        courses={courses}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onDelete={setTaskToDelete}
      />

      <EditCourseModal
        open={editingCourse}
        course={shown}
        onClose={() => setEditingCourse(false)}
        onSave={handleSaveCourse}
      />

      <TaskMessageDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        message={`“${taskToDelete?.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete task"
        tone="danger"
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  )
}

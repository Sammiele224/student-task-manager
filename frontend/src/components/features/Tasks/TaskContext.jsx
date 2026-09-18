import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getToken } from '../../../api/AuthApi'
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
  updateTaskStatus,
} from '../../../api/TaskApi'
import {
  createCourse as createCourseRequest,
  deleteCourse as deleteCourseRequest,
  getCourses,
  updateCourse as updateCourseRequest,
} from '../../../api/CourseApi'
import { courseColorValue } from '../Courses/courseColors'
import { applyStatus, isTaskOverdue, nextToggledStatus } from './taskMeta'

/**
 * A task carries its course's stored colour name. Resolving it here means the
 * rows, cards, chips and dots downstream can drop it straight into
 * `--course-color` without each knowing about the palette.
 *
 * Courses themselves are left alone: CourseCard resolves its own, and
 * resolving twice would lose the name.
 */
function withCourseColor(tasks) {
  return tasks.map((task) => ({ ...task, courseColor: courseColorValue(task.courseColor) }))
}

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /** Pulls the list back from the API. Writes call this when the response
      does not carry enough to rebuild the row on its own. */
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError('')

      const taskList = await getTasks(filters)

      setTasks(withCourseColor(taskList))
    } catch (err) {
      setError(err.message || 'Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Loads everything the signed-in student owns. The provider sits above the
   * sign-in page, so it mounts before anyone has a token: with none, there is
   * nothing to ask for, and asking would only leave an "Authentication
   * required" banner behind. SignIn calls this again once the token is saved.
   *
   * Each call gets a number, so a slow earlier load cannot overwrite a newer one.
   */
  const loadId = useRef(0)

  const reload = useCallback(async () => {
    const id = ++loadId.current
    const isLatest = () => id === loadId.current

    setError('')

    if (!getToken()) {
      setTasks([])
      setCourses([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [taskList, courseList] = await Promise.all([getTasks(), getCourses()])
      if (!isLatest()) return
      setTasks(withCourseColor(taskList))
      setCourses(courseList)
    } catch (err) {
      if (isLatest()) setError(err.message || 'Could not reach the server.')
    } finally {
      if (isLatest()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    /* Ignore whatever is still in flight when the provider goes away. */
    return () => {
      loadId.current += 1
    }
  }, [reload])

  /* Create answers with only an id, title and status, and update answers with
     just a message, so there is nothing to merge. Reload rather than guess. */
  async function addTask(values) {
    await createTaskRequest(values)
    await fetchTasks()
  }

  async function updateTask(id, values) {
    await updateTaskRequest(id, values)
    await fetchTasks()
  }

  /**
   * Status is the one write a student makes mid-scroll, so it lands on screen
   * straight away and rolls back if the server disagrees.
   */
  async function setTaskStatus(id, newStatus) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? applyStatus(t, newStatus) : t)))

    try {
      await updateTaskStatus(id, newStatus)
    } catch (err) {
      setTasks(previous)
      setError(err.message || 'Could not update that status.')
      throw err
    }
  }

  async function toggleDone(id) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await setTaskStatus(id, nextToggledStatus(task))
  }

  async function deleteTask(id) {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))

    try {
      await deleteTaskRequest(id)
    } catch (err) {
      setTasks(previous)
      setError(err.message || 'Could not delete that task.')
      throw err
    }
  }

  /**
   * Courses live here beside the tasks so every page reads the one list. The
   * API answers each write with the course itself, so the change is merged in
   * rather than reloaded. These throw on failure; the caller shows the reason.
   */
  async function addCourse(values) {
    const created = await createCourseRequest(values)
    setCourses((prev) => [...prev, created])
    return created
  }

  /**
   * Tasks carry a copy of their course's name, code and colour from the join,
   * so an edit is written into them too. Otherwise every task row would show
   * the old course until the next reload.
   */
  async function updateCourse(id, values) {
    const updated = await updateCourseRequest(id, values)

    /* The update response has no task counts, so keep the ones already held. */
    setCourses((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, ...updated } : c))
    )
    setTasks((prev) =>
      prev.map((t) =>
        String(t.courseId) === String(id)
          ? {
              ...t,
              courseName: updated.name,
              courseCode: updated.code,
              courseColor: courseColorValue(updated.color),
            }
          : t
      )
    )

    return updated
  }

  /* The API deletes a course's tasks along with it, so drop them here too, or
     they would linger on the dashboard, calendar and task lists. */
  async function deleteCourse(id) {
    await deleteCourseRequest(id)
    setCourses((prev) => prev.filter((c) => String(c.id) !== String(id)))
    setTasks((prev) => prev.filter((t) => String(t.courseId) !== String(id)))
  }

  function getTaskById(id) {
    return tasks.find((t) => String(t.id) === String(id)) ?? null
  }

  const completedCount = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const overdueCount = useMemo(() => tasks.filter(isTaskOverdue).length, [tasks])
  const percentDone = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  const value = {
    tasks,
    courses,
    loading,
    error,
    fetchTasks, // search, filter, sort
    reload, // after sign-in
    clearError: () => setError(''),
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    setTaskStatus,
    getTaskById,
    addCourse, // courses
    updateCourse,
    deleteCourse,
    completedCount, // statistics
    overdueCount,
    totalCount: tasks.length,
    percentDone,
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) {
    throw new Error('useTasks must be used inside a <TasksProvider>')
  }
  return ctx
}
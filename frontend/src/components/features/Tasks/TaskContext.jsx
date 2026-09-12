import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
  updateTaskStatus,
} from '../../../api/TaskApi'
import { getCourses } from '../../../api/CourseApi'
import { applyStatus, isTaskOverdue, nextToggledStatus } from './taskMeta'

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

      setTasks(taskList)
    } catch (err) {
      setError(err.message || 'Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const [taskList, courseList] = await Promise.all([getTasks(), getCourses()])
        if (cancelled) return
        setTasks(taskList)
        setCourses(courseList)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not reach the server.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

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
    clearError: () => setError(''),
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    setTaskStatus,
    getTaskById,
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
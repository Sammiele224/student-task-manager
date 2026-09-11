import { createContext, useContext, useMemo, useState } from 'react'
import taskData from '../../../data/tasks.json'
import courseData from '../../../data/course.json'
import { isTaskOverdue } from './taskMeta'

const TasksContext = createContext(null)

/** Copies the course name, code and colour onto a task so rows can show them. */
function withCourse(values, courses) {
  const course = courses.find((c) => c.id === Number(values.courseId))
  return {
    ...values,
    courseId: Number(values.courseId),
    courseName: course?.name ?? values.courseName ?? '',
    courseCode: course?.code ?? values.courseCode ?? '',
    courseColor: course?.color ?? values.courseColor ?? 'var(--accent)',
  }
}

/** Stamps or clears the completion time whenever the status moves. */
function withCompletion(task, status) {
  if (status === 'done') {
    return { ...task, status, completedAt: task.completedAt ?? new Date().toISOString() }
  }
  return { ...task, status, completedAt: null }
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(taskData.data)
  const [courses] = useState(courseData.data)

  function updateTask(id, values) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const merged = withCourse({ ...t, ...values }, courses)
        return withCompletion(merged, merged.status)
      })
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? withCompletion(t, t.status === 'done' ? 'todo' : 'done') : t))
    )
  }

  function setTaskStatus(id, newStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? withCompletion(t, newStatus) : t)))
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
    setTasks,
    updateTask,
    deleteTask,
    toggleDone,
    setTaskStatus,
    getTaskById,
    completedCount,
    overdueCount,
    totalCount: tasks.length,
    percentDone,
  }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) {
    throw new Error('useTasks must be used inside a <TasksProvider>')
  }
  return ctx
}

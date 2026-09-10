import { createContext, useContext, useMemo, useState } from 'react'
import taskData from '../../../data/tasks.json'

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(taskData.data)

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    )
  }

  function setTaskStatus(id, newStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  )
  const percentDone = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  const value = {
    tasks,
    setTasks,
    toggleDone,
    setTaskStatus,
    completedCount,
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
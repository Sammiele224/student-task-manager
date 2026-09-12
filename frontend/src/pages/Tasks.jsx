import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import TaskListPanel from '../components/features/Tasks/TaskListPanel'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

import '../styles/features/Task/Tasks.css'
import '../styles/features/Task/TaskForm.css'

const TASKS_PER_PAGE = 5

export default function Tasks() {
  const { tasks, courses, loading, error, clearError, updateTask, deleteTask, toggleDone, setTaskStatus } =
    useTasks()

  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const handleConfirmDelete = async () => {
    const id = taskToDelete.id
    setTaskToDelete(null)
    setEditingTask(null)
    try {
      await deleteTask(id)
    } catch {
      /* The context holds the reason and shows it above the list. */
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await setTaskStatus(id, status)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  const handleToggleDone = async (id) => {
    try {
      await toggleDone(id)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  return (
    <PageContainer className="tasks-page">
      <PageHeader
        eyebrow="One step at a time"
        title="Big plans. Small steps."
        subtitle="Everything you're working toward, all in one place."
        actions={<Button iconLeft={<Plus size={16} />}>New task</Button>}
      />

      {error && (
        <div className="tasks-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <TaskListPanel
        tasks={tasks}
        courses={courses}
        loading={loading}
        pageSize={TASKS_PER_PAGE}
        onToggleDone={handleToggleDone}
        onStatusChange={handleStatusChange}
        onEdit={setEditingTask}
      />

      <EditTaskModal
        open={Boolean(editingTask)}
        task={editingTask}
        courses={courses}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onDelete={setTaskToDelete}
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

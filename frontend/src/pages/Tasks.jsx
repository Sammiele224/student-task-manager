import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, LayoutGrid, Plus, Rows3, Search } from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import TaskRow from '../components/features/Tasks/TaskRow'
import TaskCard from '../components/features/Tasks/TaskCard'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  STATUS_VALUES,
  statusMeta,
} from '../components/features/Tasks/taskMeta'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

import '../styles/features/Task/Tasks.css'
import '../styles/features/Task/TaskForm.css'

const TASKS_PER_PAGE = 5

function Dropdown({ value, onChange, options, allLabel }) {
  return (
    <div className="tasks-dropdown">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={allLabel}>
        <option value="All">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" />
    </div>
  )
}

export default function Tasks() {
  const { tasks, courses, updateTask, deleteTask, toggleDone, setTaskStatus } = useTasks()

  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState('list')
  const [currentPage, setCurrentPage] = useState(1)

  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const courseOptions = useMemo(
    () => courses.map((c) => ({ value: String(c.id), label: `${c.code} · ${c.name}` })),
    [courses]
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return tasks
      .filter((t) => (course === 'All' ? true : String(t.courseId) === course))
      .filter((t) => (priority === 'All' ? true : t.priority === priority))
      .filter((t) => (status === 'All' ? true : t.status === status))
      .filter((t) => t.title.toLowerCase().includes(needle))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }, [tasks, course, priority, status, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / TASKS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [query, course, priority, status, view])

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * TASKS_PER_PAGE
    return filtered.slice(start, start + TASKS_PER_PAGE)
  }, [filtered, currentPage])

  const hasFilters = query.trim() || course !== 'All' || priority !== 'All' || status !== 'All'

  const handleConfirmDelete = () => {
    deleteTask(taskToDelete.id)
    setTaskToDelete(null)
    setEditingTask(null)
  }

  return (
    <PageContainer className="tasks-page">
      <PageHeader
        eyebrow="One step at a time"
        title="Big plans. Small steps."
        subtitle="Everything you're working toward, all in one place."
        actions={
          <Button iconLeft={<Plus size={16} />}>New task</Button>
        }
      />

      <div className="tasks-card">
        <div className="tasks-toolbar">
          <div className="tasks-search">
            <Search aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments..."
              aria-label="Search assignments"
            />
          </div>

          <Dropdown value={course} onChange={setCourse} options={courseOptions} allLabel="All courses" />
          <Dropdown value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} allLabel="All priorities" />
          <Dropdown value={status} onChange={setStatus} options={STATUS_OPTIONS} allLabel="All statuses" />

          <div className="tasks-view-toggle">
            <button
              type="button"
              onClick={() => setView('list')}
              className={view === 'list' ? 'active' : ''}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <Rows3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'active' : ''}
              aria-label="Board view"
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        <div className="tasks-meta">
          <span>
            {filtered.length} {filtered.length === 1 ? 'assignment' : 'assignments'}
          </span>
          <span>Soonest due first</span>
        </div>

        {view === 'grid' ? (
          <div className="tasks-board">
            {STATUS_VALUES.map((statusKey) => {
              const meta = statusMeta(statusKey)
              const columnTasks = filtered.filter((t) => t.status === statusKey)

              return (
                <div key={statusKey} className="tasks-board-column">
                  <div className="tasks-board-column-head">
                    <span className={`tasks-board-dot ${meta.cssClass}`} aria-hidden="true" />
                    <span className="tasks-board-column-title">{meta.label}</span>
                    <span className="tasks-board-count">{columnTasks.length}</span>
                  </div>

                  <div className="tasks-board-cards">
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onStatusChange={setTaskStatus} />
                    ))}

                    {columnTasks.length === 0 && <p className="tasks-board-empty">No tasks here.</p>}

                    <button type="button" className="tasks-board-add">
                      <Plus size={14} aria-hidden="true" />
                      Add a task
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <div className="tasks-row-head">
              <span>Assignment</span>
              <span>Due date</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            <div>
              {filtered.length === 0 && (
                <div className="tasks-empty">
                  <p className="tasks-empty-title">
                    {hasFilters ? 'Nothing matches those filters.' : 'No assignments yet.'}
                  </p>
                  <p className="tasks-empty-text">
                    {hasFilters
                      ? 'Try a different course, priority or status.'
                      : 'Add your first task and give the week some shape.'}
                  </p>
                </div>
              )}

              {paginatedTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleDone={toggleDone}
                  onStatusChange={setTaskStatus}
                  onEdit={setEditingTask}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="tasks-pagination">
                <button
                  type="button"
                  className="tasks-pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>

                <div className="tasks-page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`tasks-page-number ${currentPage === page ? 'active' : ''}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="tasks-pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

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

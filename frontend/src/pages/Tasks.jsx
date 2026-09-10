import { useMemo, useState, useEffect } from 'react'
import {
  Plus,
  Search,
  ChevronDown,
  Check,
  AlertTriangle,
  Rows3,
  LayoutGrid,
  Clock
} from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import TaskDetailDrawer from '../components/features/Tasks/TaskDetail'
import PagePlaceholder from './PagePlaceholder'
import { Button } from '../components/ui'

import '../styles/features/Task/Tasks.css'
import '../styles/features/Task/TasksDetail.css'

const PRIORITY_META = {
  low: { label: 'Low', cssClass: 'low' },
  medium: { label: 'Medium', cssClass: 'medium' },
  high: { label: 'High', cssClass: 'high' },
}

const STATUS_META = {
  todo: { label: 'To do', cssClass: 'todo' },
  in_progress: { label: 'In progress', cssClass: 'in-progress' },
  done: { label: 'Done', cssClass: 'done' },
}

const STATUS_VALUES = Object.keys(STATUS_META) // todo, in_progress, done
const PRIORITY_VALUES = Object.keys(PRIORITY_META) // low, medium, high


const TODAY = new Date()

function formatDue(dateStr) {
  const due = new Date(dateStr)
  const diffDays = Math.round((due.setHours(0, 0, 0, 0) - TODAY.setHours(0, 0, 0, 0)) / 86400000)

  if (diffDays === 0) return { label: 'Due today', overdue: false }
  if (diffDays === 1) return { label: 'Due tomorrow', overdue: false }
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true }

  const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { label, overdue: false }
}

function Dropdown({ value, onChange, options, allLabel }) {
  return (
    <div className="tasks-dropdown">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="All">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown />
    </div>
  )
}

export default function Tasks() {
  const { tasks, toggleDone, setTaskStatus } = useTasks()
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState('list')
  const [selectedTask, setSelectedTask] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const TASKS_PER_PAGE = 5

  // course options for dropdown
  const courseOptions = useMemo(() => {
    const unique = [...new Set(tasks.map((t) => t.courseCode))]
    return unique.map((code) => ({ value: code, label: code }))
  }, [tasks])

  const priorityOptions = PRIORITY_VALUES.map((v) => ({ value: v, label: PRIORITY_META[v].label }))
  const statusOptions = STATUS_VALUES.map((v) => ({ value: v, label: STATUS_META[v].label }))

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => (course === 'All' ? true : t.courseCode === course))
      .filter((t) => (priority === 'All' ? true : t.priority === priority))
      .filter((t) => (status === 'All' ? true : t.status === status))
      .filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }, [tasks, course, priority, status, query])

  // pagination
  const totalPages = Math.ceil(filtered.length / TASKS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [query, course, priority, status])

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE
    const endIndex = startIndex + TASKS_PER_PAGE

    return filtered.slice(startIndex, endIndex)
  }, [filtered, currentPage])

  return (
    <div className="tasks-page">
      {/* page header */}
      <PagePlaceholder
        eyebrow="One step at a time"
        title="Big plans. Small steps."
        subtitle="Everything you're working toward, all in one place."
        actions={<Button iconLeft={<Plus />}>New Task</Button>}
      />

      {/* task card */}
      <div className="tasks-card">
        {/* toolbar */}
        <div className="tasks-toolbar">
          <div className="tasks-search">
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments..."
            />
          </div>

          <Dropdown value={course} onChange={setCourse} options={courseOptions} allLabel="All courses" />
          <Dropdown value={priority} onChange={setPriority} options={priorityOptions} allLabel="All priorities" />
          <Dropdown value={status} onChange={setStatus} options={statusOptions} allLabel="All statuses" />

          <div className="tasks-view-toggle">
            <button
              onClick={() => setView('list')}
              className={view === 'list' ? 'active' : ''}
              aria-label="List view"
            >
              <Rows3 size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'active' : ''}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        <div className="tasks-meta">
          <span>{filtered.length} assignments</span>
          <span>Soonest due first</span>
        </div>

        {/* table header */}
        {view === 'grid' ? (
          <div className="tasks-board">
            {STATUS_VALUES.map((statusKey) => {
              const statusMeta = STATUS_META[statusKey]
              const columnTasks = filtered.filter((t) => t.status === statusKey)

              return (
                <div key={statusKey} className="tasks-board-column">
                  <div className="tasks-board-column-head">
                    <span className={`tasks-board-dot ${statusMeta.cssClass}`} />
                    <span className="tasks-board-column-title">{statusMeta.label}</span>
                    <span className="tasks-board-count">{columnTasks.length}</span>
                  </div>

                  <div className="tasks-board-cards">
                    {columnTasks.map((task) => {
                      const due = formatDue(task.dueDate)
                      const priorityMeta =
                        PRIORITY_META[task.priority] ?? { label: task.priority, cssClass: '' }

                      return (
                        <div key={task.id} className="tasks-board-card">
                          <div className="tasks-board-card-top">
                            <span className="tasks-board-card-course">
                              <span className="tasks-board-card-course-dot" />
                              {task.courseCode}
                            </span>
                            <span className={`tasks-priority ${priorityMeta.cssClass}`}>
                              {priorityMeta.label}
                            </span>
                          </div>

                          <p className="tasks-board-card-title"  
                             onClick={() => setSelectedTask(task)}>{task.title}</p>
                          {task.description && (
                            <p className="tasks-board-card-desc">{task.description}</p>
                          )}

                          <div className="tasks-board-card-footer">
                            <span className={`tasks-board-card-due ${due.overdue ? 'overdue' : ''}`}>
                              <Clock size={12} />
                              {due.label}
                            </span>

                            <div className={`tasks-status ${statusMeta.cssClass}`}>
                              <select
                                value={task.status}
                                onChange={(e) => setTaskStatus(task.id, e.target.value)}
                              >
                                {STATUS_VALUES.map((v) => (
                                  <option key={v} value={v}>
                                    {STATUS_META[v].label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown />
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {columnTasks.length === 0 && (
                      <p className="tasks-board-empty">No tasks here.</p>
                    )}

                    <button type="button" className="tasks-board-add">
                      <Plus size={14} />
                      Add a task
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <>
            {/* table header */}
            <div className="tasks-row-head">
              <span>Assignment</span>
              <span>Due date</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {/* rows */}
            <div>
              {filtered.length === 0 && (
                <p className="tasks-empty">No assignments match your filters.</p>
              )}

              {paginatedTasks.map((task) => {
                const due = formatDue(task.dueDate)
                const done = task.status === 'done'
                const priorityMeta = PRIORITY_META[task.priority] ?? { label: task.priority, cssClass: '' }
                const statusMeta = STATUS_META[task.status] ?? { label: task.status, cssClass: '' }

                return (
                  <div key={task.id} className={`tasks-row ${due.overdue ? 'overdue' : ''}`}
                  >
                    <div className="tasks-assignment">
                      <button
                        onClick={() => toggleDone(task.id)}
                        className={`tasks-checkbox ${done ? 'done' : ''}`}
                        aria-label={done ? 'Mark as not done' : 'Mark as done'}
                      >
                        {done && <Check strokeWidth={3} />}
                      </button>
                      <div>
                        <p className={`tasks-title-text ${done ? 'done' : ''}`} 
                           onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer' }}>{task.title}</p>
                        <p className="tasks-subtext">
                          {task.courseCode} · {task.courseName}
                        </p>
                      </div>
                    </div>

                    <div className={`tasks-due ${due.overdue ? 'overdue' : ''}`}>
                      {due.overdue && <AlertTriangle />}
                      {due.label}
                    </div>

                    <div>
                      <span className={`tasks-priority ${priorityMeta.cssClass}`}>
                        <span className={`tasks-priority-dot ${priorityMeta.cssClass}`} />
                        {priorityMeta.label}
                      </span>
                    </div>

                    <div className={`tasks-status ${statusMeta.cssClass}`}>
                      <select
                        value={task.status}
                        onChange={(e) => setTaskStatus(task.id, e.target.value)}
                      >
                        {STATUS_VALUES.map((v) => (
                          <option key={v} value={v}>
                            {STATUS_META[v].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="tasks-pagination">
                <button
                  className="tasks-pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>

                <div className="tasks-page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        className={`tasks-page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
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
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={(id, status) => {
          setTaskStatus(id, status)
          setSelectedTask((prev) => (prev ? { ...prev, status } : prev))
        }}
      />
    </div>
  )
}
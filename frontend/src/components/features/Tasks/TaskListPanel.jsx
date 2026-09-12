import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, LayoutGrid, Plus, Rows3, Search } from 'lucide-react'
import TaskRow from './TaskRow'
import TaskCard from './TaskCard'
import { PRIORITY_OPTIONS, STATUS_OPTIONS, statusMeta } from './taskMeta'

/**
 * The task card shared by the All tasks and Upcoming pages: search and filter
 * toolbar, the count line, then either the table of rows or the status board.
 *
 * The caller decides which tasks go in and how the empty state reads; filter
 * state lives here so neither page has to carry it.
 *
 * @param {Array}  tasks          already scoped by the page (Upcoming narrows them)
 * @param {Array}  courses        for the course dropdown
 * @param {number} pageSize       paginate at this many rows; omit for one long list
 * @param {Array}  statusOptions  which statuses the dropdown and board offer
 * @param {string} emptyTitle     headline when nothing is in scope at all
 * @param {string} emptyText      supporting line under it
 */

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

export default function TaskListPanel({
  tasks,
  courses,
  loading = false,
  pageSize,
  statusOptions = STATUS_OPTIONS,
  emptyTitle = 'No assignments yet.',
  emptyText = 'Add your first task and give the week some shape.',
  onToggleDone,
  onStatusChange,
  onEdit,
}) {
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [priority, setPriority] = useState('All')
  const [status, setStatus] = useState('All')
  const [view, setView] = useState('list')
  const [currentPage, setCurrentPage] = useState(1)

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

  const paginated = Boolean(pageSize)
  const totalPages = paginated ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1

  useEffect(() => {
    setCurrentPage(1)
  }, [query, course, priority, status, view])

  /* Filtering can strand the reader past the last page. Clamp rather than
     reset, so deleting a row does not throw them back to page one. */
  const page = Math.min(currentPage, totalPages)

  const visibleTasks = useMemo(() => {
    if (!paginated) return filtered
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize, paginated])

  const hasFilters = query.trim() || course !== 'All' || priority !== 'All' || status !== 'All'

  return (
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
        <Dropdown value={status} onChange={setStatus} options={statusOptions} allLabel="All statuses" />

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
        <div
          className="tasks-board"
          /* One column per status the page offers, set here rather than in the
             stylesheet so Upcoming can drop its Done column on its own. */
          style={{ gridTemplateColumns: `repeat(${statusOptions.length}, minmax(0, 1fr))` }}
        >
          {statusOptions.map(({ value: statusKey }) => {
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
                    <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
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
            {loading && <p className="tasks-loading">Loading your assignments…</p>}

            {!loading && filtered.length === 0 && (
              <div className="tasks-empty">
                <p className="tasks-empty-title">
                  {hasFilters ? 'Nothing matches those filters.' : emptyTitle}
                </p>
                <p className="tasks-empty-text">
                  {hasFilters ? 'Try a different course, priority or status.' : emptyText}
                </p>
              </div>
            )}

            {!loading &&
              visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleDone={onToggleDone}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                />
              ))}
          </div>

          {paginated && totalPages > 1 && (
            <div className="tasks-pagination">
              <button
                type="button"
                className="tasks-pagination-btn"
                disabled={page === 1}
                onClick={() => setCurrentPage(page - 1)}
              >
                Previous
              </button>

              <div className="tasks-page-numbers">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    className={`tasks-page-number ${page === number ? 'active' : ''}`}
                    aria-current={page === number ? 'page' : undefined}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="tasks-pagination-btn"
                disabled={page === totalPages}
                onClick={() => setCurrentPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

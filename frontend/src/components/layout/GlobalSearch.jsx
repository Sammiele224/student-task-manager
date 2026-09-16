import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ListChecks, Search } from 'lucide-react'
import { useTasks } from '../features/Tasks/TaskContext'
import { useClickOutside } from '../../hooks/useClickOutside'
import './GlobalSearch.css'

/* Enough to be useful without the panel becoming a second task list. */
const MAX_PER_GROUP = 5

/**
 * The topbar search. Looks across courses and assignments at once and jumps
 * straight to whichever one is picked.
 *
 * Both live in the task context already, so this reads what the app has rather
 * than asking the API on every keystroke.
 */
export default function GlobalSearch() {
  const { tasks, courses } = useTasks()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const inputRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  const wrapRef = useClickOutside(close, open)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []

    /* A course matches on either half of how it is written down: students
       search "CS301" as readily as "Software Engineering". */
    const courseHits = courses
      .filter(
        (c) =>
          c.name.toLowerCase().includes(needle) || c.code.toLowerCase().includes(needle)
      )
      .slice(0, MAX_PER_GROUP)
      .map((c) => ({
        key: `course-${c.id}`,
        kind: 'course',
        label: c.name,
        hint: c.code,
        to: `/courses/${c.id}`,
      }))

    /* Matching a task on its course too means "CS301" finds the course and
       everything due for it in one search. */
    const taskHits = tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(needle) ||
          (t.courseCode ?? '').toLowerCase().includes(needle) ||
          (t.courseName ?? '').toLowerCase().includes(needle)
      )
      .slice(0, MAX_PER_GROUP)
      .map((t) => ({
        key: `task-${t.id}`,
        kind: 'task',
        label: t.title,
        hint: t.courseCode ?? 'No course',
        to: `/tasks/${t.id}`,
      }))

    return [...courseHits, ...taskHits]
  }, [query, courses, tasks])

  /* A shorter list can leave the highlight past the end. */
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  /* "/" focuses search from anywhere, the shortcut the topbar advertises.
     Ignored while typing, or it would swallow the character. */
  useEffect(() => {
    function handleKey(e) {
      if (e.key !== '/') return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      e.preventDefault()
      inputRef.current?.focus()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function go(result) {
    setQuery('')
    setOpen(false)
    navigate(result.to)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }

    if (!results.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[activeIndex])
    }
  }

  const showPanel = open && query.trim().length > 0
  const courseHits = results.filter((r) => r.kind === 'course')
  const taskHits = results.filter((r) => r.kind === 'task')

  function renderGroup(title, items) {
    if (!items.length) return null

    return (
      <li className="global-search__group" role="presentation">
        <p className="global-search__group-title">{title}</p>
        <ul role="presentation">
          {items.map((result) => {
            const index = results.indexOf(result)
            return (
              <li key={result.key} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`global-search__result ${index === activeIndex ? 'is-active' : ''}`}
                  /* mousedown, not click: the input's blur would close the
                     panel before a click ever landed. */
                  onMouseDown={(e) => {
                    e.preventDefault()
                    go(result)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {result.kind === 'course' ? (
                    <BookOpen size={15} aria-hidden="true" />
                  ) : (
                    <ListChecks size={15} aria-hidden="true" />
                  )}
                  <span className="global-search__result-label">{result.label}</span>
                  <span className="global-search__result-hint">{result.hint}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </li>
    )
  }

  return (
    <div className="global-search" ref={wrapRef}>
      <div className="global-search__control">
        <Search size={16} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Find a course or assignment..."
          aria-label="Find a course or assignment"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          role="combobox"
          autoComplete="off"
        />
        <kbd className="global-search__kbd" aria-hidden="true">
          /
        </kbd>
      </div>

      {showPanel && (
        <ul className="global-search__panel" id="global-search-results" role="listbox">
          {results.length === 0 ? (
            <li className="global-search__empty">Nothing matches “{query.trim()}”.</li>
          ) : (
            <>
              {renderGroup('Courses', courseHits)}
              {renderGroup('Assignments', taskHits)}
            </>
          )}
        </ul>
      )}
    </div>
  )
}

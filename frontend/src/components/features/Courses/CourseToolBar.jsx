import { useCallback, useState } from 'react'
import { BookOpen, Check, ChevronDown } from 'lucide-react'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { ALL_SEMESTERS } from './courseSemester'

/**
 * The line above the course grid: how many courses are in view, and which
 * semester they are being read through.
 *
 * @param {number} count     courses currently shown
 * @param {Array}  semesters `{ key, label }` for every term that has a course
 * @param {string} value     selected key, or ALL_SEMESTERS
 */
export function CoursesToolbar({ count, semesters = [], value = ALL_SEMESTERS, onChange }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const menuRef = useClickOutside(close, open)

  const selected = semesters.find((s) => s.key === value)
  const label = selected ? selected.label : 'All semesters'

  const choose = (key) => {
    onChange?.(key)
    setOpen(false)
  }

  return (
    <div className="courses-toolbar">
      <span className="courses-toolbar__count">
        {count} {count === 1 ? 'course' : 'courses'} in your workspace
      </span>

      <div className="courses-toolbar__semester-wrap" ref={menuRef}>
        <button
          type="button"
          className="courses-toolbar__semester"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <BookOpen size={14} aria-hidden="true" />
          {label}
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        {open && (
          <ul className="courses-toolbar__menu" role="listbox" aria-label="Semester">
            <SemesterOption
              label="All semesters"
              selected={value === ALL_SEMESTERS}
              onSelect={() => choose(ALL_SEMESTERS)}
            />

            {semesters.map((semester) => (
              <SemesterOption
                key={semester.key}
                label={semester.label}
                selected={value === semester.key}
                onSelect={() => choose(semester.key)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function SemesterOption({ label, selected, onSelect }) {
  return (
    <li role="none">
      <button
        type="button"
        role="option"
        aria-selected={selected}
        className={`courses-toolbar__option ${selected ? 'is-selected' : ''}`}
        onClick={onSelect}
      >
        <span>{label}</span>
        {/* The tick holds its column either way, so labels stay aligned. */}
        <Check size={14} aria-hidden="true" className="courses-toolbar__tick" />
      </button>
    </li>
  )
}

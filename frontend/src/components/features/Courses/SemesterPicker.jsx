import { useCallback, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Leaf } from 'lucide-react'
import { useClickOutside } from '../../../hooks/useClickOutside'
import {
  ALL_SEMESTERS,
  TERMS,
  currentSemester,
  semesterKey,
  semesterLabelFor,
  semestersInUse,
} from './courseSemester'

/**
 * Picks a semester the way a date field picks a date: step the year, then
 * choose the term. A semester is only ever those two parts, so there is no
 * long list to scroll — any year works, including one no course sits in yet.
 *
 * @param {string} value    selected key ("2026-fall") or ALL_SEMESTERS
 * @param {Array}  courses  used only to mark which terms actually hold a course
 */
export default function SemesterPicker({ value, courses = [], onChange }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const pickerRef = useClickOutside(close, open)

  const today = currentSemester()

  /* The year on show follows the selection, and falls back to this one while
     "All semesters" is picked. */
  const selectedYear =
    value && value !== ALL_SEMESTERS ? Number(value.split('-')[0]) : today.year
  const selectedTerm = value && value !== ALL_SEMESTERS ? value.split('-')[1] : null

  const [year, setYear] = useState(selectedYear)

  const inUse = semestersInUse(courses)
  const label =
    value && value !== ALL_SEMESTERS
      ? semesterLabelFor(selectedYear, selectedTerm)
      : 'All semesters'

  const choose = (key) => {
    onChange?.(key)
    setOpen(false)
  }

  return (
    <div className="semester-picker" ref={pickerRef}>
      <button
        type="button"
        className="semester-picker__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          /* Reopen on the selected year rather than wherever it was left. */
          setYear(selectedYear)
          setOpen((v) => !v)
        }}
      >
        <Leaf size={14} aria-hidden="true" />
        {label}
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div className="semester-picker__panel" role="dialog" aria-label="Choose a semester">
          <div className="semester-picker__year">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              aria-label={`Go to ${year - 1}`}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <span className="semester-picker__year-value">{year}</span>

            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              aria-label={`Go to ${year + 1}`}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="semester-picker__terms">
            {TERMS.map((term) => {
              const key = semesterKey(year, term.id)
              const isSelected = value === key
              const isNow = today.year === year && today.term === term.id

              return (
                <button
                  key={term.id}
                  type="button"
                  className={`semester-picker__term ${isSelected ? 'is-selected' : ''} ${
                    isNow ? 'is-now' : ''
                  }`.trim()}
                  aria-pressed={isSelected}
                  onClick={() => choose(key)}
                >
                  {term.label}
                  {/* A quiet mark on terms that actually hold a course, so an
                      empty pick is visibly an empty pick before it is made. */}
                  {inUse.has(key) && <span className="semester-picker__dot" aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className={`semester-picker__all ${value === ALL_SEMESTERS ? 'is-selected' : ''}`.trim()}
            onClick={() => choose(ALL_SEMESTERS)}
          >
            All semesters
          </button>
        </div>
      )}
    </div>
  )
}

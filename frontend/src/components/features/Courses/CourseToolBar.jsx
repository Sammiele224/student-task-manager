import SemesterPicker from './SemesterPicker'
import { ALL_SEMESTERS } from './courseSemester'
import './SemesterPicker.css'

/**
 * The line above the course grid: how many courses are in view, and which
 * semester they are being read through.
 *
 * @param {number} count    courses currently shown
 * @param {Array}  courses  all of them, so the picker can mark the terms in use
 * @param {string} value    selected key, or ALL_SEMESTERS
 */
export function CoursesToolbar({ count, courses = [], value = ALL_SEMESTERS, onChange }) {
  return (
    <div className="courses-toolbar">
      <span className="courses-toolbar__count">
        {count} {count === 1 ? 'course' : 'courses'} in your workspace
      </span>

      <SemesterPicker value={value} courses={courses} onChange={onChange} />
    </div>
  )
}

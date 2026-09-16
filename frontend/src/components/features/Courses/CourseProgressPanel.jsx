import { CheckCircle2, CircleDot, TriangleAlert } from 'lucide-react'

/**
 * The summary that sits above a course's task list: how far through the work
 * the student is, and how that work breaks down.
 *
 * The percentage and the three counts come from the same task array the list
 * below renders, so the summary can never disagree with what is on screen.
 *
 * @param {number} done     finished tasks
 * @param {number} active   started or not yet started
 * @param {number} overdue  past due and not done — a subset of `active`
 * @param {string} color    the course's colour, for the bar
 */
export default function CourseProgressPanel({ done, active, overdue, color }) {
  const total = done + active
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  /* A course with no tasks yet has nothing to be a percentage of, so it gets a
     prompt rather than a bar sitting at zero. */
  if (total === 0) {
    return (
      <div className="course-progress" style={{ '--course-color': color }}>
        <p className="course-progress__empty">
          No assignments in this course yet. Add one and it will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="course-progress" style={{ '--course-color': color }}>
      <div className="course-progress__head">
        <div>
          <span className="u-eyebrow">Where you stand</span>
          <p className="course-progress__headline">
            {done} of {total} {total === 1 ? 'assignment' : 'assignments'} complete
          </p>
        </div>
        <span className="course-progress__percent">{percent}%</span>
      </div>

      <div className="course-progress__track">
        <div className="course-progress__fill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="course-progress__stats">
        <li className="course-progress__stat">
          <CheckCircle2 size={15} aria-hidden="true" />
          <span className="course-progress__stat-value">{done}</span>
          <span className="course-progress__stat-label">complete</span>
        </li>

        <li className="course-progress__stat">
          <CircleDot size={15} aria-hidden="true" />
          <span className="course-progress__stat-value">{active}</span>
          <span className="course-progress__stat-label">still open</span>
        </li>

        {/* Overdue is part of the open count, so it only earns a slot when
            there is something late to point at. */}
        {overdue > 0 && (
          <li className="course-progress__stat course-progress__stat--overdue">
            <TriangleAlert size={15} aria-hidden="true" />
            <span className="course-progress__stat-value">{overdue}</span>
            <span className="course-progress__stat-label">overdue</span>
          </li>
        )}
      </ul>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import TaskDateItem from '../Tasks/TaskDateItem'
import { toDayKey } from '../Calendar/calendarGrid'
import { isoWeekNumber, monthAndYear, weekStrip } from './overviewDates'

import '../../../styles/features/Task/TaskDateItem.css'

/**
 * The week at a glance: seven days with a dot under any that still owes work,
 * then the next few deadlines.
 *
 * Each day links into the calendar on that date, so the strip is a way in
 * rather than a picture.
 */
export default function WeekPanel({ tasks, coming }) {
  const days = weekStrip()

  /* A dot means unfinished work, so a day whose tasks are all done stays clear. */
  const openByDay = new Set(
    tasks.filter((t) => t.status !== 'done' && t.dueDate).map((t) => toDayKey(t.dueDate))
  )

  return (
    <section className="week-panel">
      <header className="week-panel-head">
        <h2 className="week-panel-title u-display">Your week</h2>
        <Link to="/calendar" className="week-panel-open" aria-label="Open the calendar">
          <ExternalLink size={16} aria-hidden="true" />
        </Link>
      </header>

      <div className="week-panel-caption">
        <span>{monthAndYear()}</span>
        <span className="week-panel-number">Week {isoWeekNumber()}</span>
      </div>

      <div className="week-strip">
        {days.map((day) => (
          <Link
            key={day.key}
            to={`/calendar?date=${day.key}`}
            className={`week-day ${day.isToday ? 'is-today' : ''}`}
          >
            <span className="week-day-initial" aria-hidden="true">
              {day.initial}
            </span>
            <span className="week-day-number">{day.dayOfMonth}</span>
            <span
              className={`week-day-dot ${openByDay.has(day.key) ? 'is-on' : ''}`}
              aria-hidden="true"
            />
            <span className="u-sr-only">
              {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {openByDay.has(day.key) ? ', has work due' : ''}
            </span>
          </Link>
        ))}
      </div>

      <p className="week-panel-label u-eyebrow">Coming up</p>

      {coming.length === 0 ? (
        <p className="week-panel-empty">Nothing due in the days ahead.</p>
      ) : (
        <ul className="week-panel-list">
          {coming.map((task) => (
            <TaskDateItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, IconButton } from '../../ui'
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  isSameDay,
  monthLabel,
} from './calendarGrid'

/** How many chips a square shows before it collapses the rest into a count. */
const CHIPS_PER_DAY = 3

/**
 * The month card: title and navigation, the weekday row, six weeks of day
 * squares, and a legend of the courses that appear in the month.
 *
 * A square is one button. Clicking anywhere in it — including a task chip —
 * loads that day into the daily view beside the grid.
 */
export default function MonthGrid({
  month,
  selectedDay,
  today,
  tasksByDay,
  onSelectDay,
  onMonthChange,
  onToday,
}) {
  const weeks = buildMonthGrid(month)

  /* Only the courses with work this month, so the legend explains the colours
     actually on screen rather than listing every course a student has. */
  const legend = []
  const seen = new Set()
  for (const week of weeks) {
    for (const cell of week) {
      if (!cell.inMonth) continue
      for (const task of tasksByDay.get(cell.key) ?? []) {
        if (seen.has(task.courseCode)) continue
        seen.add(task.courseCode)
        legend.push(task)
      }
    }
  }

  return (
    <section className="calendar-month">
      <header className="calendar-month-head">
        <h2 className="calendar-month-title u-display">{monthLabel(month)}</h2>

        <div className="calendar-month-nav">
          <Button variant="secondary" size="sm" onClick={onToday}>
            Today
          </Button>
          <IconButton label="Previous month" onClick={() => onMonthChange(-1)}>
            <ChevronLeft aria-hidden="true" />
          </IconButton>
          <IconButton label="Next month" onClick={() => onMonthChange(1)}>
            <ChevronRight aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {weeks.map((week) =>
          week.map((cell) => {
            const dayTasks = tasksByDay.get(cell.key) ?? []
            const shown = dayTasks.slice(0, CHIPS_PER_DAY)
            const hidden = dayTasks.length - shown.length
            const isToday = isSameDay(cell.date, today)
            const isSelected = isSameDay(cell.date, selectedDay)

            const classes = [
              'calendar-day',
              !cell.inMonth && 'is-outside',
              isSelected && 'is-selected',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={cell.key}
                type="button"
                className={classes}
                aria-pressed={isSelected}
                aria-label={`${cell.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })} — ${dayTasks.length} ${dayTasks.length === 1 ? 'assignment' : 'assignments'}`}
                onClick={() => onSelectDay(cell.date)}
              >
                <span className={`calendar-day-number ${isToday ? 'is-today' : ''}`}>
                  {cell.dayOfMonth}
                </span>

                <span className="calendar-day-chips">
                  {shown.map((task) => (
                    <span
                      key={task.id}
                      className={`calendar-chip ${task.status === 'done' ? 'is-done' : ''}`}
                      style={{ '--course-color': task.courseColor }}
                      title={`${task.title} · ${task.courseCode}`}
                    >
                      {task.title}
                    </span>
                  ))}

                  {hidden > 0 && <span className="calendar-day-more">+{hidden} more</span>}
                </span>

                {/* Narrow screens drop the chips and mark a busy day with dots. */}
                <span className="calendar-day-dots" aria-hidden="true">
                  {shown.map((task) => (
                    <span
                      key={task.id}
                      className="calendar-day-dot"
                      style={{ '--course-color': task.courseColor }}
                    />
                  ))}
                </span>
              </button>
            )
          })
        )}
      </div>

      {legend.length > 0 && (
        <footer className="calendar-legend">
          {legend.map((task) => (
            <span key={task.courseCode} className="calendar-legend-item">
              <span
                className="calendar-legend-dot"
                style={{ '--course-color': task.courseColor }}
                aria-hidden="true"
              />
              {task.courseCode}
            </span>
          ))}
        </footer>
      )}
    </section>
  )
}

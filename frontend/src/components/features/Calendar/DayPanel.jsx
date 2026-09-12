import { Plus, Sun } from 'lucide-react'
import { Button } from '../../ui'
import TaskDateItem from '../Tasks/TaskDateItem'
import { dayHeading } from './calendarGrid'

import '../../../styles/features/Task/TaskDateItem.css'

/**
 * The daily view beside the grid: everything due on the selected day, with a
 * calm empty state for a day that asks nothing of you.
 */
export default function DayPanel({ day, tasks, onAdd }) {
  const heading = dayHeading(day)

  return (
    <aside className="calendar-day-panel">
      <span className="u-eyebrow">Your daily view</span>

      <h2 className="calendar-panel-weekday u-display">{heading.weekday}</h2>
      <p className="calendar-panel-date">{heading.date}</p>

      <p className="calendar-panel-count">
        {tasks.length} {tasks.length === 1 ? 'assignment' : 'assignments'} on the calendar
      </p>

      {tasks.length === 0 ? (
        <div className="calendar-panel-empty">
          <Sun aria-hidden="true" />
          <p className="calendar-panel-empty-title u-display">A little space to breathe.</p>
          <p className="calendar-panel-empty-text">No assignments due on this day.</p>
        </div>
      ) : (
        <ul className="calendar-panel-list">
          {tasks.map((task) => (
            <TaskDateItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      <Button variant="secondary" fullWidth iconLeft={<Plus size={16} />} onClick={onAdd}>
        Add an assignment
      </Button>
    </aside>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import { CreateTaskModal } from '../components/features/Tasks/CreateTaskModal'
import MonthGrid from '../components/features/Calendar/MonthGrid'
import DayPanel from '../components/features/Calendar/DayPanel'
import {
  addMonths,
  groupTasksByDay,
  startOfMonth,
  startOfToday,
  toDayKey,
} from '../components/features/Calendar/calendarGrid'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

/* Tasks.css carries the shared error banner, the same way Upcoming pulls it.
   The add-task dialog needs both form sheets: CourseForm.css holds the modal
   shell and the base field styles despite its name, TaskForm.css the rest. */
import '../styles/features/Task/Tasks.css'
import '../styles/features/Course/CourseForm.css'
import '../styles/features/Task/TaskForm.css'
import '../styles/features/Calendar/Calendar.css'

export default function Calendar() {
  const { tasks, courses, loading, error, clearError, addTask } = useTasks()

  const today = useMemo(() => startOfToday(), [])

  /* ?date=YYYY-MM-DD opens on that day, which is how the dashboard's week
     strip links in. Anything unparseable falls back to today. */
  const [searchParams] = useSearchParams()
  const requestedDay = useMemo(() => {
    const raw = searchParams.get('date')
    if (!raw) return null
    const parsed = new Date(`${raw}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }, [searchParams])

  const [selectedDay, setSelectedDay] = useState(requestedDay ?? today)
  const [month, setMonth] = useState(() => startOfMonth(requestedDay ?? today))

  /* Arriving at a new ?date while already on this page has to move the grid;
     the initial state above only runs on mount. */
  useEffect(() => {
    if (!requestedDay) return
    setSelectedDay(requestedDay)
    setMonth(startOfMonth(requestedDay))
  }, [requestedDay])
  const [creatingFor, setCreatingFor] = useState(null)

  /* The API has no date-range query, so the month is cut from the task list
     the context already holds. Paging months costs nothing. */
  const tasksByDay = useMemo(() => groupTasksByDay(tasks), [tasks])
  const selectedTasks = tasksByDay.get(toDayKey(selectedDay)) ?? []

  /* Picking a leading or trailing square moves the month with it, so the
     chosen day is always visible in the grid. */
  const handleSelectDay = (day) => {
    setSelectedDay(day)
    setMonth(startOfMonth(day))
  }

  const handleToday = () => {
    setSelectedDay(today)
    setMonth(startOfMonth(today))
  }

  /* Opening from the day panel carries that day into the form. The API refuses
     a due date in the past, so a day already gone prefills nothing rather than
     handing the student a date the server will bounce. */
  const openCreate = (day) => {
    setCreatingFor(day && day >= today ? day : '')
  }

  /* Land on the day the new task was given, so it is on screen the moment the
     dialog closes rather than somewhere the reader has to go looking. */
  const handleCreate = async (values) => {
    await addTask(values)
    /* The date input speaks YYYY-MM-DD; the time makes it parse as local. */
    handleSelectDay(new Date(`${values.dueDate}T00:00:00`))
  }

  return (
    <PageContainer className="calendar-page">
      <PageHeader
        eyebrow="See the bigger picture"
        title="Space for what's ahead."
        subtitle="A month of possibilities. Every deadline in its place."
        actions={
          <Button iconLeft={<Plus size={16} />} onClick={() => openCreate(selectedDay)}>
            New task
          </Button>
        }
      />

      {error && (
        <div className="tasks-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <div className="calendar-layout">
        <MonthGrid
          month={month}
          selectedDay={selectedDay}
          today={today}
          tasksByDay={tasksByDay}
          onSelectDay={handleSelectDay}
          onMonthChange={(step) => setMonth((prev) => addMonths(prev, step))}
          onToday={handleToday}
        />

        <DayPanel
          day={selectedDay}
          tasks={loading ? [] : selectedTasks}
          onAdd={() => openCreate(selectedDay)}
        />
      </div>

      <CreateTaskModal
        open={creatingFor !== null}
        courses={courses}
        dueDate={creatingFor || ''}
        onClose={() => setCreatingFor(null)}
        onCreate={handleCreate}
      />
    </PageContainer>
  )
}

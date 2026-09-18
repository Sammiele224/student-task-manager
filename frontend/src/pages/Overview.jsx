import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Clock,
  ListChecks,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import { CourseCard } from '../components/features/Courses/CourseCard'
import TaskRow from '../components/features/Tasks/TaskRow'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { CreateTaskModal } from '../components/features/Tasks/CreateTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import {
  getCourseProgress,
  getDashboardStats,
  getFocusTasks,
  getUpcomingTasks,
  isOnHorizon,
} from '../components/features/Tasks/taskStats'
import HeroPanel from '../components/features/Overview/HeroPanel'
import StatCard from '../components/features/Overview/StatCard'
import WeekPanel from '../components/features/Overview/WeekPanel'
import FocusPanel from '../components/features/Overview/FocusPanel'
import { greetingDate } from '../components/features/Overview/overviewDates'
import SemesterPicker from '../components/features/Courses/SemesterPicker'
import {
  ALL_SEMESTERS,
  filterBySemester,
  filterTasksBySemester,
} from '../components/features/Courses/courseSemester'
import '../components/features/Courses/SemesterPicker.css'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

import '../styles/features/Task/Tasks.css'
/* CourseForm.css holds the modal shell and base field styles despite its name. */
import '../styles/features/Course/CourseForm.css'
import '../styles/features/Task/TaskForm.css'
import '../styles/features/Course/Course.css'
import '../styles/overview.css'

/* The student's name is hardcoded in the sidebar too; there is no account yet. */
const user = JSON.parse(localStorage.getItem('user'))
const STUDENT_FIRST_NAME = user?.name || ''

const COURSES_ON_DASHBOARD = 3

/** One line a day, so the dashboard does not say the same thing every morning. */
const REMINDERS = [
  'The secret of getting ahead is getting started.',
  'Small steps, taken often, go a surprising distance.',
  'You do not have to finish it today. You do have to begin.',
  'Done is kinder to you than perfect.',
  'An hour of attention beats a day of worry.',
  'Start with the one you have been avoiding.',
  'Progress is quiet. Trust it anyway.',
]

function reminderForToday(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  return REMINDERS[dayOfYear % REMINDERS.length]
}

export default function Overview() {
  /* Every figure below is derived from the shared task list, so marking a task
     done anywhere in the app moves these numbers straight away. */
  const { tasks, courses, loading, error, clearError, addTask, updateTask, deleteTask, toggleDone, setTaskStatus } =
    useTasks()

  const [creating, setCreating] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [semester, setSemester] = useState(ALL_SEMESTERS)

  /* The picker in the header scopes the course list below it. The task figures
     stay whole-workspace: they answer "how am I doing", not "this term". */
  const semesterCourses = useMemo(
    () => filterBySemester(courses, semester),
    [courses, semester]
  )

  const semesterTasks = useMemo(
    () => filterTasksBySemester(tasks, courses, semester),
    [tasks, courses, semester]
  )

  const stats = getDashboardStats(semesterTasks)

  const courseProgress = useMemo(
    () => getCourseProgress(semesterTasks),
    [semesterTasks]
  )

  const navigate = useNavigate()

  const focusTasks = useMemo(
    () => getFocusTasks(semesterTasks),
    [semesterTasks]
  )

  const comingUp = useMemo(
    () => getUpcomingTasks(semesterTasks, 3),
    [semesterTasks]
  )

  const nextTask = comingUp[0] ?? null

  const horizonCount = useMemo(
    () => semesterTasks.filter(isOnHorizon).length,
    [semesterTasks]
  )

  const handleConfirmDelete = async () => {
    const id = taskToDelete.id
    setTaskToDelete(null)
    setEditingTask(null)
    try {
      await deleteTask(id)
    } catch {
      /* The context holds the reason and shows it above the page. */
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await setTaskStatus(id, status)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  const handleToggleDone = async (id) => {
    try {
      await toggleDone(id)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  return (
    <PageContainer className="overview-page">
      <PageHeader
        eyebrow={greetingDate()}
        title={
          <>
            Good to see you, {STUDENT_FIRST_NAME}
            <span className="overview-stop">.</span>
          </>
        }
        subtitle="Let's make a little room for what matters."
        actions={
          <SemesterPicker
            value={semester}
            courses={courses}
            onChange={setSemester}
          />
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

      <HeroPanel nextTask={nextTask} />

      <section className="stat-row">
        <StatCard
          label="Total tasks"
          icon={<ListChecks size={16} />}
          value={stats.totalTasks}
          footnote={`${courses.length} ${courses.length === 1 ? 'course' : 'courses'}, one clear view`}
        />
        <StatCard
          label="Due this week"
          icon={<CalendarDays size={16} />}
          value={horizonCount}
          footnote="Your next 7 days, at a glance"
        />
        <StatCard
          label="Overdue"
          icon={<Clock size={16} />}
          value={stats.overdueCount}
          tone={stats.overdueCount > 0 ? 'danger' : undefined}
          footnote={stats.overdueCount > 0 ? 'A little attention needed' : 'Nothing running late'}
        />
        <StatCard
          label="Completion rate"
          icon={<TrendingUp size={16} />}
          value={stats.completionRate}
          suffix="%"
          progress={stats.completionRate}
          footnote={`${stats.completedCount} of ${stats.totalTasks} tasks completed`}
        />
      </section>

      <div className="overview-columns">
        <div className="overview-main">
          <section className="overview-block">
            <header className="overview-block-head">
              <h2 className="overview-block-title u-display">
                My courses
                <span className="overview-count">{semesterCourses.length}</span>
              </h2>
              <Link to="/courses" className="overview-link">
                View all courses
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </header>

            {semesterCourses.length === 0 ? (
              <p className="overview-empty">
                {loading
                  ? 'Loading your courses…'
                  : courses.length === 0
                    ? 'No courses yet. Add one to get started.'
                    : 'No courses in this semester.'}
              </p>
            ) : (
              <div className="overview-courses">
                {semesterCourses.slice(0, COURSES_ON_DASHBOARD).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={courseProgress.get(course.id)}
                    onOpen={() => navigate(`/courses/${course.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="overview-block">
            <header className="overview-block-head">
              <div>
                <h2 className="overview-block-title u-display">A little focus for today</h2>
                <p className="overview-block-sub">The next steps that deserve your attention.</p>
              </div>
              <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
                New task
              </Button>
            </header>

            <div className="tasks-card">
              <div className="tasks-row-head">
                <span>Assignment</span>
                <span>Due date</span>
                <span>Priority</span>
                <span>Status</span>
              </div>

              {loading && <p className="tasks-loading">Loading your assignments…</p>}

              {!loading && focusTasks.length === 0 && (
                <div className="tasks-empty">
                  <p className="tasks-empty-title">Nothing needs you right now.</p>
                  <p className="tasks-empty-text">Every deadline is behind you. Enjoy the quiet.</p>
                </div>
              )}

              {!loading &&
                focusTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggleDone={handleToggleDone}
                    onStatusChange={handleStatusChange}
                    onEdit={setEditingTask}
                  />
                ))}
            </div>

            <Link to="/upcoming" className="overview-link overview-link--centred">
              See everything that&apos;s coming up
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </section>
        </div>

        <aside className="overview-side">
          <WeekPanel tasks={semesterTasks} coming={comingUp} />
          <FocusPanel />

          <figure className="overview-reminder">
            <Sparkles size={16} aria-hidden="true" />
            <blockquote className="overview-reminder-text">“{reminderForToday()}”</blockquote>
            <figcaption className="u-eyebrow">A small reminder for today</figcaption>
          </figure>
        </aside>
      </div>

      <CreateTaskModal
        open={creating}
        courses={courses}
        onClose={() => setCreating(false)}
        onCreate={addTask}
      />

      <EditTaskModal
        open={Boolean(editingTask)}
        task={editingTask}
        courses={courses}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onDelete={setTaskToDelete}
      />

      <TaskMessageDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        message={`“${taskToDelete?.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete task"
        tone="danger"
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  )
}

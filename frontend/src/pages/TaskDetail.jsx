import { useParams } from 'react-router-dom'
import PagePlaceholder from './PagePlaceholder'

/** Task detail / edit view — Ngọc, Day 4. Route: /tasks/:id */
export default function TaskDetail() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      eyebrow={`Assignment #${id}`}
      title="One task, in full."
      subtitle="Everything about this assignment, and the controls to change it."
      stories={[
        'US-07 — Edit a task (due date, priority, course, description)',
        'US-08 — Delete a task, with a confirmation dialog',
        'US-09 — Move the task through to do / in progress / done',
        'Fetch: GET /api/tasks/:id',
      ]}
    />
  )
}

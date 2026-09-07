import { Plus } from 'lucide-react'
import { Button } from '../components/ui'
import PagePlaceholder from './PagePlaceholder'

export default function Tasks() {
  return (
    <PagePlaceholder
      eyebrow="One step at a time"
      title="Big plans. Small steps."
      subtitle="Everything you're working toward, all in one place."
      actions={<Button iconLeft={<Plus />}>New task</Button>}
      stories={[
        'US-05 — Add a task (course, title, due date required)',
        'US-06 — List all tasks with course, due date, priority, status',
        'US-07 — Edit a task',
        'US-08 — Delete a task',
        'US-09 — Move a task through to do / in progress / done',
        'US-11 — Search tasks by title',
        'US-12 — Filter by course, priority and status',
      ]}
    />
  )
}

import { Plus } from 'lucide-react'
import { Button } from '../components/ui'
import PagePlaceholder from './PagePlaceholder'

export default function Upcoming() {
  return (
    <PagePlaceholder
      eyebrow="A little look ahead"
      title="Stay a step ahead."
      subtitle="Your deadlines, in order. A clearer view of what needs you next."
      actions={<Button iconLeft={<Plus />}>New task</Button>}
      stories={[
        'US-10 — Tasks sorted by due date, overdue highlighted in red, empty state',
      ]}
    />
  )
}

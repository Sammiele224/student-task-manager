import { Plus } from 'lucide-react'
import { Button } from '../components/ui'
import PagePlaceholder from './PagePlaceholder'

export default function Courses() {
  return (
    <PagePlaceholder
      eyebrow="Your academic world"
      title="A home for every course."
      subtitle="Keep your subjects organized. Give every assignment a place to belong."
      actions={<Button iconLeft={<Plus />}>New course</Button>}
      stories={[
        'US-01 — Add a course (unique code enforced)',
        'US-02 — List all courses, with an empty state',
        'US-03 — Edit a course',
        'US-04 — Delete a course (warn when it still has tasks)',
      ]}
    />
  )
}

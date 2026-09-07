import PagePlaceholder from './PagePlaceholder'

export default function Overview() {
  return (
    <PagePlaceholder
      eyebrow="Your workspace"
      title="Good to see you."
      subtitle="Let's make a little room for what matters."
      stories={[
        'US-13 — Dashboard: total tasks, overdue count, due this week, completion rate',
      ]}
    />
  )
}

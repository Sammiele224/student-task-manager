import { Card } from '../components/ui'
import { PageContainer, PageHeader } from '../components/layout'

/**
 * Temporary scaffold for a page nobody has built yet.
 *
 * Replace a page's body with real content — keep PageContainer + PageHeader
 * so the layout stays consistent across the app.
 */
export default function PagePlaceholder({ eyebrow, title, subtitle, stories, actions }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        actions={actions}
      />

      {/* <Card tone="outline" padding="lg">
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
          This page is a placeholder. Build it on a feature branch and open a PR.
        </p>
        <ul style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {stories.map((story) => (
            <li
              key={story}
              style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}
            >
              {story}
            </li>
          ))}
        </ul>
      </Card> */}
    </PageContainer>
  )
}

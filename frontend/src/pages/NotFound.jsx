import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { PageContainer, PageHeader } from '../components/layout'

export default function NotFound() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Nothing here"
        title="This page took a different path."
        subtitle="The link may be out of date, or the page hasn't been built yet."
        actions={
          <Button as={Link} to="/">
            Back to overview
          </Button>
        }
      />
    </PageContainer>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRight, Flag } from 'lucide-react'
import { Button } from '../../ui'
import { formatDue } from '../Tasks/taskMeta'
import campus from '../../../assets/image/campus.jpg'

/**
 * The photographic banner that opens the dashboard, with the next thing due
 * floating over it.
 *
 * @param {object} nextTask  the soonest unfinished task that is not yet late
 */
export default function HeroPanel({ nextTask }) {
  const due = nextTask ? formatDue(nextTask.dueDate, nextTask.status) : null

  return (
    <section className="hero" style={{ backgroundImage: `url(${campus})` }}>
      <div className="hero-scrim" aria-hidden="true" />

      <p className="hero-watermark" aria-hidden="true">
        Learn with purpose
        <br />
        Grow at your pace
      </p>

      <div className="hero-body">
        <span className="hero-eyebrow">
          <span className="hero-rule" aria-hidden="true" />
          Your next chapter
        </span>

        <h2 className="hero-title u-display">
          A little focus.
          <br />A <em>brighter</em> future.
        </h2>

        <p className="hero-copy">
          Big ambitions start with small steps.
          <br />
          Find your rhythm, one assignment at a time.
        </p>

        <Button as={Link} to="/tasks" variant="hero" iconRight={<ArrowRight size={16} />}>
          Let&apos;s get into it
        </Button>
      </div>

      {nextTask && (
        <Link to={`/tasks/${nextTask.id}`} className="hero-next">
          <span className="hero-next-icon" aria-hidden="true">
            <Flag size={16} />
          </span>
          <span className="hero-next-text">
            <span className="hero-next-label">Next on your horizon</span>
            <span className="hero-next-title">{nextTask.title}</span>
            <span className="hero-next-due">{due.label}</span>
          </span>
        </Link>
      )}
    </section>
  )
}

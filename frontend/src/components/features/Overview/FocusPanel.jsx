import { useEffect, useState } from 'react'
import { Leaf, Pause, Play, RotateCcw } from 'lucide-react'
import { Button, IconButton } from '../../ui'

const FOCUS_SECONDS = 25 * 60

function clockFace(seconds) {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

/**
 * A twenty-five minute focus session.
 *
 * The countdown works from an end timestamp rather than by subtracting one
 * each tick, so a throttled background tab cannot make the clock drift. The
 * session lives on this page: navigating away ends it.
 */
export default function FocusPanel() {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS)
  /* Null means paused; a timestamp means running until then. */
  const [endsAt, setEndsAt] = useState(null)

  useEffect(() => {
    if (endsAt === null) return

    const tick = () => {
      const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) setEndsAt(null)
    }

    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [endsAt])

  const running = endsAt !== null
  const finished = !running && remaining === 0

  const toggle = () => {
    if (running) {
      setEndsAt(null)
      return
    }
    /* Starting from a finished clock begins a fresh session. */
    const seconds = remaining === 0 ? FOCUS_SECONDS : remaining
    setRemaining(seconds)
    setEndsAt(Date.now() + seconds * 1000)
  }

  const reset = () => {
    setEndsAt(null)
    setRemaining(FOCUS_SECONDS)
  }

  return (
    <section className="focus-panel">
      <header className="focus-panel-head">
        <span className="focus-panel-eyebrow">
          <Leaf size={13} aria-hidden="true" />A moment to focus
        </span>
        <span className={`focus-panel-pip ${running ? 'is-on' : ''}`} aria-hidden="true" />
      </header>

      <h2 className="focus-panel-title u-display">
        {finished ? 'That is a session done.' : 'One thing at a time.'}
      </h2>
      <p className="focus-panel-copy">
        {finished ? 'Stretch, look up, then pick the next one.' : "Close the extra tabs. You've got this."}
      </p>

      <p className="focus-clock" role="timer" aria-label={`${clockFace(remaining)} remaining`}>
        {clockFace(remaining)}
      </p>

      <div className="focus-panel-actions">
        <Button
          variant="focus"
          onClick={toggle}
          iconLeft={running ? <Pause size={15} /> : <Play size={15} />}
        >
          {running ? 'Pause session' : finished ? 'Start another' : 'Start focus session'}
        </Button>

        <IconButton
          label="Reset the timer"
          size="sm"
          onClick={reset}
          disabled={!running && remaining === FOCUS_SECONDS}
        >
          <RotateCcw aria-hidden="true" />
        </IconButton>
      </div>

      <p className="focus-panel-note">25 minutes. Just you and your next step.</p>
    </section>
  )
}

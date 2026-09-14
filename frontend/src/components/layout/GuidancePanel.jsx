import { ArrowRight, Database } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui'
import './GuidancePanel.css'

/* Numbered in the order a student actually meets the app. */
const STEPS = [
  {
    title: 'Give your subjects a home.',
    text: 'Add a course with its name, a unique code, and a colour that feels right.',
  },
  {
    title: 'Turn your plans into small steps.',
    text: 'Create an assignment, pick a course, set a due date, and choose its priority.',
  },
  {
    title: 'Find your rhythm.',
    text: 'Move tasks from To do to In progress to Done. Switch to the board for a different perspective.',
  },
  {
    title: 'See what’s coming.',
    text: 'Upcoming puts your closest deadlines first and highlights overdue work. Your dashboard tracks the next 7 days.',
  },
]

/** The "A little guidance" dialog from the sidebar. */
export default function GuidancePanel({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="A little guidance"
      title="Make yourself at home."
      subtitle="Your personal workspace for a calmer semester."
    >
      <ol className="guidance__steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="guidance__step">
            <span className="guidance__step-number" aria-hidden="true">
              {index + 1}.
            </span>
            <div>
              <p className="guidance__step-title">{step.title}</p>
              <p className="guidance__step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="guidance__note">
        <Database size={14} aria-hidden="true" />
        <span>
          Your courses and assignments are saved on the server, so they follow you to
          any browser you sign in from.
        </span>
      </p>

      <p className="guidance__shortcuts">
        <kbd>Esc</kbd>
        <span>Close a window</span>
      </p>

      <div className="guidance__actions">
        <Button onClick={onClose} iconRight={<ArrowRight size={16} />}>
          Got it. Let’s begin
        </Button>
      </div>
    </Modal>
  )
}

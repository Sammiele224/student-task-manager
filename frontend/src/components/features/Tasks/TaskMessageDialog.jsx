import { ArrowUpRight } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui'

/**
 * A short message with one confirming action, in the same dialog shell as the
 * task form. Used for "Delete this task?" and for the nudge a student sees when
 * they try to add a task before they have any courses.
 *
 * @param {'primary'|'danger'} tone  styling of the confirm button
 */
export function TaskMessageDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  tone = 'primary',
}) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Your learning space" title={title}>
      <div className="task-dialog-body">
        <p>{message}</p>
      </div>

      <div className="modal-footer task-dialog-footer">
        <div className="modal-footer-actions">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={tone}
            type="button"
            onClick={onConfirm}
            iconRight={tone === 'primary' ? <ArrowUpRight size={16} /> : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

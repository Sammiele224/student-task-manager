import { ChevronDown } from 'lucide-react'
import { STATUS_VALUES, statusMeta } from './taskMeta'

/**
 * The coloured status pill that doubles as a dropdown. Used in list rows,
 * board cards and the detail page so status always looks and works the same.
 *
 * @param {string} value    current status key
 * @param {Function} onChange  receives the new status key
 * @param {string} label    accessible label, since the pill has no visible one
 * @param {string} size     'sm' inside board cards, 'md' elsewhere
 */
export default function StatusSelect({ value, onChange, label, size = 'md', className = '' }) {
  const meta = statusMeta(value)

  return (
    <div className={`tasks-status tasks-status--${size} ${meta.cssClass} ${className}`.trim()}>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {STATUS_VALUES.map((status) => (
          <option key={status} value={status}>
            {statusMeta(status).label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" />
    </div>
  )
}

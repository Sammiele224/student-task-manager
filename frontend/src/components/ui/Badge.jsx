import './Badge.css'

/**
 * Small status pill used for priority, task status and course codes.
 *
 * @param {'neutral'|'accent'|'high'|'medium'|'low'|'overdue'|'done'} tone
 * @param {boolean} dot  render a leading colour dot
 */
export default function Badge({
  tone,
  dot = false,
  dotColor,
  className = '',
  children,
  ...rest
}) {
  const getMappedTone = (content) => {
    if (!content) return 'neutral'
    const val = String(content).toLowerCase().trim()
    
    switch (val) {
      case 'high':
      case 'overdue':
        return 'high'
      case 'medium':
        return 'medium'
      case 'low':
      case 'done':
        return 'done'
      case 'in_progress':
      case 'in progress':
        return 'accent'
      case 'todo':
      case 'to do':
        return 'neutral'
      default:
        return 'neutral'
    }
  }

  const formatLabel = (content) => {
    if (!content) return ''
    const val = String(content).toLowerCase().trim()
    
    switch (val) {
      case 'in_progress':
      case 'in progress':
        return 'In Progress'
      case 'todo':
      case 'to do':
        return 'To Do'
      default:
        return content.charAt(0).toUpperCase() + content.slice(1)
    }
  }

  const finalTone = tone || getMappedTone(children)
  const displayContent = formatLabel(children)

  return (
    <span className={`badge badge--${finalTone} ${className}`.trim()} {...rest}>
      {dot && (
        <span
          className="badge__dot"
          style={dotColor ? { background: dotColor } : undefined}
          aria-hidden="true"
        />
      )}
      {displayContent}
    </span>
  )
}
import './Badge.css'

/**
 * Small status pill used for priority, task status and course codes.
 *
 * @param {'neutral'|'accent'|'high'|'medium'|'low'|'overdue'|'done'} tone
 * @param {boolean} dot  render a leading colour dot
 */
export default function Badge({
  tone = 'neutral',
  dot = false,
  dotColor,
  className = '',
  children,
  ...rest
}) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()} {...rest}>
      {dot && (
        <span
          className="badge__dot"
          style={dotColor ? { background: dotColor } : undefined}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

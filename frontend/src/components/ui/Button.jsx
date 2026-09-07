import './Button.css'

/**
 * Shared button. Use this everywhere — do not hand-roll <button> elements.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {React.ReactNode} iconLeft   icon rendered before the label
 * @param {React.ReactNode} iconRight  icon rendered after the label
 * @param {boolean} fullWidth          stretch to the container width
 * @param {boolean} loading            shows a spinner and blocks clicks
 * @param {'button'|'a'|React.ElementType} as  render as a link when needed
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    loading && 'is-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classes}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="btn__icon">{iconLeft}</span>}
      <span className="btn__label">{children}</span>
      {iconRight && <span className="btn__icon">{iconRight}</span>}
    </Tag>
  )
}

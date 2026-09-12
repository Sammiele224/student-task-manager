import './IconButton.css'

/**
 * A button whose whole label is its icon: month steppers, row menus, dialog
 * close controls.
 *
 * The icon carries no text, so `label` is required — it becomes the accessible
 * name and the hover tooltip. Pass the icon as the only child.
 *
 * @param {string} label  accessible name, e.g. "Previous month"
 * @param {'sm'|'md'|'lg'} size
 * @param {'button'|'a'|React.ElementType} as  render as a link when needed
 */
export default function IconButton({
  label,
  size = 'md',
  disabled = false,
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = ['icon-button', `icon-button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classes}
      type={Tag === 'button' ? 'button' : undefined}
      disabled={Tag === 'button' ? disabled : undefined}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </Tag>
  )
}

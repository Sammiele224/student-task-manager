import './Card.css'

/**
 * Shared surface container. Everything that sits on the page background —
 * stat tiles, course cards, task panels, empty states — uses this.
 *
 * @param {React.ReactNode} eyebrow  small-caps label above the title
 * @param {React.ReactNode} title    card heading
 * @param {React.ReactNode} action   right-aligned control in the header
 * @param {React.ReactNode} footer   divided footer region
 * @param {'none'|'sm'|'md'|'lg'} padding
 * @param {'default'|'subtle'|'outline'} tone
 * @param {boolean} hoverable        lifts on hover (use for clickable cards)
 */
export default function Card({
  eyebrow,
  title,
  action,
  footer,
  padding = 'md',
  tone = 'default',
  hoverable = false,
  as: Tag = 'section',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'card',
    `card--${tone}`,
    `card--pad-${padding}`,
    hoverable && 'card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const hasHeader = eyebrow || title || action

  return (
    <Tag className={classes} {...rest}>
      {hasHeader && (
        <header className="card__header">
          <div className="card__heading">
            {eyebrow && <span className="u-eyebrow">{eyebrow}</span>}
            {title && <h3 className="card__title u-display">{title}</h3>}
          </div>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}

      {children && <div className="card__body">{children}</div>}

      {footer && <footer className="card__footer">{footer}</footer>}
    </Tag>
  )
}

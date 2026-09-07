import './PageHeader.css'

/**
 * The eyebrow + serif title + subtitle + action block that opens every page.
 *
 * @param {string} eyebrow  small-caps line above the title
 * @param {string} title    serif display heading
 * @param {string} subtitle supporting sentence
 * @param {React.ReactNode} actions  right-aligned buttons
 */
export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        {eyebrow && <span className="u-eyebrow">{eyebrow}</span>}
        <h1 className="page-header__title u-display">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}

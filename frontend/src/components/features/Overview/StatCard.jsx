/**
 * One headline figure: a label, an icon, the number, and a line of context.
 *
 * @param {React.ReactNode} suffix  rendered small beside the value, e.g. "%"
 * @param {number} progress  0-100; draws a bar under the footnote when given
 * @param {'danger'} tone    colours the value when the number is bad news
 */
export default function StatCard({ label, icon, value, suffix, footnote, progress, tone }) {
  return (
    <article className={`stat-card ${tone ? `stat-card--${tone}` : ''}`.trim()}>
      <header className="stat-card-head">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon" aria-hidden="true">
          {icon}
        </span>
      </header>

      <p className="stat-card-value">
        {value}
        {suffix && <span className="stat-card-suffix">{suffix}</span>}
      </p>

      <footer className="stat-card-foot">
        <span className="stat-card-note">{footnote}</span>
        {progress != null && (
          <span className="stat-card-track" aria-hidden="true">
            <span className="stat-card-fill" style={{ width: `${progress}%` }} />
          </span>
        )}
      </footer>
    </article>
  )
}

import './PageContainer.css'

/**
 * Constrains and pads page content. Every page body goes inside one of these
 * so gutters stay identical across the app.
 */
export default function PageContainer({ className = '', children, ...rest }) {
  return (
    <div className={`page-container ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}

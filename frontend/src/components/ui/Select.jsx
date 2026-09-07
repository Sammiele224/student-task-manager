import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import './Field.css'

/**
 * Shared select. Give it either an `options` array or <option> children.
 *
 * @param {Array<{value: string, label: string}>} options
 * @param {string} placeholder  renders a disabled first option
 */
export default function Select({
  label,
  hint,
  error,
  required = false,
  options,
  placeholder,
  id,
  className = '',
  fullWidth = true,
  bare = false,
  children,
  ...rest
}) {
  const autoId = useId()
  const fieldId = id || autoId
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined

  const wrapper = [
    'field',
    fullWidth && 'field--full',
    bare && 'field--bare',
    error && 'is-invalid',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapper}>
      {label && (
        <label className="field__label" htmlFor={fieldId}>
          {label}
          {required && <span className="field__required">*</span>}
        </label>
      )}

      <div className="field__control">
        <select
          id={fieldId}
          className="field__input field__select"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="field__chevron">
          <ChevronDown />
        </span>
      </div>

      {error ? (
        <span className="field__error" id={`${fieldId}-error`} role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span className="field__hint" id={`${fieldId}-hint`}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}

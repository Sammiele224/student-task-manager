import { useId } from 'react'
import './Field.css'

/**
 * Shared text input. Pass `as="textarea"` for a multi-line field.
 *
 * @param {string} label      visible label; omit for bare inputs (search boxes)
 * @param {string} hint       helper text under the field
 * @param {string} error      error message — also flips the field to invalid
 * @param {boolean} required  appends a red asterisk to the label
 * @param {boolean} optional  appends a muted "(optional)" to the label
 * @param {React.ReactNode} icon  leading icon inside the control
 * @param {'input'|'textarea'} as
 */
export default function Input({
  label,
  hint,
  error,
  required = false,
  optional = false,
  icon,
  as: Tag = 'input',
  id,
  className = '',
  fullWidth = true,
  bare = false,
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
          {optional && <span className="field__optional"> (optional)</span>}
        </label>
      )}

      <div className="field__control">
        {icon && <span className="field__icon">{icon}</span>}
        <Tag
          id={fieldId}
          className={`field__input ${icon ? 'field__input--with-icon' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        />
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

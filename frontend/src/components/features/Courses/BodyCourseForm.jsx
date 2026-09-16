import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '../../ui'
import {
  COURSE_COLOR_OPTIONS,
  DEFAULT_COURSE_COLOR,
  courseColorValue,
} from './courseColors'

const EMPTY_VALUES = {
  name: '',
  code: '',
  color: DEFAULT_COURSE_COLOR,
}
// body form for creat and edit
export function CourseForm({ initialValues = EMPTY_VALUES, submitLabel = 'Create course', onCancel, onSubmit }) {
  const [name, setName] = useState(initialValues.name)
  const [code, setCode] = useState(initialValues.code)
  const [color, setColor] = useState(initialValues.color)


  useEffect(() => {
    setName(initialValues.name)
    setCode(initialValues.code)
    setColor(initialValues.color)
  }, [initialValues])

  const isValid = name.trim().length > 0 && code.trim().length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit({ name: name.trim(), code: code.trim().toUpperCase(), color })
  }

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="course-name">Course name <span className="required">*</span></label>
        <input
          id="course-name"
          type="text"
          placeholder="e.g. Software Engineering"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="form-field">
        <label htmlFor="course-code">Course code <span className="required">*</span></label>
        <input
          id="course-code"
          type="text"
          placeholder="e.g. CS204"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <p className="form-hint">Use a unique code to tell your courses apart.</p>
      </div>

      <div className="form-field">
        <label>Course color</label>
        <div className="color-swatch-row" role="radiogroup" aria-label="Course color">
          {COURSE_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={color === opt.value}
              aria-label={opt.label}
              className={`color-swatch ${color === opt.value ? 'color-swatch--selected' : ''
                }`}
              style={{ '--swatch-color': courseColorValue(opt.value) }}
              onClick={() => setColor(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="modal-footer">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid} iconRight={<ArrowUpRight size={16} />}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
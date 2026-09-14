import { MoreHorizontal, Pencil, Trash2, Code2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { courseColorValue } from './courseColors'

/**
 * @param {object} progress  real counts for this course, { done, active, total }.
 *   The course record only carries a task count, so without this the card has
 *   no way to know how much of that count is finished.
 */
export function CourseCard({ course, progress, onOpen, onEdit, onRemove }) {
    const {
        name,
        code,
        color: storedColor,
        taskCount,
    } = course

    /* The row stores a colour name; the design system owns the value. */
    const color = courseColorValue(storedColor)

    const [showMenu, setShowMenu] = useState(false)
    const closeMenu = useCallback(() => setShowMenu(false), [])
    const menuRef = useClickOutside(closeMenu, showMenu)

    /* Fall back to the course's own count when no task list was passed, which
       reads as a course whose work has not been started. */
    const done = progress?.done ?? 0
    const total = progress?.total ?? taskCount ?? 0
    const activeCount = progress?.active ?? taskCount ?? 0

    const percent = total > 0
        ? Math.round((done / total) * 100)
        : 0

    const handleEdit = (e) => {
        e.stopPropagation()
        setShowMenu(false)
        onEdit?.(course)
    }

    const handleRemove = (e) => {
        e.stopPropagation()
        setShowMenu(false)
        onRemove?.(course)
    }

    /* The card holds its own buttons, so it cannot be a <button> itself.
       role + key handling give the keyboard the same way in as the mouse. */
    const openProps = onOpen
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onOpen,
            onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpen()
                }
            },
            'aria-label': `Open ${name}`,
        }
        : {}

    return (
        <div
            className={`course-card ${onOpen ? 'is-openable' : ''}`.trim()}
            style={{ '--course-color': color }}
            {...openProps}
        >
            {/* cover */}
            <div className="course-card__cover">
                <div
                    className="course-card__cover-icon"
                    style={{ color }}
                >
                    <Code2 size={28} strokeWidth={1.5} />
                </div>
                <span className="course-card__code-tag">{code}</span>

                <div className="course-card__menu-wrapper" ref={menuRef}>
                    <button
                        type="button"
                        className="course-card__menu"
                        aria-label={`Options for ${name}`}
                        aria-haspopup="menu"
                        aria-expanded={showMenu}
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu((prev) => !prev)
                        }}
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {showMenu && (
                        <div className="course-card__dropdown" role="menu">
                            <button type="button" className="course-card__dropdown-item" role="menuitem" onClick={handleEdit}>
                                <Pencil size={15} />
                                <span>Edit</span>
                            </button>
                            <button
                                type="button"
                                className="course-card__dropdown-item course-card__dropdown-item--danger"
                                role="menuitem"
                                onClick={handleRemove}
                            >
                                <Trash2 size={15} />
                                <span>Remove</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* body */}
            <div className="course-card__body">
                <div className="course-card__meta">
                    <span className="course-card__meta-left">
                        <span
                            className="course-card__dot"
                            style={{ background: color }}
                        />

                        {code}
                    </span>

                    <span className="course-card__active-pill">
                        {activeCount} active
                    </span>
                </div>

                <h3 className="course-card__title">
                    {name}
                </h3>

                <div className="course-card__progress">
                    <div className="course-card__progress-row">
                        <span>
                            {done} of {total} tasks complete
                        </span>

                        <span>
                            {percent}%
                        </span>
                    </div>

                    <div className="course-card__track">
                        <div
                            className="course-card__fill"
                            style={{
                                width: `${percent}%`,
                                background: color,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AddCourseCard({ onClick }) {
    return (
        <button
            type="button"
            className="course-card course-card--add"
            onClick={onClick}
        >
            <span className="course-card__add-icon">
                +
            </span>

            <span className="course-card__add-title">
                A new possibility
            </span>

            <span className="course-card__add-sub">
                Add another course to your workspace
            </span>
        </button>
    )
}
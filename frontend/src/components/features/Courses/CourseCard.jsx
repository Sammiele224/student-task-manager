import { MoreHorizontal, Pencil, Trash2, Code2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside'

export function CourseCard({ course, onOpen, onEdit, onRemove }) {
    const {
        id,
        name,
        code,
        color,
        taskCount,
        createdAt,
    } = course

    const [showMenu, setShowMenu] = useState(false)
    const closeMenu = useCallback(() => setShowMenu(false), [])
    const menuRef = useClickOutside(closeMenu, showMenu)

    // do not have complete task
    const done = 0
    const total = taskCount
    const activeCount = taskCount

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

    return (
        <div className="course-card" onClick={onOpen}>
            {/* cover */}
            <div
                className="course-card__cover"
                style={{
                    background: `linear-gradient(
            135deg,
            ${color}33 0%,
            ${color}66 100%
          )`,
                }}
            >
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
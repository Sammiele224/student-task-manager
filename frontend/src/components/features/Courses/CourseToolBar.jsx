import { BookOpen, ChevronDown } from 'lucide-react'

export function CoursesToolbar({ count, semester }) {
  return (
    <div className="courses-toolbar">
      <span className="courses-toolbar__count">{count} courses in your workspace</span>
      <button type="button" className="courses-toolbar__semester">
        <BookOpen size={14} />
        {semester}
        <ChevronDown size={14} />
      </button>
    </div>
  )
}
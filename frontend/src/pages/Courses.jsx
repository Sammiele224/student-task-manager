import { Plus, Code2, Database } from 'lucide-react'
import { Button } from '../components/ui'
import { CourseCard, AddCourseCard } from '../components/features/Courses/CourseCard'
import { CoursesToolbar } from '../components/features/Courses/CourseToolBar'
import PagePlaceholder from './PagePlaceholder'

import coursesData from '../data/course.json'

import '../styles/features/Course/Course.css'


export default function Courses() {
  const courses = coursesData.data

  return (
    <>
      <PagePlaceholder
        eyebrow="Your academic world"
        title="A home for every course."
        subtitle="Keep your subjects organized. Give every assignment a place to belong."
        actions={
          <Button iconLeft={<Plus />}>
            New course
          </Button>
        }
      />

      <div className="courses-wrapper">
        <CoursesToolbar
          count={courses.length}
          semester="Fall Semester 2026"
        />

        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}

          <AddCourseCard
            onClick={() => {
              // open new-course flow
            }}
          />
        </div>
      </div>
    </>
  )
}
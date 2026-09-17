import { apiFetch } from './apiClient'

export async function getCourses() {
  const result = await apiFetch('/courses')

  return result.data
}

export async function createCourse(courseData) {
  const result = await apiFetch('/courses', {
    method: 'POST',
    body: JSON.stringify({
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    }),
  })

  return result.data
}

export async function updateCourse(id, courseData) {
  const result = await apiFetch(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    }),
  })

  return result.data
}

export async function deleteCourse(id) {
  const result = await apiFetch(`/courses/${id}`, {
    method: 'DELETE',
  })

  return result.data
}

import { apiClient } from './apiClient'

const API_PATH = '/courses'

export async function getCourses() {
  return apiClient(API_PATH, { fallbackMessage: 'Failed to fetch courses' })
}

export async function createCourse(courseData) {
  return apiClient(API_PATH, {
    method: 'POST',
    body: {
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    },
    fallbackMessage: 'Failed to create course',
  })
}

export async function updateCourse(id, courseData) {
  return apiClient(`${API_PATH}/${id}`, {
    method: 'PUT',
    body: {
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    },
    fallbackMessage: 'Failed to update course',
  })
}

export async function deleteCourse(id) {
  return apiClient(`${API_PATH}/${id}`, {
    method: 'DELETE',
    fallbackMessage: 'Failed to delete course',
    returnEnvelope: true,
  })
}
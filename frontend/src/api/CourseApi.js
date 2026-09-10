const API_URL = 'http://localhost:4000/api/v1/courses'

export async function getCourses() {
  const response = await fetch(API_URL)

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch courses')
  }

  return result.data
}

export async function createCourse(courseData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create course')
  }

  return result.data
}

export async function updateCourse(id, courseData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: courseData.name,
      code: courseData.code,
      color: courseData.color,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update course')
  }

  return result.data
}

export async function deleteCourse(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete course')
  }

  return result
}
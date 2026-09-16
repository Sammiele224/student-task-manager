/**
 * Task endpoints.
 *
 * The path is relative on purpose. The Vite dev server forwards /api to the
 * Express server, so the frontend never needs to know the backend's origin and
 * the calls keep working when the dev server falls back to another port.
 */
import { apiClient } from './apiClient'

const API_PATH = '/tasks'

/**
 * @param {object} params  optional search, courseId, status, priority, sort, order
 */
export async function getTasks(filters = {}) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.append('search', filters.search)
  }

  if (filters.courseId) {
    params.append('courseId', filters.courseId)
  }

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.priority) {
    params.append('priority', filters.priority)
  }

  if (filters.sort) {
    params.append('sort', filters.sort)
  }

  if (filters.order) {
    params.append('order', filters.order)
  }

  const queryString = params.toString()

  return apiClient(
    queryString ? `${API_PATH}?${queryString}` : API_PATH,
    { fallbackMessage: 'Failed to fetch tasks' }
  )
}

export async function getTask(id) {
  return apiClient(`${API_PATH}/${id}`, {
    fallbackMessage: 'Failed to fetch this task',
  })
}

/**
 * Creates a task. The API answers with only the new id, title and status, so
 * callers need to reload the list to get the course and date fields back.
 */
export async function createTask(task) {
  return apiClient(API_PATH, {
    method: 'POST',
    body: {
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    },
    fallbackMessage: 'Failed to create task',
  })
}

/** Full update. Every field is required by the API. */
export async function updateTask(id, task) {
  return apiClient(`${API_PATH}/${id}`, {
    method: 'PUT',
    body: {
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    },
    fallbackMessage: 'Failed to update task',
  })
}

/**
 * Status only, for the checkbox and the dropdown. The API owns the completion
 * timestamp, so never send one.
 */
export async function updateTaskStatus(id, status) {
  return apiClient(`${API_PATH}/${id}/status`, {
    method: 'PATCH',
    body: { status },
    fallbackMessage: 'Failed to update status',
  })
}

export async function deleteTask(id) {
  return apiClient(`${API_PATH}/${id}`, {
    method: 'DELETE',
    fallbackMessage: 'Failed to delete task',
  })
}

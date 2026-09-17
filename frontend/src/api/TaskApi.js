import { apiFetch } from './apiClient'

/**
 * @param {object} filters
 * optional search, courseId, status, priority, sort, order
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

  const result = await apiFetch(
    queryString ? `/tasks?${queryString}` : '/tasks'
  )

  return result.data
}

export async function getTask(id) {
  const result = await apiFetch(`/tasks/${id}`)

  return result.data
}

export async function createTask(task) {
  const result = await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    }),
  })

  return result.data
}

export async function updateTask(id, task) {
  const result = await apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    }),
  })

  return result.data
}

export async function updateTaskStatus(id, status) {
  const result = await apiFetch(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
  })

  return result.data
}

export async function deleteTask(id) {
  const result = await apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  })

  return result.data
}

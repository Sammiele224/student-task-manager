/**
 * Task endpoints.
 *
 * The path is relative on purpose. The Vite dev server forwards /api to the
 * Express server, so the frontend never needs to know the backend's origin and
 * the calls keep working when the dev server falls back to another port.
 */
const API_URL = '/api/v1/tasks'

/** Unwraps the { success, data } envelope and turns a failure into a throw. */
async function readResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.success === false) {
    throw new Error(result.message || fallbackMessage)
  }

  return result.data
}

/**
 * @param {object} params  optional search, courseId, status, priority, sort, order
 */
export async function getTasks(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString()

  const response = await fetch(query ? `${API_URL}?${query}` : API_URL)
  return readResponse(response, 'Failed to fetch tasks')
}

export async function getTask(id) {
  const response = await fetch(`${API_URL}/${id}`)
  return readResponse(response, 'Failed to fetch this task')
}

/**
 * Creates a task. The API answers with only the new id, title and status, so
 * callers need to reload the list to get the course and date fields back.
 */
export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    }),
  })

  return readResponse(response, 'Failed to create task')
}

/** Full update. Every field is required by the API. */
export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: task.courseId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    }),
  })

  return readResponse(response, 'Failed to update task')
}

/**
 * Status only, for the checkbox and the dropdown. The API owns the completion
 * timestamp, so never send one.
 */
export async function updateTaskStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  return readResponse(response, 'Failed to update status')
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  return readResponse(response, 'Failed to delete task')
}

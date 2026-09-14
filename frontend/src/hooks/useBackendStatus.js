import { useEffect, useState } from 'react'

/* Long enough to stay quiet, short enough that restarting the API shows up
   without a reload. */
const POLL_MS = 30000

/**
 * Whether the API is answering.
 *
 * `/api/health` sits outside the /api/v1 prefix and already reports both the
 * server and its database, so it is the one call that can say whether the app
 * has anything behind it.
 *
 * Returns 'checking' until the first reply, then 'online' or 'offline'.
 */
export function useBackendStatus() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const response = await fetch('/api/health')
        const body = await response.json()
        if (cancelled) return
        /* A 200 with database: 'unreachable' is still a broken app, so the
           body decides rather than the status code alone. */
        setStatus(response.ok && body?.database === 'connected' ? 'online' : 'offline')
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    check()
    const timer = setInterval(check, POLL_MS)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return status
}

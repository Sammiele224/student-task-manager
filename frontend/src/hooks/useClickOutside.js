import { useEffect, useRef } from 'react'

// user can click outside of the element to close it
export function useClickOutside(onOutside, active = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [onOutside, active])

  return ref
}
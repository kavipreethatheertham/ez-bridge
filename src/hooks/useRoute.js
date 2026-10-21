import { useSyncExternalStore } from 'react'
import { parseRoute } from '../lib/route'

const subscribe = (onChange) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash

/** The page the browser address points to. The component re-renders when the address changes. */
export function useRoute() {
  return parseRoute(useSyncExternalStore(subscribe, getHash))
}

import { TOKEN_STORAGE_KEY } from './config'

const listeners = new Set<() => void>()

export const tokenStore = {
  get(): string | null {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  },
  set(token: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    listeners.forEach((l) => l())
  },
  clear() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    listeners.forEach((l) => l())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

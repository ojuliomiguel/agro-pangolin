const DEFAULT_API_ORIGIN = 'http://localhost'

export function getApiOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return DEFAULT_API_ORIGIN
}

export function getApiUrl(path: string) {
  return new URL(path, getApiOrigin()).toString()
}

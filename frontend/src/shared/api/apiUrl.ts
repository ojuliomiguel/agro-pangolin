const DEFAULT_API_ORIGIN = 'http://localhost:3000'
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1'])

export function resolveApiOrigin(appOrigin?: string) {
  if (!appOrigin) {
    return DEFAULT_API_ORIGIN
  }

  const { hostname, port } = new URL(appOrigin)

  if (LOCAL_HOSTNAMES.has(hostname) && port !== '3000') {
    return DEFAULT_API_ORIGIN
  }

  return appOrigin
}

export function getApiOrigin() {
  return resolveApiOrigin(
    typeof window !== 'undefined' ? window.location?.origin : undefined
  )
}

export function getApiUrl(path: string) {
  return new URL(path, getApiOrigin()).toString()
}

import { IS_DEMO_MODE } from './config'
import { mockRequest } from './mock-adapter'
import { springRequest } from './spring-adapter'
import { tokenStore } from './token'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const token = auth ? tokenStore.get() : null

  if (IS_DEMO_MODE) {
    return mockRequest<T>(path, { method, body, token })
  }

  return springRequest<T>(path, { method, body, token })
}

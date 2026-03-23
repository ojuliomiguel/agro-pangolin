import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'util'
import { TransformStream, ReadableStream, WritableStream } from 'stream/web'
import { BroadcastChannel, MessageChannel } from 'worker_threads'
Object.assign(global, { TextDecoder, TextEncoder, TransformStream, ReadableStream, WritableStream, BroadcastChannel, MessageChannel })

import { server } from './src/mocks/server'
import { resetProducerFixtures } from './src/mocks/fixtures/producers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  resetProducerFixtures()
})
afterAll(() => server.close())

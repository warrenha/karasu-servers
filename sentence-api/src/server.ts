import { serve } from '@hono/node-server'
import app from './app'

const PORT = 3000

const server = serve({
    fetch: app.fetch,
    port: PORT
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

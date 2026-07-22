import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello/:name', (c) => {
    const name = c.req.param('name')

    return c.json({
        message: `Hello ${name}`
    })
})

serve({
    fetch: app.fetch,
    port: 3000
})

console.log('Server running on http://localhost:3000')

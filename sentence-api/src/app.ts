import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { helloRouter } from './routes/hello-router'

/*
 * Endpoints for the HTTP server.
 */
const app = new Hono()

// - - - - - Cors - - - - - //

const allowedOrigins = [
    'http://localhost:5173',
    'https://karasu.co.uk'
]
app.use('*', cors({
    origin: (origin) => {
        if (origin && allowedOrigins.includes(origin)) {
            return origin
        }
        return ''
    }
}))

// - - - - - Testing - - - - - //

app.get('/', (c) => {
    return c.text('Hello World!')
})

// Add routes...

app.route('/hello', helloRouter);

export default app

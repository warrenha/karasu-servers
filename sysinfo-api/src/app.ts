import { Hono } from 'hono'
import sysinfo from './routes/sysinfo'

/*
 * Endpoints for the HTTP server.
 */
const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello World!')
})

// Add routes...

app.route("/sysinfo", sysinfo);

export default app

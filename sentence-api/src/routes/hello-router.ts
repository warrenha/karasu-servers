import { Hono } from 'hono'

/*
 * Endpoints for the '/hello' path.
 */
const router = new Hono()

router.get('/:name', (c) => {   // c: Context
    const name = c.req.param('name')  // request parameters
    return c.json({
        message: `Hello ${name}`
    })
})

export const helloRouter = router

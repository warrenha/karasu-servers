import { Hono } from 'hono'
import { convertToFurigana } from './jpn-convert'

const sentence = "勉強するのは疲れる"

/*
 * Endpoints for the '/jpn' path.
 */
const router = new Hono()

router.get('/furigana/:name', async (c) => {   // c: Context
    const name = c.req.param('name')  // request parameters

    const parts = await convertToFurigana(sentence)

    return c.json(parts)
})

export const jpnRouter = router

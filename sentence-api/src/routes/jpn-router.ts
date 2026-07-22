import { Hono } from 'hono'
import { jpnToFurigana } from './jpn-convert'

const MAX_SENTENCE_LENGTH = 1000

type FuriganaRequest = {
    sentence?: unknown
}

const router = new Hono()

router.post('/furigana', async (c) => {
    let body: FuriganaRequest
    try {
        body = await c.req.json<FuriganaRequest>()
    } catch {
        return c.json({ error: 'Request body must be valid JSON.' }, 400)
    }
    if (!body || typeof body.sentence !== 'string' || !body.sentence.trim()) {
        return c.json({ error: 'sentence must be a non-empty string.' }, 400)
    }
    if (body.sentence.length > MAX_SENTENCE_LENGTH) {
        return c.json({ error: `sentence must be at most ${MAX_SENTENCE_LENGTH} characters.` }, 400)
    }

    const text = body.sentence.trim()
    try {
        return c.json(await jpnToFurigana(text))
    }
    catch (err) {
        console.error('Furigana conversion failed', err)
        return c.json({ error: 'Unable to convert the supplied sentence.' }, 500)
    }
})

export const jpnRouter = router

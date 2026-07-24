import { Hono } from 'hono'

import {
    practiceRepository,
    type PracticeRepository
} from './practice-data'

const COLLECTION_ID_PATTERN = /^[1-9]\d*$/

export const createPracticeRouter = (
    repository: PracticeRepository = practiceRepository
) => {
    const router = new Hono()

    router.get('/collections', async (c) => {
        try {
            const collections = await repository.listCollections()
            return c.json(collections)
        } catch (err) {
            console.error('Unable to list practice collections', err)
            return c.json({ error: 'Unable to list practice collections.' }, 500)
        }
    })

    router.get('/collections/:collectionId/sentences', async (c) => {
        const collectionId = c.req.param('collectionId')
        if (!COLLECTION_ID_PATTERN.test(collectionId)) {
            return c.json({ error: 'collectionId must be a positive integer.' }, 400)
        }

        try {
            const collectionExists = await repository.collectionExists(collectionId)
            if (!collectionExists) {
                return c.json({ error: 'Practice collection not found.' }, 404)
            }

            const sentences = await repository.listSentences(collectionId)
            return c.json(sentences)
        } catch (err) {
            console.error('Unable to list practice sentences', err)
            return c.json({ error: 'Unable to list practice sentences.' }, 500)
        }
    })

    return router
}

export const practiceRouter = createPracticeRouter()

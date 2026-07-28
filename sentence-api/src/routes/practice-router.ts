import { Hono } from 'hono'

import { practiceService } from '@/services/practice'
import type { BasicPracticeSentence, PracticeService } from '@/services/practice'
import { isPositiveInteger, parseSentence } from './practice-validate'

export const createPracticeRouter = (
    service: PracticeService = practiceService
) => {
    const router = new Hono()

    router.get('/collections', async (c) => {
        try {
            const collections = await service.listCollections()
            return c.json(collections)
        } catch (err) {
            console.error('Unable to list practice collections', err)
            return c.json({ error: 'Unable to list practice collections.' }, 500)
        }
    })

    router.get('/collections/:collectionId/sentences', async (c) => {
        const collectionId = c.req.param('collectionId')
        if (!isPositiveInteger(collectionId)) {
            return c.json({ error: 'collectionId must be a positive integer.' }, 400)
        }

        try {
            const collectionExists = await service.collectionExists(collectionId)
            if (!collectionExists) {
                return c.json({ error: 'Practice collection not found.' }, 404)
            }

            const sentences = await service.listSentences(collectionId)
            return c.json(sentences)
        } catch (err) {
            console.error('Unable to list practice sentences', err)
            return c.json({ error: 'Unable to list practice sentences.' }, 500)
        }
    })

    router.post('/collections/:collectionId/sentence', async (c) => {
        const collectionId = c.req.param('collectionId')
        if (!isPositiveInteger(collectionId)) {
            return c.json({ error: 'collectionId must be a positive integer.' }, 400)
        }

        let body: unknown
        try {
            body = await c.req.json()
        } catch {
            return c.json({ error: 'Request body must be valid JSON.' }, 400)
        }

        let sentence: BasicPracticeSentence
        try {
            sentence = parseSentence(body)
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Sentence fields are invalid.'
            return c.json({ error }, 400)
        }

        try {
            const exists = await service.collectionExists(collectionId)
            if (!exists) {
                return c.json({ error: 'Practice collection not found.' }, 404)
            }

            const createdSentence = await service.addSentence(collectionId, sentence)
            return c.json(createdSentence, 201)
        } catch (err) {
            console.error('Unable to add practice sentence', err)
            return c.json({ error: 'Unable to add practice sentence.' }, 500)
        }
    })

    router.delete('/collections/:collectionId/sentence/:sentenceId', async (c) => {
        const collectionId = c.req.param('collectionId')
        const sentenceId = c.req.param('sentenceId')
        
        if (!isPositiveInteger(collectionId)) {
            return c.json({ error: 'collectionId must be a positive integer.' }, 400)
        }
        if (!isPositiveInteger(sentenceId)) {
            return c.json({ error: 'sentenceId must be a positive integer.' }, 400)
        }

        try {
            const exists = await service.collectionExists(collectionId)
            if (!exists) {
                return c.json({ error: 'Practice collection not found.' }, 404)
            }

            const deleted = await service.deleteSentence(collectionId, sentenceId)
            if (!deleted) {
                return c.json({ error: 'Practice sentence not found.' }, 404)
            }

            return c.body(null, 204)
        } catch (err) {
            console.error('Unable to delete practice sentence', err)
            return c.json({ error: 'Unable to delete practice sentence.' }, 500)
        }
    })

    return router
}

export const practiceRouter = createPracticeRouter()

import assert from 'node:assert/strict'
import test from 'node:test'

import type {
    BasicPracticeSentence, PracticeCollection, PracticeSentence, PracticeService
} from '@/services/practice'
import { createPracticeRouter } from './practice-router'

const collections: PracticeCollection[] = [
    { id: '1', name: 'Default', notes: '' },
    { id: '2', name: 'Bunpro', notes: 'Bunpro examples.' }
]

const sentences: PracticeSentence[] = [{
    id: '7',
    textEng: 'It is exhausting to study.',
    textJpn: '勉強するのは疲れる。',
    alternativesEng: [],
    alternativesJpn: [],
    notes: '',
    sourceName: 'Bunpro',
    sourceUrl: 'https://bunpro.jp/vocabs/%E7%96%B2%E3%82%8C%E3%82%8B',
    sourceItem: '疲れる',
    jlptLevel: 'N5',
    collectionId: '1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z')
}]

let addedSentence: BasicPracticeSentence | undefined

const service: PracticeService = {
    async listCollections() {
        return collections
    },
    async collectionExists(collectionId) {
        return collectionId === '1'
    },
    async listSentences(collectionId) {
        return collectionId === '1' ? sentences : []
    },
    async addSentence(_collectionId, sentence) {
        addedSentence = sentence
        return sentences[0]
    }
}

const router = createPracticeRouter(service)

test('returns the practice collections', async () => {
    const response = await router.request('http://localhost/collections')

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), collections)
})

test('returns the sentences in a collection', async () => {
    const response = await router.request('http://localhost/collections/1/sentences')

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), [{
        ...sentences[0],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z'
    }])
})

test('rejects an invalid collection ID', async () => {
    const response = await router.request('http://localhost/collections/not-a-number/sentences')

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
        error: 'collectionId must be a positive integer.'
    })
})

test('rejects a non-positive collection ID', async () => {
    const response = await router.request('http://localhost/collections/0/sentences')

    assert.equal(response.status, 400)
})

test('returns not found for an unknown collection', async () => {
    const response = await router.request('http://localhost/collections/99/sentences')

    assert.equal(response.status, 404)
    assert.deepEqual(await response.json(), {
        error: 'Practice collection not found.'
    })
})

test('adds a sentence to a collection', async () => {
    const response = await router.request('http://localhost/collections/1/sentence', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            textEng: ' It is exhausting to study. ',
            textJpn: ' 勉強するのは疲れる。 ',
            sourceName: 'Bunpro',
            jlptLevel: 'N5'
        })
    })

    assert.equal(response.status, 201)
    assert.deepEqual(addedSentence, {
        textEng: 'It is exhausting to study.',
        textJpn: '勉強するのは疲れる。',
        alternativesEng: [],
        alternativesJpn: [],
        notes: null,
        sourceName: 'Bunpro',
        sourceUrl: null,
        sourceItem: null,
        jlptLevel: 'N5'
    })
    assert.deepEqual(await response.json(), {
        ...sentences[0],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z'
    })
})

test('rejects an invalid sentence', async () => {
    const response = await router.request('http://localhost/collections/1/sentence', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ textEng: 'Missing Japanese text' })
    })

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
        error: 'Sentence field is invalid: textJpn'
    })
})

test('rejects malformed JSON when adding a sentence', async () => {
    const response = await router.request('http://localhost/collections/1/sentence', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{'
    })

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
        error: 'Request body must be valid JSON.'
    })
})

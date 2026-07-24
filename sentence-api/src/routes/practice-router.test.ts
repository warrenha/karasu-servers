import assert from 'node:assert/strict'
import test from 'node:test'

import {
    type PracticeCollection,
    type PracticeRepository,
    type PracticeSentence
} from './practice-data'
import { createPracticeRouter } from './practice-router'

const collections: PracticeCollection[] = [
    { id: '1', name: 'Default', notes: '' },
    { id: '2', name: 'Bunpro', notes: 'Bunpro examples.' }
]

const sentences: PracticeSentence[] = [{
    id: '7',
    text_eng: 'It is exhausting to study.',
    text_jpn: '勉強するのは疲れる。',
    alternatives_eng: [],
    alternatives_jpn: [],
    notes: '',
    source_name: 'Bunpro',
    source_url: 'https://bunpro.jp/vocabs/%E7%96%B2%E3%82%8C%E3%82%8B',
    source_item: '疲れる',
    jlpt_level: 'N5',
    collection_id: '1',
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z')
}]

const repository: PracticeRepository = {
    async listCollections() {
        return collections
    },
    async collectionExists(collectionId) {
        return collectionId === '1'
    },
    async listSentences(collectionId) {
        return collectionId === '1' ? sentences : []
    }
}

const router = createPracticeRouter(repository)

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
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z'
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

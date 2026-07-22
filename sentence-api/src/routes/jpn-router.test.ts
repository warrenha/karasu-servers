import assert from 'node:assert/strict'
import test from 'node:test'
import { jpnRouter } from './jpn-router'

const request = (body: string) => jpnRouter.request('http://localhost/furigana', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body
})

test('rejects a missing sentence', async () => {
    const response = await request('{}')

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), { error: 'sentence must be a non-empty string.' })
})

test('rejects malformed JSON', async () => {
    const response = await request('{')

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), { error: 'Request body must be valid JSON.' })
})

test('returns furigana parts for a Japanese sentence', async () => {
    const response = await request(JSON.stringify({ sentence: '勉強する' }))

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), [
        { text: '勉強', pos: 'noun', hiragana: 'べんきょう' },
        { text: 'する', pos: 'verb' }
    ])
})

import assert from 'node:assert/strict'
import test from 'node:test'

import { isPositiveInteger, parseSentence } from './practice-validate'

test('identifies positive integer path values', () => {
    assert.equal(isPositiveInteger('1'), true)
    assert.equal(isPositiveInteger('42'), true)
    assert.equal(isPositiveInteger('0'), false)
    assert.equal(isPositiveInteger('-1'), false)
    assert.equal(isPositiveInteger('1.5'), false)
})

test('normalizes a valid practice sentence', () => {
    assert.deepEqual(parseSentence({
        textEng: ' English text ',
        textJpn: ' 日本語 ',
        alternativesEng: ['Alternative'],
        jlptLevel: 'N5'
    }), {
        textEng: 'English text',
        textJpn: '日本語',
        alternativesEng: ['Alternative'],
        alternativesJpn: [],
        notes: null,
        sourceName: null,
        sourceUrl: null,
        sourceItem: null,
        jlptLevel: 'N5'
    })
})

test('throws the validation message for an invalid practice sentence', () => {
    assert.throws(
        () => parseSentence({ textEng: 'Missing Japanese text' }),
        {
            message: 'Sentence field is invalid: textJpn'
        }
    )
})

test('identifies the invalid optional sentence field', () => {
    assert.throws(
        () => parseSentence({
            textEng: 'English text',
            textJpn: '日本語',
            alternativesEng: 'Not an array'
        }),
        {
            message: 'Sentence field is invalid: alternativesEng'
        }
    )
})

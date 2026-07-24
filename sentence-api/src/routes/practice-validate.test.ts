import assert from 'node:assert/strict'
import test from 'node:test'

import { parseSentence } from './practice-validate'

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

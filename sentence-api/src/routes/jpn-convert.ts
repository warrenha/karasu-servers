import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import kuromoji from 'kuromoji'
import { toHiragana } from 'wanakana'
import type { IpadicFeatures, Tokenizer } from 'kuromoji'

// Use Node's normal package resolution for the dictionary path.
const require = createRequire(import.meta.url)
const dicPath = join(dirname(require.resolve('kuromoji/package.json')), 'dict')

export type SpeechPart = {
    text: string
    pos: string  // Part of speech
    hiragana?: string | null
    baseForm?: string
}

// Translate the POS (part of speech) returned by Kuromoji.
const PartOfSpeechTranslation: Record<string, string> = {
    '名詞': 'noun',
    '動詞': 'verb',
    '助詞': 'particle',
    '形容詞': 'adjective',
    '副詞': 'adverb',
    '助動詞': 'auxiliary verb',
    '接続詞': 'conjunction',
    '感動詞': 'interjection',
    '連体詞': 'pre-noun adjectival',
    '接頭詞': 'prefix',
    '記号': 'symbol',
    'その他': 'other',
    'フィラー': 'filler'
}

// Wrap Kuromoji's callback-based build method in a promise for top-level await.
const tokenizer = await new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
    console.info('Initializing Kuromoji tokenizer...')
    kuromoji.builder({ dicPath }).build((error, createdTokenizer) => {
        if (error) {
            console.error('Unable to initialize Kuromoji tokenizer', error)
            reject(error)
            return
        }
        console.info('Kuromoji tokenizer ready')
        resolve(createdTokenizer)
    })
})

const textToTokens = (text: string): IpadicFeatures[] => (
    tokenizer.tokenize(text)
)

const tokenToPart = (token: IpadicFeatures): SpeechPart => {
    const text = token.surface_form  // string
    const pos = PartOfSpeechTranslation[token.pos] ?? 'Unknown'
    const hiragana = token.reading ? toHiragana(token.reading) : null
    const baseForm = token.basic_form || null

    const part: SpeechPart = { text, pos }

    if (!!hiragana && (hiragana !== text)) {
        part.hiragana = hiragana
    }
    if (!!baseForm && (baseForm !== text)) {
        part.baseForm = baseForm
    }
    return part
}

/*
 * Converts a Japanese sentence or text to furigana. Example:
 *
 * '勉強するのは疲れる' ->
 * [
 *   {"text": "勉強", "pos": "Noun", "hiragana": "べんきょう"},
 *   {"text": "する", "pos": "Verb"},
 *   {"text": "の", "pos": "Noun"},
 *   {"text": "は", "pos": "Particle"},
 *   {"text": "疲れる", "pos": "Verb", "hiragana": "つかれる"}
 * ]
 */
export const jpnToFurigana = async (
    textJpn: string
): Promise<SpeechPart[]> => {
    const tokens = textToTokens(textJpn)  // IpadicFeatures[]

    const parts = tokens.map(tokenToPart)  // SpeechPart[]

    console.info(`Converted ${textJpn.length} characters into ${parts.length} parts`)
    return parts
}

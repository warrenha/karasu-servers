import kuromoji from 'kuromoji'
import { toHiragana } from 'wanakana'
import type { IpadicFeatures } from "kuromoji"

// Path to the dictionary files inside your node_modules
const dicPath = "node_modules/kuromoji/dict"

type SpeechPart = {
    text: string,
    partOfSpeech: string,
    katakana?: string | null,  // If different to 'text'
    hiragana?: string | null,  // If different to 'text'
    baseForm?: string  // If different to 'text'
}

const POS_TRANSLATION_MAP: Record<string, string> = {
    "名詞": "Noun",
    "動詞": "Verb",
    "助詞": "Particle",
    "形容詞": "Adjective", // i-adjectives like おいしい
    "副詞": "Adverb",
    "助動詞": "Auxiliary Verb", // e.g., masu endings or copula forms
    "接続詞": "Conjunction",
    "感動詞": "Interjection",
    "連体詞": "Pre-noun Adjectival", // Words that only modify nouns, like この
    "接頭詞": "Prefix",
    "記号": "Symbol", // Punctuation like 。 or 、
    "その他": "Other",
    "フィラー": "Filler" // Speech pauses like "ええと"
}

//const sentence = "勉強するのは疲れる"

const tokenizeSentence = (text: string): Promise<IpadicFeatures[]> => {
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath }).build((err, tokenizer) => {
            if (err) return reject(err)
            
            const tokens = tokenizer.tokenize(text)
            resolve(tokens)
        })
    })
}

export const convertToken = (token: IpadicFeatures) => {
    // The actual text in the sentence, "疲れた"
    const text = token.surface_form
    console.log(`Text: ${text}`)

    // The 'dictionary form' of the word, "疲れる"
    const baseForm = token.basic_form

    // Katakana reading
    const katakana = token.reading ? token.reading : null

    // Convert to Hiragana safely
    const hiragana = token.reading ? toHiragana(token.reading) : null
        
    // Part of speech (Noun, Verb, Particle, etc.)
    const partOfSpeech = token.pos;

    // 1. Look up the translation, fallback to "Unknown" if not in the map
    const englishPos = POS_TRANSLATION_MAP[token.pos] || "Unknown"

    const obj: SpeechPart = {
        text,
        partOfSpeech: englishPos
    }
    if (hiragana !== text) {
        obj.hiragana = hiragana
        obj.katakana = katakana
    }
    if (baseForm !== text) {
        obj.baseForm = baseForm
    }

    console.log(`Obj: ${JSON.stringify(obj)}`)
    return obj
}

export const convertToFurigana = async (sentence: string) => {
    try {
        console.log(`Sentence: ${sentence}`)

        const rawTokens = await tokenizeSentence(sentence)

        // Map the tokens to a clean, useful JSON format
        const array = rawTokens.map(convertToken)

        console.log(`Array: ${JSON.stringify(array, null, 2)}`)
        return array
    }
    catch (error) {
        console.error("Error tokenizing text:", error)
        throw error
    }
}

/*
 * "勉強するのは疲れる"
 *
 * [
 *   {
 *     "text": "勉強",
 *     "partOfSpeech": "名詞",
 *     "katakana": "ベンキョウ",
 *     "hiragana": "べんきょう",
 *     "baseForm": "勉強"
 *   },
 *   {
 *     "text": "する",
 *     "partOfSpeech": "動詞"
 *   },
 *   {
 *     "text": "の",
 *     "partOfSpeech": "名詞"
 *   },
 *   {
 *     "text": "は",
 *     "partOfSpeech": "助詞"
 *   },
 *   {
 *     "text": "疲れる",
 *     "partOfSpeech": "動詞",
 *     "katakana": "ツカレル",
 *     "hiragana": "つかれる",
 *     "baseForm": "疲れる"
 *   }
 * ]
 */

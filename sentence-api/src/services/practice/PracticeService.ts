import { Pool } from 'pg'

import type {
    BasicPracticeSentence, PracticeCollection, PracticeSentence
} from './PracticeTypes'

export type PracticeService = {
    listCollections: () => Promise<PracticeCollection[]>
    collectionExists: (collectionId: string) => Promise<boolean>
    listSentences: (collectionId: string) => Promise<PracticeSentence[]>
    addSentence: (
        collectionId: string,
        sentence: BasicPracticeSentence
    ) => Promise<PracticeSentence>
}

// The pools are shared by all requests for the lifetime of the server.
const readPool = new Pool({
    connectionString: process.env.DATABASE_URL_JPN_RO
})
const writePool = new Pool({
    connectionString: process.env.DATABASE_URL_JPN
})

export const practiceService: PracticeService = {
    async listCollections() {
        const result = await readPool.query<PracticeCollection>(`
            SELECT id, name, notes
            FROM practice.collections
            ORDER BY name, id
        `)
        return result.rows
    },

    async collectionExists(collectionId) {
        const result = await readPool.query(`
            SELECT 1
            FROM practice.collections
            WHERE id = $1
        `, [collectionId])
        return result.rowCount === 1
    },

    async listSentences(collectionId) {
        const result = await readPool.query<PracticeSentence>(`
            SELECT
                id,
                text_eng AS "textEng",
                text_jpn AS "textJpn",
                alternatives_eng AS "alternativesEng",
                alternatives_jpn AS "alternativesJpn",
                notes,
                source_name AS "sourceName",
                source_url AS "sourceUrl",
                source_item AS "sourceItem",
                jlpt_level AS "jlptLevel",
                collection_id AS "collectionId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM practice.sentences
            WHERE collection_id = $1
            ORDER BY id
        `, [collectionId])
        return result.rows
    },

    async addSentence(collectionId, sentence) {
        const result = await writePool.query<PracticeSentence>(`
            INSERT INTO practice.sentences (
                text_eng,
                text_jpn,
                alternatives_eng,
                alternatives_jpn,
                notes,
                source_name,
                source_url,
                source_item,
                jlpt_level,
                collection_id
            )
            VALUES ($1, $2, $3, $4, COALESCE($5, ''), $6, $7, $8, $9, $10)
            RETURNING
                id,
                text_eng AS "textEng",
                text_jpn AS "textJpn",
                alternatives_eng AS "alternativesEng",
                alternatives_jpn AS "alternativesJpn",
                notes,
                source_name AS "sourceName",
                source_url AS "sourceUrl",
                source_item AS "sourceItem",
                jlpt_level AS "jlptLevel",
                collection_id AS "collectionId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `, [
            sentence.textEng,
            sentence.textJpn,
            sentence.alternativesEng,
            sentence.alternativesJpn,
            sentence.notes,
            sentence.sourceName,
            sentence.sourceUrl,
            sentence.sourceItem,
            sentence.jlptLevel,
            collectionId
        ])

        const createdSentence = result.rows[0]
        if (!createdSentence) {
            throw new Error('PostgreSQL did not return the created sentence.')
        }
        return createdSentence
    }
}

import { Pool } from 'pg'

import type { PracticeCollection, PracticeSentence } from './PracticeTypes'

export type PracticeService = {
    listCollections: () => Promise<PracticeCollection[]>
    collectionExists: (collectionId: string) => Promise<boolean>
    listSentences: (collectionId: string) => Promise<PracticeSentence[]>
}

// One pool is shared by all requests for the lifetime of the server.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_JPN_RO
})

export const practiceService: PracticeService = {
    async listCollections() {
        const result = await pool.query<PracticeCollection>(`
            SELECT id, name, notes
            FROM practice.collections
            ORDER BY name, id
        `)
        return result.rows
    },

    async collectionExists(collectionId) {
        const result = await pool.query(`
            SELECT 1
            FROM practice.collections
            WHERE id = $1
        `, [collectionId])
        return result.rowCount === 1
    },

    async listSentences(collectionId) {
        const result = await pool.query<PracticeSentence>(`
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
    }
}

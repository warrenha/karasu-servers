import { Pool } from 'pg'

import {
    type PracticeCollection,
    type PracticeSentence
} from './PracticeTypes'

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
                text_eng,
                text_jpn,
                alternatives_eng,
                alternatives_jpn,
                notes,
                source_name,
                source_url,
                source_item,
                jlpt_level,
                collection_id,
                created_at,
                updated_at
            FROM practice.sentences
            WHERE collection_id = $1
            ORDER BY id
        `, [collectionId])
        return result.rows
    }
}

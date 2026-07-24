import { Pool } from 'pg'

export type PracticeCollection = {
    id: string
    name: string
    notes: string
}

export type PracticeSentence = {
    id: string
    text_eng: string
    text_jpn: string
    alternatives_eng: string[]
    alternatives_jpn: string[]
    notes: string
    source_name: string | null
    source_url: string | null
    source_item: string | null
    jlpt_level: string | null
    collection_id: string
    created_at: Date
    updated_at: Date
}

export type PracticeRepository = {
    listCollections: () => Promise<PracticeCollection[]>
    collectionExists: (collectionId: string) => Promise<boolean>
    listSentences: (collectionId: string) => Promise<PracticeSentence[]>
}

// One pool is shared by all requests for the lifetime of the server.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_JPN_RO
})

export const practiceRepository: PracticeRepository = {
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

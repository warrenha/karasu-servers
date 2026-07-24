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

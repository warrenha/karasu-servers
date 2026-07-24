export type PracticeCollection = {
    id: string
    name: string
    notes: string
}

export type PracticeSentence = {
    id: string
    textEng: string
    textJpn: string
    alternativesEng: string[]
    alternativesJpn: string[]
    notes: string
    sourceName: string | null
    sourceUrl: string | null
    sourceItem: string | null
    jlptLevel: string | null
    collectionId: string
    createdAt: Date
    updatedAt: Date
}

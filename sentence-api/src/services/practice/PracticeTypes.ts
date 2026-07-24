export type PracticeCollection = {
    id: string
    name: string
    notes: string
}

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type BasicPracticeSentence = {
    textEng: string
    textJpn: string
    alternativesEng: string[]
    alternativesJpn: string[]
    notes: string | null
    sourceName: string | null
    sourceUrl: string | null
    sourceItem: string | null
    jlptLevel: JlptLevel | null
}

export type PracticeSentence = BasicPracticeSentence & {
    id: string
    collectionId: string
    createdAt: Date
    updatedAt: Date
}

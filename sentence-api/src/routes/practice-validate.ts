import type { BasicPracticeSentence, JlptLevel } from '@/services/practice'

const JLPT_LEVELS = new Set<JlptLevel>(['N5', 'N4', 'N3', 'N2', 'N1'])
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/

const isStringArray = (value: unknown): value is string[] => (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
)

const isOptionalStringArray = (value: unknown): value is string[] | undefined => (
    value === undefined || isStringArray(value)
)

const isOptionalString = (value: unknown): value is string | null | undefined => (
    value === undefined || value === null || typeof value === 'string'
)

const isRequiredString = (value: unknown): value is string => (
    typeof value === 'string' && !!value.trim()
)

const isOptionalSetValue = <Value extends string>(
    allowedValues: ReadonlySet<Value>,
    value: unknown
): value is Value | null | undefined => (
    value === undefined
    || value === null
    || (
        typeof value === 'string'
        && allowedValues.has(value as Value)
    )
)

const invalidField = (field: string): Error => (
    new Error(`Sentence field is invalid: ${field}`)
)

export const isPositiveInteger = (value: string): boolean => (
    POSITIVE_INTEGER_PATTERN.test(value)
)

export const parseSentence = (body: unknown): BasicPracticeSentence => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new Error('Sentence body must be an object.')
    }

    const fields = body as Record<string, unknown>
    if (!isRequiredString(fields.textEng)) {
        throw invalidField('textEng')
    }
    if (!isRequiredString(fields.textJpn)) {
        throw invalidField('textJpn')
    }
    if (!isOptionalStringArray(fields.alternativesEng)) {
        throw invalidField('alternativesEng')
    }
    if (!isOptionalStringArray(fields.alternativesJpn)) {
        throw invalidField('alternativesJpn')
    }
    if (!isOptionalString(fields.notes)) {
        throw invalidField('notes')
    }
    if (!isOptionalString(fields.sourceName)) {
        throw invalidField('sourceName')
    }
    if (!isOptionalString(fields.sourceUrl)) {
        throw invalidField('sourceUrl')
    }
    if (!isOptionalString(fields.sourceItem)) {
        throw invalidField('sourceItem')
    }
    if (!isOptionalSetValue(JLPT_LEVELS, fields.jlptLevel)) {
        throw invalidField('jlptLevel')
    }

    const textEng = fields.textEng.trim()
    const textJpn = fields.textJpn.trim()
    const alternativesEng = fields.alternativesEng ?? []
    const alternativesJpn = fields.alternativesJpn ?? []
    const notes = fields.notes ?? null
    const sourceName = fields.sourceName ?? null
    const sourceUrl = fields.sourceUrl ?? null
    const sourceItem = fields.sourceItem ?? null
    const jlptLevel = fields.jlptLevel ?? null

    return {
        textEng,
        textJpn,
        alternativesEng: alternativesEng as string[],
        alternativesJpn: alternativesJpn as string[],
        notes: notes as string | null,
        sourceName: sourceName as string | null,
        sourceUrl: sourceUrl as string | null,
        sourceItem: sourceItem as string | null,
        jlptLevel: jlptLevel as JlptLevel | null
    }
}

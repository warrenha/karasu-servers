CREATE SCHEMA IF NOT EXISTS practice;

CREATE TABLE practice.sentences (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text_eng text NOT NULL CHECK (btrim(text_eng) <> ''),
    text_jpn text NOT NULL CHECK (btrim(text_jpn) <> ''),
    alternatives_eng text[] NOT NULL DEFAULT '{}',
    alternatives_jpn text[] NOT NULL DEFAULT '{}',
    notes text NOT NULL DEFAULT '',
    source_name text,
    source_url text,
    source_item text,
    jlpt_level text CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE practice.sentences IS
    'Japanese sentences and accepted translations for typing practice.';
COMMENT ON COLUMN practice.sentences.source_item IS
    'Vocabulary or grammar item associated with the source sentence.';

CREATE TABLE practice.words (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    word_jpn text NOT NULL CHECK (btrim(word_jpn) <> ''),
    meaning_eng text NOT NULL CHECK (btrim(meaning_eng) <> ''),
    reading text,
    UNIQUE NULLS NOT DISTINCT (word_jpn, meaning_eng, reading)
);

COMMENT ON TABLE practice.words IS
    'Japanese words and their English meanings, reusable across sentences.';

CREATE TABLE practice.sentence_highlights (
    sentence_id bigint NOT NULL REFERENCES practice.sentences(id) ON DELETE CASCADE,
    word_id bigint NOT NULL REFERENCES practice.words(id) ON DELETE CASCADE,
    PRIMARY KEY (sentence_id, word_id)
);

CREATE INDEX sentence_highlights_word_id_idx
    ON practice.sentence_highlights (word_id);

COMMENT ON TABLE practice.sentence_highlights IS
    'Links sentences to their highlighted words.';

CREATE FUNCTION practice.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER sentences_set_updated_at
BEFORE UPDATE ON practice.sentences
FOR EACH ROW
EXECUTE FUNCTION practice.set_updated_at();

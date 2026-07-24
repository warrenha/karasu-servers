CREATE TABLE practice.collections (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL CHECK (btrim(name) <> ''),
    notes text NOT NULL DEFAULT ''
);

COMMENT ON TABLE practice.collections IS
    'Named groups used to organise practice sentences.';
COMMENT ON COLUMN practice.collections.notes IS
    'General notes about the collection.';

ALTER TABLE practice.sentences
    ADD COLUMN collection_id bigint
        REFERENCES practice.collections(id) ON DELETE SET NULL;

CREATE INDEX sentences_collection_id_idx
    ON practice.sentences (collection_id);

COMMENT ON COLUMN practice.sentences.collection_id IS
    'Optional collection containing the sentence.';

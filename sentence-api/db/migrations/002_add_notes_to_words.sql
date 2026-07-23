ALTER TABLE practice.words
    ADD COLUMN notes text NOT NULL DEFAULT '';

COMMENT ON COLUMN practice.words.notes IS
    'General notes about the word, such as usage or distinctions between meanings.';

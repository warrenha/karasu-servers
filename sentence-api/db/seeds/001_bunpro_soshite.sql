BEGIN;

-- Bunpro's second example sentence for the vocabulary item そして.
UPDATE practice.sentences
SET collection_id = (
    SELECT id
    FROM practice.collections
    WHERE name = 'Default'
    ORDER BY id
    LIMIT 1
)
WHERE source_url = 'https://bunpro.jp/vocabs/%E3%81%9D%E3%81%97%E3%81%A6'
  AND text_jpn = '暗くなった。そして雨が降り始めた。';

WITH inserted_sentence AS (
    INSERT INTO practice.sentences (
        text_eng,
        text_jpn,
        source_name,
        source_url,
        source_item,
        jlpt_level,
        collection_id
    )
    SELECT
        'It got dark. Then it started to rain.',
        '暗くなった。そして雨が降り始めた。',
        'Bunpro',
        'https://bunpro.jp/vocabs/%E3%81%9D%E3%81%97%E3%81%A6',
        'そして',
        'N5',
        (
            SELECT id
            FROM practice.collections
            WHERE name = 'Default'
            ORDER BY id
            LIMIT 1
        )
    WHERE NOT EXISTS (
        SELECT 1
        FROM practice.sentences
        WHERE source_url = 'https://bunpro.jp/vocabs/%E3%81%9D%E3%81%97%E3%81%A6'
          AND text_jpn = '暗くなった。そして雨が降り始めた。'
    )
    RETURNING id
), existing_sentence AS (
    SELECT id
    FROM practice.sentences
    WHERE source_url = 'https://bunpro.jp/vocabs/%E3%81%9D%E3%81%97%E3%81%A6'
      AND text_jpn = '暗くなった。そして雨が降り始めた。'
), sentence AS (
    SELECT id FROM inserted_sentence
    UNION ALL
    SELECT id FROM existing_sentence
    LIMIT 1
), word AS (
    INSERT INTO practice.words (word_jpn, meaning_eng, reading)
    VALUES ('そして', 'then; and then', 'そして')
    ON CONFLICT (word_jpn, meaning_eng, reading)
    DO UPDATE SET word_jpn = EXCLUDED.word_jpn
    RETURNING id
)
INSERT INTO practice.sentence_highlights (sentence_id, word_id)
SELECT sentence.id, word.id
FROM sentence
CROSS JOIN word
ON CONFLICT DO NOTHING;

COMMIT;

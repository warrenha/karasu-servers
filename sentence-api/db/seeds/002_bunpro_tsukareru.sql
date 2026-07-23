BEGIN;

-- Bunpro's first example sentence for the vocabulary item 疲れる.
WITH inserted_sentence AS (
    INSERT INTO practice.sentences (
        text_eng,
        text_jpn,
        source_name,
        source_url,
        source_item,
        jlpt_level
    )
    SELECT
        'It is exhausting to study.',
        '勉強するのは疲れる。',
        'Bunpro',
        'https://bunpro.jp/vocabs/%E7%96%B2%E3%82%8C%E3%82%8B',
        '疲れる',
        'N5'
    WHERE NOT EXISTS (
        SELECT 1
        FROM practice.sentences
        WHERE source_url = 'https://bunpro.jp/vocabs/%E7%96%B2%E3%82%8C%E3%82%8B'
          AND text_jpn = '勉強するのは疲れる。'
    )
    RETURNING id
), existing_sentence AS (
    SELECT id
    FROM practice.sentences
    WHERE source_url = 'https://bunpro.jp/vocabs/%E7%96%B2%E3%82%8C%E3%82%8B'
      AND text_jpn = '勉強するのは疲れる。'
), sentence AS (
    SELECT id FROM inserted_sentence
    UNION ALL
    SELECT id FROM existing_sentence
    LIMIT 1
), word AS (
    INSERT INTO practice.words (word_jpn, meaning_eng, reading)
    VALUES ('疲れる', 'to get tired; to tire', 'つかれる')
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

BEGIN;

INSERT INTO practice.collections (name)
SELECT 'Default'
WHERE NOT EXISTS (
    SELECT 1
    FROM practice.collections
    WHERE name = 'Default'
);

COMMIT;

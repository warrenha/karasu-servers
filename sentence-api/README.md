

# Running (Dev Server)
```bash
% pnpm dev
```
```bash
% curl http://localhost:3000/hello/Bob
{"message":"Hello Bob"}
```

## Furigana API

```bash
% curl -X POST http://localhost:3000/jpn/furigana \\
  -H 'content-type: application/json' \\
  -d '{"sentence":"勉強するのは疲れる"}'
```

The endpoint accepts a non-empty `sentence` of up to 1,000 characters and returns an array of token objects. Run `pnpm test` for endpoint checks and `pnpm typecheck` before changes.

## Practice API

Set `DATABASE_URL_JPN_RO` to the `jpnrouser` PostgreSQL connection string. The
practice endpoints use this read-only connection. List collections with:

```bash
curl http://localhost:3000/jpn/practice/collections
```

List the sentences in a collection with:

```bash
curl http://localhost:3000/jpn/practice/collections/1/sentences
```

## Database

Use `DATABASE_URL_JPN` for the write-capable `jpnuser` connection and
`DATABASE_URL_JPN_RO` for the read-only `jpnrouser` connection.

The PostgreSQL setup scripts are in `db/`. Create the database while connected as a database administrator, then run the migration against it:

```bash
  psql -d postgres -f db/create-database.sql

  -- or
  createdb -h ontan.local -U postgres jpn

  psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/migrations/001_create_practice_sentences.sql
  psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/migrations/002_add_notes_to_words.sql
  psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/migrations/003_add_collections.sql
```

To create the read-only `jpnrouser` login, run this as a PostgreSQL administrator. The script prompts securely for its password:

```bash
psql -h ontan.local -U postgres -d jpn -v ON_ERROR_STOP=1 -f db/create-read-only-user.sql
```

Create the `Default` collection before loading the example sentences:

```bash
psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/seeds/000_default_collection.sql
```

Seed Bunpro's second `そして` example sentence into that collection with:

```bash
psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/seeds/001_bunpro_soshite.sql
```

Seed Bunpro's `疲れる` example sentence into that collection with:

```bash
psql "$DATABASE_URL_JPN" -v ON_ERROR_STOP=1 -f db/seeds/002_bunpro_tsukareru.sql
```

Practice sentences are stored in `practice.sentences`. English and Japanese alternatives are PostgreSQL `text[]` columns. The table also stores optional source metadata (`source_name`, `source_url`, `source_item`), an optional `jlpt_level`, and a general `notes` field. Sentences can optionally belong to a named entry in `practice.collections`; deleting a collection leaves its sentences in place and clears their `collection_id`. Reusable highlighted words are in `practice.words`, with their own optional `notes`, and linked to sentences through `practice.sentence_highlights`.

```sql
INSERT INTO practice.collections (name, notes)
VALUES ('Bunpro examples', 'Sentences collected from Bunpro.');

UPDATE practice.sentences
SET collection_id = 1
WHERE id = 1;

INSERT INTO practice.words (word_jpn, meaning_eng)
VALUES ('そして', 'then; and then');

INSERT INTO practice.sentence_highlights (sentence_id, word_id)
VALUES (1, 1);
```


# Project Initialization
```bash
$ pnpm init
$ pnpm add hono @hono/node-server
$ pnpm add -D typescript tsx tsdown @types/node
```

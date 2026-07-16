# PostgreSQL Database

## Purpose

This skill helps query the project's PostgreSQL/PostGIS database.

The database contains roads in Bristol, UK.

## Connection

Use:

```bash
psql "$DATABASE_URL_GIS_RO"
```

The database user is read-only. For multi-statement investigations, begin with
`BEGIN READ ONLY;`.

Never issue:

- INSERT
- UPDATE
- DELETE
- DROP
- ALTER
- CREATE
- SELECT INTO

## Schema

Only use the `osm` schema.

Always inspect the schema first if uncertain.

Useful commands:

\dt osm.*
\d osm.planet_osm_roads

## Guidelines

When generating SQL:

- Qualify schemas
- Prefer explicit JOINs.
- Use EXPLAIN before expensive queries if appropriate.
- Never attempt INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, SELECT INTO, or
  other data-definition or data-modification statements.
- For `SELECT` queries, use `LIMIT 100` by default unless the user requests all
  rows.
- Use PostGIS functions where appropriate.


## Examples

Find Bristol roads whose name contains “Park Street”:

```sql
SELECT osm_id, name, highway, ST_AsGeoJSON(way) AS geometry
  FROM osm.planet_osm_roads
 WHERE name ILIKE '%Park Street%'
 ORDER BY name, osm_id
 LIMIT 100;
```

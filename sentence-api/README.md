

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


# Project Initialization
```bash
$ pnpm init
$ pnpm add hono @hono/node-server
$ pnpm add -D typescript tsx tsdown @types/node
```

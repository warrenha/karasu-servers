# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`. `src/server.ts` starts the Node server, while `src/app.ts` configures the shared Hono app, middleware, and route mounting. Keep route handlers in `src/routes/`; use a `*-router.ts` file for an endpoint group and place supporting domain logic beside it (for example, `jpn-convert.ts`). Build output is generated in `dist/` and must not be edited directly.

## Build, Test, and Development Commands

- `pnpm dev` — run the API with `tsx` watch mode on port 3000.
- `pnpm typecheck` — run TypeScript validation without emitting files.
- `pnpm build` — bundle `src/server.ts` as ESM into `dist/`.
- `pnpm start` — run the built server (`pnpm build` first).

After starting locally, smoke-test a route with `curl http://localhost:3000/hello/Bob`. Use pnpm (the repository declares `pnpm@10.31.0`) rather than npm or yarn for dependency changes.

## Coding Style & Naming Conventions

- Write strict, ESM TypeScript.
- Follow the surrounding code: four-space indentation, single-quoted imports and ordinary strings, and concise arrow-function handlers.
- Use the `@/*` TypeScript path alias for imports outside the current directory tree, for example `@/services/practice`.
- Use relative paths only for modules in the same directory or a child directory; do not use parent-relative (`../`) imports.
- Name route modules in kebab case (`hello-router.ts`), exported routers in camel case (`helloRouter`), and types in PascalCase (`SpeechPart`).
- When assigning a non-trivial computed value to an object field, declare it as a named `const` immediately before constructing the object—for example, `const partOfSpeech = POS_TRANSLATION_MAP[token.pos] ?? 'Unknown'` before `{ text, partOfSpeech }`.
- Add short comments at meaningful code boundaries to explain intent or lifecycle decisions that are not obvious from the code, such as why a module-level promise creates one reusable tokenizer.
- Keep HTTP wiring in router files and extract parsing or conversion work into focused helper modules.
- Run `pnpm typecheck` before submitting changes.

## Testing Guidelines

Tests use Node's built-in test runner through `tsx`; run them with `pnpm test`. Add colocated `*.test.ts` files for behavior changes, such as `src/routes/jpn-router.test.ts`. At minimum, run `pnpm typecheck`, `pnpm test`, and exercise affected endpoints with `curl`; cover valid responses and malformed or missing input.

## Commit & Pull Request Guidelines

Recent history uses short, imperative-style summaries such as `Added jpn -> furigana` and `Added CORS support for Hono`. Keep commits focused and describe the user-visible change. Pull requests should state the problem and solution, list verification commands, link any relevant issue, and include request/response examples for API changes. Call out CORS, port, dependency, or dictionary-path changes explicitly because they affect deployment and local setup.

## Configuration & Security

Do not broaden `allowedOrigins` in `src/app.ts` without a concrete deployment need. Keep secrets out of source control; add documented environment-based configuration if the service begins to require credentials or environment-specific values.

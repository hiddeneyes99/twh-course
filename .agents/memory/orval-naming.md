---
name: Orval schema naming conflict
description: How Orval generates names and how barrel exports cause duplicates
---
Orval generates Zod schema names from operationIds (e.g. `generateQuiz` → `GenerateQuizResponse`),
AND separately generates TypeScript types in `generated/types/` with the same names derived from component schema names.
When the component schema name matches the operationId-derived name, both `generated/api.ts` and `generated/types/`
export the same identifier, causing a TS duplicate export error in the barrel `index.ts`.

**Why:** lib/api-zod/src/index.ts does `export * from "./generated/api"` AND `export * from "./generated/types"`.

**How to apply:** If codegen produces duplicate export errors, rename the conflicting component schemas in openapi.yaml
to names that don't match the auto-derived operationId names (e.g. `QuizQuestionsPayload` instead of `GenerateQuizResponse`).
The Zod schema in api.ts will still be named by operationId — use THOSE names (e.g. `GenerateQuizResponse`, `SubmitQuizBody`)
when importing in server code.

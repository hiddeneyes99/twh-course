---
name: Quiz route architecture
description: How the AI quiz route works in this project
---
Quiz route: artifacts/api-server/src/routes/quiz.ts
- Gemini API: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
- In-memory Map (quizCache) stores correct answers between generate and submit calls
- Pass threshold: 70% correct → auto-inserts into progressTable
- If cache miss on submit, re-generates questions from Gemini
- React Query v5: do NOT use onSuccess in query options — use useEffect watching isSuccess instead

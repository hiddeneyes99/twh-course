# Quiz Question Rewrite — AI Continuation Guide

## Project kya hai

**CYBER_TRACK IT Training Tracker** — ek cybersecurity training web app jo IT team ke liye banaya gaya hai. App mein 113 modules hain across 12 phases (Phase 1: Computer Basics se Phase 12: Bug Bounty tak). Har module ke liye quiz questions hain.

## Mujhe kya karna hai

`artifacts/it-training-tracker/src/data/staticQuizQuestions.ts` file mein har module ke quiz questions rewrite karne hain. **Main khud (AI) curriculum analyze karke questions likhta hoon** — koi AI API, koi Gemini call nahi.

**Old questions**: har module mein sirf 5 generic questions the, jo shallow the.

**New questions**: Curriculum description se har concept dhundho, uski depth ke hisaab se jitna bhi caho question rakh sakte ho strategic questions likho.

## Curriculum kahan milta hai

```
artifacts/api-server/src/lib/curriculum.ts
```

Har entry format:
```typescript
{ id: "net-01", phase: "Phase 2", title: "...", description: "..." }
```

**Description mein comma-separated concepts hote hain** — inhe individually count karo → decide karo kitne questions likhne hain.

## Question format (strict)

File: `artifacts/it-training-tracker/src/data/staticQuizQuestions.ts`

Interface:
```typescript
export interface QuizQuestion {
  question: string;
  options: string[];   // EXACTLY 4 options
  correctIndex: number; // 0, 1, 2, ya 3
  explanation: string;
}
```

Pattern jo file mein use hoti hai:
```typescript
"module-id": [
  { question: "...", options: ["...", "...", "...", "..."], correctIndex: N, explanation: "..." },
  // ...
],
```

## Language style — Hinglish

- Questions aur explanations **Hinglish** mein likhte hain (Hindi + English mix)
- Technical terms hamesha English mein: "ARP Poisoning", "buffer overflow", "kernel", "SUID bit", etc.
- Casual Hindi words use karo: "kya hai", "kyun", "kaise", "matlab", "matlab yeh ki", "seedha nahi", etc.
- Explanations mein real-world attacks, tools, CVEs mention karo jahan relevant ho

## Question design philosophy — 5 types

Har module ke questions mein in 5 types ka mix hona chahiye:

1. **Factual** — "X kya hai?" / "Port number kya hai?"
2. **Mechanism** — "X kaise kaam karta hai?" / "Exactly kya hota hai jab...?"
3. **Security implication** — "X kyun dangerous hai?" / "Attacker X se kya achieve karta hai?"
4. **Comparison** — "X aur Y mein kya fark hai?"
5. **Attack/defense scenario** — "X attack ke against defense kya hai?" / "Real-world mein X kaise use hota hai?"

## correctIndex distribution — vary karo

**Sab answers index 1 pe mat rakho** — suspicious lagta hai aur boring bhi.

Roughly: index 0 = 20%, index 1 = 40%, index 2 = 25%, index 3 = 15% chahiye overall.

Wrong options plausible hone chahiye — sirf random nonsense mat likho.

## Question count per module

Curriculum description ke concepts count karo:
- ~5-7 concepts → 8 questions
- ~8-10 concepts → 10 questions  
- ~11+ concepts → 11-12 questions matlab jitna chaho tum rakh sakte ho jaise 20 me aur 25 bhi apne hisab se question rakho

## Current status

| Phase | Modules | Status |
|-------|---------|--------|
| Phase 1: Computer Basics | cb-01 to cb-08 | ✅ DONE |
| Phase 2: Networking | net-01 to net-12 | ✅ DONE |
| Phase 3: Operating System | os-01 to os-09 | ❌ TODO |
| Phase 4: Programming | prog-01 to prog-06 | ✅ DONE |
| Phase 4: Programming | prog-07 to prog-09 | ✅ DONE (July 8 2026) |
| Phase 5: Web | web-01 to web-09 | ❌ TODO |
| Phase 6: Security | sec-01 to sec-08 | ✅ DONE (July 8 2026) |
| Phase 7: Ethical Hacking | eth-01 to eth-09 | ❌ TODO |
| Phase 8: AI Security | ai-01 to ai-06 | ❌ TODO |
| Phase 9: Red Team | red-01 to red-09 | ❌ TODO |
| Phase 10: Blue Team | blue-01 to blue-09 | ❌ TODO |
| Phase 11: Advanced | adv-01 to adv-05 | ❌ TODO |
| Phase 12: Bug Bounty | bb-01 to bb-07 | ✅ DONE (July 8 2026) — 5→15/18/15/17/15/15/15 questions |

**Next up: Phase 3 OS (os-01 to os-09), Phase 5 Web (web-01 to web-09), Phases 7–11**

## Completed phases status

| Phase | Modules | Status |
|-------|---------|--------|
| Phase 4: Security Fundamentals | sec-01 – sec-08 | ✅ Complete |
| Phase 7: Ethical Hacking | hack-01 – hack-09 | ✅ Complete |
| All others | Phase 1 (comp), 2 (net), 3 (os), 5 (web), 6 (cloud), 8 (ai), 9 (script), 10 (devops), 11 (incident), 12 (bugbounty) | ⏳ Still shallow (5 generic questions each) |

## Workflow — kaise continue karo

1. **`curriculum.ts` padho** — next phase ke modules ki descriptions dekho
2. **Har module ke concepts count karo** → question count decide karo
3. **Questions likho** — 5 types ka mix, Hinglish, 4 options, correctIndex verify karo
4. **`staticQuizQuestions.ts` mein edit karo** — Phase comment se next Phase comment tak replace karo
5. **Verify karo**: `grep -n "correctIndex" artifacts/it-training-tracker/src/data/staticQuizQuestions.ts | head -20` se spot check
6. **Commit karo** har module ke baad

## Strict rules

- **correctIndex ALWAYS verify karo** before writing — options array mein manually count karo (0-indexed)
- **Exactly 4 options** har question mein — na kam, na zyada
- **Factual accuracy** — explanations mein wrong technical claims mat likho
- **No placeholder text** — har explanation meaningful honi chahiye
- **Quotes** — strings mein double-quotes avoid karo ya escape karo (`\"`)

## Example — ek acha question kaisa dikhta hai

```typescript
{ 
  question: "SUID bit set hone pe exactly kya hota hai execution ke time pe?", 
  options: [
    "Sirf root user run kar sakta hai file ko",          // wrong — plausible
    "File execute hone pe owner ke permissions se run hoti hai — root-owned SUID binary = koi bhi user root shell le sakta hai",  // CORRECT
    "File encrypted ho jaati hai",                       // wrong — less plausible
    "File network pe accessible ho jaati hai"            // wrong — less plausible
  ], 
  correctIndex: 1,   // second option = index 1
  explanation: "SUID (Set User ID) bit set hai + file ka owner root hai = koi bhi user execute kare, program root permissions se run hoga. GTFOBins.github.io pe aise binaries listed hain. Enumeration: 'find / -perm -4000 -type f 2>/dev/null'. Real privesc vector." 
}
```

## Files jo matter karte hain

| File | Purpose |
|------|---------|
| `artifacts/it-training-tracker/src/data/staticQuizQuestions.ts` | Quiz questions — yahi edit karo |
| `artifacts/api-server/src/lib/curriculum.ts` | Module descriptions — yahan se concepts nikalte hain |
| `artifacts/it-training-tracker/src/components/quiz-modal.tsx` | Quiz UI — format change nahi karna |
| `artifacts/it-training-tracker/src/pages/learn.tsx` | Learn page — dynamic question count already implemented |

## Phase structure in staticQuizQuestions.ts

```typescript
// ── PHASE N: NAME ──────────────────────────────────────────────────

// module-id analysis: X concepts → Y questions

"module-id": [
  { question: "...", ... },
  // ...
],
```

Editing karte waqt: sirf ek phase ka section replace karo at a time — pure file edit karne ki zaroorat nahi.

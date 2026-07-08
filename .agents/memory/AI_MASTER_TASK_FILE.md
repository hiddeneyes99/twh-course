# CYBER_TRACK — AI Master Task File
*Yeh file ek AI agent ke liye hai. Ek kaam karo, check karo, tab agla karo.*

---

## ⚠️ GOLDEN RULE — EK KAAM EK BAAR

1. **Status table dekho** — pehla ❌ wala task uthao
2. **Sirf wahi kaam karo** — doosre tasks pe haath mat lagao
3. **Status update karo** (❌ → ✅) — jab kaam complete ho
4. **Agli task uthao** — wapas step 1 pe jao

---

## PROJECT CONTEXT

**App:** CYBER_TRACK IT Training Tracker
**Language style:** Hinglish — Hindi + English mix. Technical terms hamesha English mein.
**Total topics:** 125 (sab curriculum aur topicContent mein matched)

**Key files:**
| File | Kaam |
|------|------|
| `artifacts/it-training-tracker/src/data/staticQuizQuestions.ts` | Quiz questions — yahi edit hoga |
| `artifacts/api-server/src/lib/curriculum.ts` | Module descriptions — concepts yahan se nikalo |
| `artifacts/it-training-tracker/src/data/topicContent.ts` | Topic content — naye topics yahan add hote hain |
| `artifacts/api-server/src/lib/curriculum.ts` | Curriculum list — naye modules yahan register hote hain |

---

## TASK STATUS TRACKER

| # | Task | Type | Status |
|---|------|------|--------|
| 1 | net-02 to net-12 quiz rewrite | Quiz | ❌ TODO |
| 2 | ai-01 to ai-06 quiz rewrite | Quiz | ❌ TODO |
| 3 | health-01 to health-06 quiz rewrite | Quiz | ❌ TODO |
| 4 | ai-02 content fix (code explanation) | Content | ❌ TODO |
| 5 | ai-03 content fix (real data + explanation) | Content | ❌ TODO |
| 6 | Naya topic: Indian Cybersecurity Laws | New Topic | ❌ TODO |
| 7 | Naya topic: Git & GitHub Basics | New Topic | ❌ TODO |
| 8 | Naya topic: UPI & Digital Payment Security | New Topic | ❌ TODO |
| 9 | Naya topic: Zero Budget Home Lab (Indian Student) | New Topic | ❌ TODO |

---

---

# TASK 1 — net-02 to net-12 Quiz Rewrite

## Status: ❌ TODO

## Background
`net-02` se `net-12` mein abhi sirf **5 questions** hain har module mein — bahut shallow.
`net-01` already 12 questions hai — woh skip karo.

## Kya karna hai
`artifacts/it-training-tracker/src/data/staticQuizQuestions.ts` mein `"net-02"` se `"net-12"` tak ke sections replace karo. Ek ek module karo — file save karo, fir agla module.

## Concept count (curriculum.ts se)
| Module | Concepts | Target Questions |
|--------|----------|-----------------|
| net-02 | 10 (IPv4, CIDR, subnetting, etc.) | 12-15 |
| net-03 | 14 (ports, protocols) | 14-16 |
| net-04 | 12 (OSI layers + attacks) | 12-15 |
| net-05 | 10 (DNS, records, attacks) | 12-15 |
| net-06 | 8 (HTTP, headers, cookies) | 10-12 |
| net-07 | 16 (Nmap scan types) | 15-18 |
| net-08 | 6 (Wireshark) | 10-12 |
| net-09 | 5 (ARP poisoning, MITM) | 10-12 |
| net-10 | 12 (DoS/DDoS) | 12-15 |
| net-11 | 7 (WiFi security) | 10-12 |
| net-12 | 4 (Tor, proxies) | 8-10 |

## Question format
```typescript
"net-02": [
  { question: "...", options: ["...", "...", "...", "..."], correctIndex: N, explanation: "..." },
  // ...
],
```

## Rules
- Exactly **4 options** har question mein
- `correctIndex` manually verify karo (0-based)
- **Hinglish** — "IPv4 ka private range kaunsa hai?" style
- 5 types ka mix: Factual, Mechanism, Security implication, Comparison, Scenario
- `correctIndex` distribution vary karo — index 0, 1, 2, 3 sab use karo

## Example good question
```typescript
{ 
  question: "CIDR /24 notation mein kitne usable host addresses hote hain?",
  options: [
    "254 — 256 mein se network aur broadcast minus karo",
    "256 — directly block size",
    "255 — sirf broadcast minus",
    "128 — half block"
  ],
  correctIndex: 0,
  explanation: "/24 = 256 total addresses (2^8). Network address (.0) aur broadcast (.255) minus = 254 usable hosts. /25 = 126, /26 = 62, /27 = 30. Subnetting formula: 2^(32-prefix) - 2 = usable hosts."
},
```

## Verification command
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('artifacts/it-training-tracker/src/data/staticQuizQuestions.ts', 'utf8');
const moduleStarts = [...content.matchAll(/^  \"([a-z]+-\d+)\"\s*:/gm)];
moduleStarts.forEach((m, i) => {
  const id = m[1];
  if (!id.startsWith('net')) return;
  const start = m.index;
  const end = i + 1 < moduleStarts.length ? moduleStarts[i+1].index : content.length;
  const count = (content.slice(start, end).match(/correctIndex/g) || []).length;
  console.log(id + ': ' + count + ' questions');
});
"
```

---

---

# TASK 2 — ai-01 to ai-06 Quiz Rewrite

## Status: ❌ TODO

## Background
`ai-01` se `ai-06` mein abhi sirf **5 questions** hain har module mein.

## Concept count (curriculum.ts se)
| Module | Title | Concepts | Target Questions |
|--------|-------|----------|-----------------|
| ai-01 | ML Fundamentals for Security | many | 12-15 |
| ai-02 | Python for Data Science | many | 12-15 |
| ai-03 | ML Algorithms | many | 12-15 |
| ai-04 | AI Threat Detection | many | 12-15 |
| ai-05 | LLM Security & AI Ethics | many | 12-15 |
| ai-06 | Hands-on AI Projects | many | 10-12 |

## Kahan hai file mein
Line ~973: `// ── PHASE 8: AI ──`
Line ~975: `"ai-01": [`

## Rules
Task 1 ke same rules follow karo.

## Verification command
Task 1 ka same command, `'net'` ki jagah `'ai'` likhkaro:
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('artifacts/it-training-tracker/src/data/staticQuizQuestions.ts', 'utf8');
const moduleStarts = [...content.matchAll(/^  \"([a-z]+-\d+)\"\s*:/gm)];
moduleStarts.forEach((m, i) => {
  const id = m[1];
  if (!id.startsWith('ai')) return;
  const start = m.index;
  const end = i + 1 < moduleStarts.length ? moduleStarts[i+1].index : content.length;
  const count = (content.slice(start, end).match(/correctIndex/g) || []).length;
  console.log(id + ': ' + count + ' questions');
});
"
```

---

---

# TASK 3 — health-01 to health-06 Quiz Rewrite

## Status: ❌ TODO

## Background
`health-01` se `health-06` mein abhi sirf **5 questions** hain. Content quality achhi hai — sirf questions shallow hain.

## Kahan hai file mein
Line ~1925: `// ── HEALTH & WELLNESS ──`
Line ~1927: `"health-01": [`

## Topics (curriculum.ts se dekho)
health-01 to health-06 — Mental health, Burnout, Sleep, Physical health, Work-life balance, Career wellbeing for cybersecurity professionals.

## Target: 10-12 questions per module

## Hinglish style example
```typescript
{ 
  question: "Cybersecurity professionals mein 'alert fatigue' kya hota hai?",
  options: [
    "Bahut zyada coffee peena",
    "Itne zyada security alerts aate hain ki analyst desensitized ho jaata hai — real threats miss hone lagte hain",
    "Alarm system band ho jaana",
    "Network alerts disable karna"
  ],
  correctIndex: 1,
  explanation: "Alert fatigue SOC mein major problem hai. Too many alerts (thousands per day) → analyst overwhelmed → real threat ignore ho jaata hai. Solutions: alert tuning, automation, tiered response, risk-based prioritization. 2013 Target breach mein bhi alert fatigue ek factor tha."
},
```

## Verification
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('artifacts/it-training-tracker/src/data/staticQuizQuestions.ts', 'utf8');
const moduleStarts = [...content.matchAll(/^  \"([a-z]+-\d+)\"\s*:/gm)];
moduleStarts.forEach((m, i) => {
  const id = m[1];
  if (!id.startsWith('health')) return;
  const start = m.index;
  const end = i + 1 < moduleStarts.length ? moduleStarts[i+1].index : content.length;
  const count = (content.slice(start, end).match(/correctIndex/g) || []).length;
  console.log(id + ': ' + count + ' questions');
});
"
```

---

---

# TASK 4 — ai-02 Content Fix

## Status: ❌ TODO

## Problem
`ai-02` (Python for Data Science) mein 4 sections hain jo almost entirely raw code hain — NumPy, Pandas, Matplotlib, Log analysis. Koi explanation nahi ki:
- Yeh code kya karega step by step
- Expected output kaisa dikhega
- Agar error aaye toh kya karna hai
- Security mein yeh kyun important hai

## Kahan hai
`artifacts/it-training-tracker/src/data/topicContent.ts` — `"ai-02"` entry dhundho.

## Kya add karna hai — har code section mein

**Pehle** add karo (code se pehle):
```
Yeh code kya karega — step by step:
1. [step 1 Hinglish mein]
2. [step 2]
3. [step 3]
```

**Baad mein** add karo (code ke baad):
```
**Expected output:**
[actual example output dikhao — chahe 3-4 lines hi ho]

**Security connection:**
[yeh skill cybersecurity mein kahan kaam aati hai — 2-3 sentences]

**Agar error aaye:**
- `ModuleNotFoundError` → `pip install [library]` run karo
- [most common error for that code]
```

## Rules
- Existing content DELETE mat karo — sirf add karo
- Code blocks ko touch mat karo — unke aas paas text add karo
- Hinglish mein likhna hai

---

---

# TASK 5 — ai-03 Content Fix

## Status: ❌ TODO

## Problem — 2 specific issues

### Issue A: Section 3 (Phishing NLP — TF-IDF)
Code seedha paste kar diya TF-IDF + Naive Bayes ka. Student ko pata nahi:
- TF-IDF kya hai
- `n-gram` parameter kya karta hai
- Naive Bayes kyun use kar rahe hain

**Fix:** Code se PEHLE ek 2-3 paragraph explanation add karo:
```
**TF-IDF kya hai?**
Term Frequency-Inverse Document Frequency — ek technique jo text ko numbers mein convert karti hai.
Sochlo: email mein "FREE", "WINNER", "CLICK NOW" jaise words zyada baar aate hain phishing mein...
[etc. Hinglish mein explain karo]

**Naive Bayes kyun?**
Bayes theorem yaad hai? P(A|B) = P(B|A) × P(A) / P(B)...
```

### Issue B: Section 4 (Neural Networks — Fake Data)
Current code uses:
```python
X_train = np.random.random((10000, 100))  # RANDOM DATA — student kuch nahi seekh sakta
y_train = np.random.randint(0, 2, 10000)
```

**Fix:** Isko real data se replace karo. Options:
1. MNIST dataset (sklearn se directly available)
2. Phishing URLs dataset ka simplified version
3. Ya kam se kam explain karo ki real scenario mein data kahan se aata aur output kya hoga

Real data approach:
```python
from sklearn.datasets import load_breast_cancer  # binary classification, medical data analogy
# Ya
# "Real scenario mein: aap labeled phishing/legitimate URL dataset use karte"
# "Yahan hum synthetic binary classification data use karte hain demo ke liye"
```

Aur expected output add karo:
```
**Expected output:**
Epoch 1/10: loss: 0.6931 — accuracy: 0.5023
Epoch 5/10: loss: 0.4821 — accuracy: 0.7654
...
Test accuracy: 0.79 (79%)

**Kya observe karo:**
- Loss decrease hona chahiye har epoch mein
- Accuracy increase hona chahiye
- Agar accuracy ~50% pe stuck hai, data aur model check karo
```

## Kahan hai
`artifacts/it-training-tracker/src/data/topicContent.ts` — `"ai-03"` entry dhundho.

---

---

# TASK 6 — Naya Topic: Indian Cybersecurity Laws

## Status: ❌ TODO

## Kyun zaroori hai
Indian students bug bounty ya pentesting karte hain bina laws jaane. IT Act 2000 ke under unauthorized access = 3 saal jail. Koi dedicated module nahi hai is curriculum mein.

## Module details
```
id: "law-01"
phase: "Phase 1: Computer Basics"  (ya ek alag "Phase 13: Indian Context" banao)
category: "Indian Laws"
title: "Indian Cybersecurity Laws & Compliance"
level: "beginner"
```

## Curriculum entry add karna (curriculum.ts)
`artifacts/api-server/src/lib/curriculum.ts` mein add karo:
```typescript
{ 
  id: "law-01", 
  phase: "Phase 1: Computer Basics",  // ya appropriate phase
  category: "Indian Laws", 
  title: "Indian Cybersecurity Laws & Compliance", 
  level: "beginner", 
  order: 9,  // cb-08 ke baad
  description: "IT Act 2000 — Section 43 (data damage), Section 66 (hacking, 3 saal jail), Section 66B (stolen computer resource), Section 66C (identity theft), Section 66F (cyberterrorism). CERT-In Rules 2022 — 6 ghante mein breach report karna mandatory. DPDP Act 2023 — India ka pehla data protection law. Responsible disclosure — legal protection aur ethical boundaries. Bug bounty aur penetration testing — scope ke andar rehna. Cybercrime reporting — cybercrime.gov.in portal. IPC sections jo cyber cases mein apply hote hain. Real cases: Indian hackers jo pakde gaye." 
},
```

## Topic content add karna (topicContent.ts)
`artifacts/it-training-tracker/src/data/topicContent.ts` mein `"law-01"` key add karo.

### Content structure (Hinglish mein likhna)
```
## Cybersecurity aur Indian Law — Jaan ke chalo

### Section 1: IT Act 2000 — Basics
[IT Act 2000 kya hai, kyun banaya, kab applicable hai]

### Section 2: Important Sections jo Hacker Students ko Pata Hone Chahiye
**Section 43 — Data Damage**
[explain with example]

**Section 66 — Hacking (Computer-related offence)**
[explain: unauthorized access = crime, 3 saal jail + fine]

**Section 66C — Identity Theft**
[explain]

**Section 66F — Cyberterrorism**
[explain]

### Section 3: CERT-In Rules 2022
[6-hour mandatory reporting rule explain karo — organizations ke liye]
[Kya incidents report karne hain]

### Section 4: DPDP Act 2023 — India ka Data Protection Law
[What is personal data, processing rules, rights of data principal]
[Security implication: jo companies data store karte hain, unki responsibility]

### Section 5: Ethical Hacking — Legal Kab Hai?
[Authorized vs unauthorized — line kahan hai?]
[Bug bounty scope ke andar kaam karna]
[Responsible disclosure — pehle company ko batao, public nahi]
[Real example: Indian researcher ne major bug dhundha aur legally report kiya]

### Section 6: Agar Pakde Gaye Toh?
[Real cases — learning perspective]
[Cybercrime.gov.in — complaint kaise karte hain]
[Agar kisi ne tumpe false case kiya — kya karna hai]

### Key Points
- [bullet list]
```

## Quiz questions bhi add karo (staticQuizQuestions.ts)
`"law-01"` key add karo — **12-15 questions** — covering IT Act sections, DPDP, CERT-In, ethical boundaries.

---

---

# TASK 7 — Naya Topic: Git & GitHub Basics

## Status: ❌ TODO

## Kyun zaroori hai
`bb-06` (Portfolio Building) mein GitHub portfolio heavily recommend kiya hai — lekin koi Git foundation module nahi. Students jo GitHub nahi jaante woh portfolio nahi bana sakte.

## Module details
```
id: "prog-10"
phase: "Phase 4: Programming"
category: "Version Control"
title: "Git & GitHub — Security Portfolio ke liye"
level: "beginner"
order: 10
```

## Curriculum entry (curriculum.ts)
```typescript
{ 
  id: "prog-10", 
  phase: "Phase 4: Programming", 
  category: "Version Control", 
  title: "Git & GitHub — Security Portfolio ke liye", 
  level: "beginner", 
  order: 10, 
  description: "Git kya hai aur kyun zaroori hai. git init, add, commit, push — basic workflow. GitHub account setup aur profile. Repository banana — public vs private. README.md likhna (Markdown basics). .gitignore — sensitive files accidentally push mat karo (API keys!). Branches — feature aur main. Pull requests — open source contribution. GitHub Pages — free portfolio hosting. GitHub Actions — basic automation. Security tools GitHub pe host karna. Real example: security researcher ka GitHub profile kaisa dikhna chahiye. Common mistakes — credentials commit karna." 
},
```

## Topic content (topicContent.ts) — sections:
```
## Git & GitHub — Version Control Seekho

### Section 1: Git Kya Hai?
[Simple analogy — "undo button on steroids, aur collaboration tool bhi"]
[Distributed vs centralized VCS]

### Section 2: Installation aur Setup
[git install, git config --global user.name, user.email]
[SSH key setup for GitHub]

### Section 3: Basic Workflow — Roz Ka Kaam
[git init → git add → git commit → git push]
[git status, git log commands]
[Code examples with output]

### Section 4: GitHub Profile Setup
[Profile README banana]
[Pinned repositories]
[Contribution graph importance]
[Security researcher portfolio mein kya hona chahiye]

### Section 5: .gitignore — Zaroori Safety
[API keys, passwords kabhi commit mat karo]
[.gitignore file kaise likhte hain]
[Real example: credentials commit hone ki wajah se breach]
[github.com/github/gitignore templates]

### Section 6: Security Projects ko GitHub Pe Kaise Rakho
[CTF writeups repository]
[Tools repository]
[Scripts collection]
[README mein kya likhna chahiye]

### Section 7: Open Source Contribution
[Kisi security project mein contribute kaise karo]
[Fork → Clone → Change → Pull Request flow]

### Key Points
- [bullet list]
```

## Quiz: 10-12 questions
`"prog-10"` key add karo `staticQuizQuestions.ts` mein.

---

---

# TASK 8 — Naya Topic: UPI & Digital Payment Security

## Status: ❌ TODO

## Kyun zaroori hai
India mein #1 cybercrime category = UPI/digital payment fraud. Is curriculum mein koi dedicated coverage nahi. Yeh Indian students ke liye highly relevant hai — unhe attacks samajhne chahiye taaki defend kar sakein aur career mein India-specific threats cover kar sakein.

## Module details
```
id: "sec-09"
phase: "Phase 6: Security"
category: "Indian Context"
title: "UPI & Digital Payment Security"
level: "intermediate"
order: 9
```

## Curriculum entry (curriculum.ts)
```typescript
{ 
  id: "sec-09", 
  phase: "Phase 6: Security", 
  category: "Indian Context", 
  title: "UPI & Digital Payment Security", 
  level: "intermediate", 
  order: 9, 
  description: "UPI architecture — NPCI, PSP, VPA (Virtual Payment Address). How UPI technically works — payment initiation, routing, settlement. Common scams: 'money receive karne ke liye PIN daalo' reverse fraud, fake payment screenshots, QR code poisoning, SIM swap attacks. Aadhaar-linked account attacks. Social engineering for UPI fraud — vishing scripts. Mobile banking app security. Two-factor authentication bypass techniques. Cybercrime.gov.in — UPI fraud report karna. Evidence collection for UPI fraud complaint. NPCI dispute resolution. How investigators trace UPI transactions." 
},
```

## Topic content structure:
```
## UPI & Digital Payment Security

### Section 1: UPI Architecture — Technical Deep Dive
[NPCI, PSP (PhonePe, GPay, Paytm), VPA kya hai]
[Transaction flow — step by step]
[Security mechanisms already in place]

### Section 2: Common UPI Scams — India Mein Sab Se Zyada
**"Paisa Receive Karne Ke Liye PIN Daalo" Scam**
[Explain: PIN send karta hai, receive nahi — technical reason]

**Fake Payment Screenshot**
[WhatsApp pe edited screenshot — verify kaise karein]

**QR Code Poisoning**
[Physical QR code replace kar dete hain shops pe]

**SIM Swap Attack**
[Telecom employee ko bribe karo → SIM clone → OTP intercept]

### Section 3: Social Engineering for UPI Fraud
[Typical vishing call script analysis]
[Psychology: urgency, fear, authority]
[Real recorded call examples (public domain)]

### Section 4: How to Investigate UPI Fraud (Career Relevant)
[Transaction trace karna — UTR number]
[Cybercrime.gov.in complaint]
[Bank dispute process]
[Evidence jo police maangti hai]
[Forensic analysis of UPI apps]

### Section 5: Defense aur Prevention
[Red flags pehchano]
[Settings — UPI PIN, transaction limits]
[Organizations ke liye: fraud detection systems]

### Key Points
- [bullet list]
```

## Quiz: 12-15 questions

---

---

# TASK 9 — Naya Topic: Zero Budget Home Lab

## Status: ❌ TODO

## Kyun zaroori hai
`cb-08` mein "Professional Hacking Lab Setup" hai — lekin yeh assume karta hai resources (high-end laptop, good internet, cloud budget). Indian students ke paas often:
- 4-8 GB RAM ka laptop
- Mobile data ya limited WiFi
- Zero budget

## Module details
```
id: "cb-09"
phase: "Phase 1: Computer Basics"
category: "Lab Setup"
title: "Zero Budget Home Lab — Indian Student ke liye"
level: "beginner"
order: 9
```

## Curriculum entry (curriculum.ts)
```typescript
{ 
  id: "cb-09", 
  phase: "Phase 1: Computer Basics", 
  category: "Lab Setup", 
  title: "Zero Budget Home Lab — Indian Student ke liye", 
  level: "beginner", 
  order: 9, 
  description: "4GB RAM pe kya possible hai. VirtualBox (free) vs VMware Player (free). Kali Linux minimal install (2GB RAM mein chalta hai). Metasploitable 2 — attack target. TryHackMe — cloud-based labs (no local VM needed, mobile se bhi!). HackTheBox Starting Point — free machines. PortSwigger Web Security Academy — 100% free, best web security lab. Termux — Android pe Linux (alag phase mein detail hai). Offline resources — kya download karein WiFi pe. Dual boot vs VM — pros/cons Indian context mein. Free cloud: AWS Free Tier, Google Cloud $300 credit. CTF practice — PicoCTF, CTFlearn (beginner friendly). Community resources — Null Community, OWASP India." 
},
```

## Topic content structure:
```
## Zero Budget Home Lab — Paise Nahi Toh Kya, Skills Banao

### Section 1: Assessment — Tumhare Paas Kya Hai?
[Decision tree: RAM kitna? → kya possible hai?]
```
4GB RAM → TryHackMe + PortSwigger Academy (no local VM needed)
8GB RAM → VirtualBox + Kali + 1 VM
16GB RAM → Full lab possible
```

### Section 2: Cloud-Based Labs (Mobile Data pe bhi kaam karta hai)
**TryHackMe — Sabse Beginner-Friendly**
[Free rooms, learning paths, browser-based AttackBox]
[India se access kaisa hai, latency]
[Free tier mein kya milta hai]

**PortSwigger Web Security Academy**
[100% free, no registration bhi ho sakta hai]
[Best web application security resource]
[Labs directly browser mein — VM nahi chahiye]

**HackTheBox Starting Point**
[Free machines, guided labs]

### Section 3: Local Lab — VirtualBox Setup (4GB RAM Mein)
[VirtualBox free download]
[Kali Linux minimal ISO (1.5GB) — kahan se download]
[Metasploitable 2 download]
[RAM allocation tips — 1.5GB Kali + 512MB target]
[Network adapter — host-only network setup]

### Section 4: Termux — Sirf Phone Chahiye
[Android users ke liye]
[tmx- phase refer karo details ke liye]
[Kya possible hai Termux mein without root]

### Section 5: Limited Internet ke Saath Kaam Karna
[Kya download karna hai WiFi pe]
- Kali Linux ISO (offline tools already installed)
- Metasploitable 2 OVA
- OffSec courses PDFs (free ones)
- TryHackMe rooms mein notes
[Kya online-only hai]
[Download managers — resume support important hai]

### Section 6: Free Cloud Resources
[AWS Free Tier — 750 hours EC2 t2.micro]
[Google Cloud — $300 credit for new accounts]
[Oracle Cloud — Always Free tier (2 VMs free forever!)]
[Kali Linux on cloud — security testing ke liye]

### Section 7: Community aur Resources
[Null Community — nullcon, monthly meetups]
[OWASP India chapters]
[CTF practice — PicoCTF (beginner), CTFlearn]
[Discord servers — Indian security community]
[YouTube — free Hindi/English content creators]

### Key Points
- [bullet list]
```

## Quiz: 10-12 questions

---

---

# REFERENCE: Quiz Question Writing Guide

## Format
```typescript
"module-id": [
  { 
    question: "...", 
    options: ["option0", "option1", "option2", "option3"],  // EXACTLY 4
    correctIndex: N,  // 0, 1, 2, ya 3
    explanation: "..." 
  },
],
```

## 5 Question Types (mix karo)
1. **Factual** — "X kya hai?" / "Kaun sa port use hota hai?"
2. **Mechanism** — "Exactly kya hota hai jab X?" / "Kaise kaam karta hai?"
3. **Security implication** — "Kyun dangerous hai?" / "Attacker kya achieve kar sakta hai?"
4. **Comparison** — "X aur Y mein fark?" / "Kab X use karo, kab Y?"
5. **Scenario** — "Is situation mein attacker kya karega?" / "Defense kya hoga?"

## correctIndex distribution (vary karo!)
- Index 0: ~20% questions
- Index 1: ~40% questions
- Index 2: ~25% questions
- Index 3: ~15% questions

## Wrong options — plausible hone chahiye
❌ Bad: `"Banana"`, `"Purple"`, `"Keyboard"` (random nonsense)
✅ Good: Similar-sounding concepts jo students confuse karte hain

## Explanation quality
- Technical details dijiye — tools, CVEs, real attacks reference karo
- "Why does this matter in real security?" — har explanation mein
- 2-4 sentences — na bahut short, na essay

## Common mistakes to avoid
- `correctIndex: 1` sab mein mat rakho
- Double-quotes string ke andar avoid karo ya `\"` use karo
- Options array mein exactly 4 items
- Explanation mein wrong technical claims mat karo

---

# REFERENCE: New Topic Adding Guide

## Step 1: curriculum.ts mein add karo
File: `artifacts/api-server/src/lib/curriculum.ts`

Format:
```typescript
{ 
  id: "xxx-00", 
  phase: "Phase N: Name", 
  category: "Category", 
  title: "Title", 
  level: "beginner" | "intermediate" | "advanced", 
  order: N, 
  description: "..." 
},
```

## Step 2: topicContent.ts mein add karo
File: `artifacts/it-training-tracker/src/data/topicContent.ts`

Format:
```typescript
"xxx-00": `## Topic Title

### Section 1: ...
[content in Hinglish markdown]

### Key Points
- point 1
- point 2
`,
```

## Step 3: staticQuizQuestions.ts mein add karo
File: `artifacts/it-training-tracker/src/data/staticQuizQuestions.ts`

Appropriate phase comment ke andar add karo:
```typescript
"xxx-00": [
  { question: "...", options: [...], correctIndex: N, explanation: "..." },
  // 10-15 questions
],
```

## Step 4: Verify karo
```bash
# Server restart karo
# App open karo
# Naya topic list mein dikhna chahiye
# Quiz kaam karna chahiye
```

---

*Last updated: July 8, 2026*
*Tasks complete hone pe STATUS TABLE update karo: ❌ → ✅*

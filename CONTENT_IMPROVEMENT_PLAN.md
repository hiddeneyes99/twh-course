# CYBER_TRACK Content Improvement Master Plan
> **Kaam karne ka tarika:** Ek topic karo → test karo → is file mein `- [ ]` ko `- [x]` karo → commit karo → next topic.  
> Kabhi bhi ek saath multiple topics mat karo. Tick karke hi aage bado.

---

## 🤖 AI ke liye: Yeh Project Kya Hai?

Yeh ek **IT Training Tracker** web app hai jisme cybersecurity students padhai karte hain.  
App ke andar students:
1. Topics padhte hain (learning content)
2. Quiz dete hain (concept check)
3. Progress track karte hain

**Tech stack:** React 19 + Vite (frontend) | Express 5 API (backend) | PostgreSQL (database)  
**Language style:** Hinglish — Hindi + English mix. Casual, friendly tone. Jaise ek dost samjha raha ho.

---

## 📁 Kahan Kya Hai — File Map

```
artifacts/it-training-tracker/src/data/
├── topicContent.ts        ← Har topic ka learning content (sections, keyPoints)
└── staticQuizQuestions.ts ← Har topic ke quiz questions

artifacts/api-server/src/lib/
└── curriculum.ts          ← Topic list (id, title, phase, description) — "syllabus"
```

### topicContent.ts ka structure (content likhne ka format):
```typescript
"topic-id": {
  title: "Topic Ka Title",
  image: "https://images.unsplash.com/...",  // relevant photo URL
  tagline: "Ek catchy line jo topic summarize kare",
  sections: [
    {
      heading: "🔍 Section Heading",
      content: `Detailed content yahan...`
    },
    // 5-7 sections minimum
  ],
  keyPoints: [
    "Point 1 — concise, memorable",
    "Point 2",
    // 5-7 key points
  ],
},
```

### staticQuizQuestions.ts ka structure (question likhne ka format):
```typescript
"topic-id": [
  {
    question: "Poora question yahan?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,  // 0-based index of correct answer
    explanation: "Yahan detail mein batao KYU yeh sahi hai aur baaki galat. Wrong answers bhi explain karo."
  },
  // 10-15+ questions per topic, koi limit nahi
],
```

---

## ✅ Content Quality Standard — Kya Achha Content Hota Hai?

Har topic ka content **sahi hone ke liye yeh sab hona chahiye:**

### 📖 Sections (minimum 5-7 per topic):
- **Section 1:** Core concept kya hai — simple bhasha mein, bilkul beginner ke liye
- **Section 2:** Technical depth — actual mechanics, numbers, facts ke saath
- **Section 3:** Real-life example — India-specific preferred (UPI hack, CERT-In case, Indian banks, etc.)
- **Section 4:** Practical/Hands-on — "Yeh try karo" with actual commands/steps
- **Section 5:** Cybersecurity angle — yeh concept attacker/defender kaise use karta hai
- **Section 6+:** Advanced/edge cases ya related tools

### 📏 Content length standard:
- **Current (bad):** 50-100 words per section → student kuch nahi seekhta
- **Target (good):** 300-600 yeh isse bhi jada apne hisab se karo words per section with examples, commands, tables
- Har section mein **kam se kam 1 real example ya code block** hona chahiye

### ❓ Quiz Question Standard:
- **No limit** on number of questions — jo zaroori ho utne likho
- Har question practical ho — rote learning nahi, samajhne wala
- `explanation` mein **galat options bhi explain karo** — "Option A galat hai kyunki..."
- Ek topic ke questions different difficulty levels pe ho — easy se advanced
- Scenario-based questions: "Ek attacker ne X kiya, aab kya hoga?"

---

## 🚨 Jo Content Existing Hai Uski Problems:

1. **Content bahut chota hai** — 4 sections of 50 words each = student kuch nahi seekhta
2. **Curriculum description aur actual content mein mismatch** — description mein bohot kuch promise, content mein kuch nahi
3. **Koi practical exercise nahi** — theory hi theory
4. **India-specific examples nahi** — student relate nahi kar pata
5. **Quiz questions content se match nahi karte** — advanced quiz, beginner content

---

## 📋 WORK CHECKLIST — Har Topic Ek Ek Karke

### 🔧 Pre-Work Setup (Pehle Yeh Karo)
- [x] `curriculum.ts` mein Phase 13 (AI & ML) ke topics add karo (ai-01 to ai-10)
- [x] `curriculum.ts` mein Phase 14 (AI Security & LLM Hacking) ke topics add karo (aisec-01 to aisec-08)
- [x] `topicContent.ts` mein ai-01 to ai-06 existing content ko rewrite karo (current content bahut shallow hai)

---

### 📘 PHASE 1: Computer Basics

**Improve karne ka target:** Curriculum description match karna, hands-on exercises add karna, real India examples.

- [ ] **cb-01** — Computer Architecture & Components
  - Content fix: Fetch-Decode-Execute, Cache L1/L2/L3, BIOS/UEFI, Von Neumann, Cold Boot Attack add karo
  - Quiz fix: Content se match karo, beginner level bhi cover karo
  
- [ ] **cb-02** — Input/Output & Peripheral Security  
  - Content fix: USB Drop Attack demo steps, Rubber Ducky kaise kaam karta hai, actual hardware IDs
  - Quiz fix: HID attacks, DMA attacks add karo

- [ ] **cb-03** — Operating System Internals
  - Content fix: Ring 0-3 explain karo diagram style, actual syscall list, process injection steps
  - Quiz fix: Kernel space vs user space scenarios

- [ ] **cb-04** — File Systems, Permissions & Registry
  - Content fix: Live commands — `icacls`, `ls -la`, `find / -perm -4000`, NTFS ADS actual demo
  - Quiz fix: chmod numeric values, registry hive questions

- [ ] **cb-05** — Binary, Hex & Number Systems
  - Content fix: Conversion tables, little-endian example with actual memory dump, XOR cipher demo
  - Quiz fix: Actual conversion problems, endianness in buffer overflow context

- [ ] **cb-06** — Encoding, Hashing & Cryptography Basics
  - Content fix: Base64 decode malware payload example, SHA-256 actual output, rainbow table attack steps
  - Quiz fix: Encoding vs encryption scenarios, hash type identification

- [ ] **cb-07** — Virtualization & Container Security
  - Content fix: Docker escape actual steps, Type 1 vs Type 2 real products, VirtualBox network modes setup
  - Quiz fix: Container escape scenarios, hypervisor type questions

- [ ] **cb-08** — Kali Linux Lab Setup
  - Content fix: Step-by-step Kali VM setup with screenshots description, tool locations, network isolation setup
  - Quiz fix: VM network modes, essential tool names

- [ ] **cb-09** — Termux Lab Setup (Android)
  - Content fix: Exact Termux commands, F-Droid install, common errors aur solutions, pkg vs apt
  - Quiz fix: Termux-specific commands, Android permissions

- [ ] **law-01** — Indian Cybersecurity Laws & Compliance
  - Content fix: Real Indian cases (Wipro breach, Indian bank ATM heist 2018), CERT-In rules step by step, DPDP Act 2023 actual clauses
  - Quiz fix: Specific section numbers, jail terms, real case scenarios

---

### 🌐 PHASE 2: Networking

- [ ] **net-01** — Network Fundamentals & OSI Model
- [ ] **net-02** — IP Addressing & Subnetting  
- [ ] **net-03** — TCP/IP Deep Dive
- [ ] **net-04** — DNS — How it Works & Attacks
- [ ] **net-05** — HTTP/HTTPS & Web Protocols
- [ ] **net-06** — Email Protocols & Security (SMTP, IMAP, DKIM, DMARC, SPF)
- [ ] **net-07** — Network Tools (Wireshark, tcpdump, nmap)
- [ ] **net-08** — Packet Analysis & Traffic Capture
- [ ] **net-09** — Network Attacks (ARP Spoofing, MITM, Sniffing)
- [ ] **net-10** — Firewall, IDS/IPS & Network Defense
- [ ] **net-11** — Wireless Security (WPA2, WPA3, WiFi attacks)
- [ ] **net-12** — Tor, VPN, Proxies & Anonymity

**Networking content ke liye specific guidance:**
- Har protocol topic mein **actual packet structure** dikhao (header fields, sizes)
- Wireshark filter examples dena zaroori — `tcp.port == 80`, `dns`, `http.request`
- Attack topics mein: setup → execute → detect → defend — chaar steps
- Indian ISP context — BSNL, Jio, Airtel network behavior
- Real tools ke actual commands with output examples

---

### 💻 PHASE 3: Linux & Windows OS

- [ ] **os-01** — Linux Command Line Mastery (Basic)
- [ ] **os-02** — Linux File System & User Management
- [ ] **os-03** — Linux Process Management & Monitoring
- [ ] **os-04** — Linux Networking Commands
- [ ] **os-05** — Shell Scripting for Security
- [ ] **os-06** — Linux Privilege Escalation
- [ ] **os-07** — Linux System Hardening & Audit
- [ ] **os-08** — Windows Internals & Security
- [ ] **os-09** — Windows Active Directory Basics
- [ ] **os-10** — Windows Privilege Escalation & Defense

**OS content ke liye specific guidance:**
- **Har command ke saath actual example output dikhao** — sirf command likhna kaafi nahi
- Linux priv-esc: SUID binaries list, GTFOBins link, actual exploit steps
- Windows: PowerShell equivalents for every Linux command
- Real CTF machine scenarios — "Imagine tum HackTheBox machine pe ho"

---

### 🐍 PHASE 4: Programming for Security

- [ ] **prog-01** — Python Basics for Hackers
- [ ] **prog-02** — Python — File I/O, Regex, Error Handling
- [ ] **prog-03** — Python Networking (sockets, scapy, requests)
- [ ] **prog-04** — Python for Web Scraping & Automation
- [ ] **prog-05** — Python Security Tools — Build Your Own Scanner
- [ ] **prog-06** — Python Exploit Development Basics
- [ ] **prog-07** — JavaScript, HTML, CSS for Web Hacking
- [ ] **prog-08** — SQL for Security — Queries & Injection
- [ ] **prog-09** — Databases Deep Dive & NoSQL
- [ ] **prog-10** — Git & Version Control Security

**Programming content ke liye specific guidance:**
- Har section mein **runnable code example** hona chahiye
- "Build your own" mindset — port scanner, keylogger, password cracker banana sikhao
- Common mistakes aur kaise avoid karo
- Security-relevant use cases — ye sirf programming course nahi, security course hai

---

### 🕸️ PHASE 5: Web Security

- [ ] **web-01** — How the Web Works (HTTP, Cookies, Sessions, Same-Origin)
- [ ] **web-02** — OWASP Top 10 Overview
- [ ] **web-03** — XSS — Cross-Site Scripting (All Types)
- [ ] **web-04** — SQL Injection — From Detection to RCE
- [ ] **web-05** — Authentication Attacks (Brute Force, Session, JWT)
- [ ] **web-06** — SSRF, XXE, Insecure Deserialization
- [ ] **web-07** — Burp Suite Mastery
- [ ] **web-08** — API Security Testing
- [ ] **web-09** — Advanced Web Attacks (CORS, CSRF, Race Conditions)

**Web security content ke liye specific guidance:**
- Har vulnerability type ke liye: **theory → detection → exploitation → payload → fix**
- DVWA aur WebGoat mein kahan milta hai yeh vuln — lab practice link
- Real bug bounty reports reference karo (HackerOne public reports)
- India mein common vulnerable sites categories (e-commerce, govt portals)
- Burp Suite screenshots description + keyboard shortcuts

---

### 🔒 PHASE 6: Cybersecurity Basics

- [ ] **sec-01** — CIA Triad, Security Fundamentals
- [ ] **sec-02** — Types of Threats & Attack Vectors
- [ ] **sec-03** — Cryptography — Symmetric, Asymmetric, PKI
- [ ] **sec-04** — Firewall, WAF, VPN Configuration
- [ ] **sec-05** — Security Hardening Best Practices
- [ ] **sec-06** — Incident Response (NIST Framework)
- [ ] **sec-07** — Compliance — ISO 27001, SOC 2, PCI-DSS, HIPAA
- [ ] **sec-08** — Risk Management & Security Architecture
- [ ] **sec-09** — Indian Context — CERT-In, NCSC, MeitY

---

### 🎯 PHASE 7: Ethical Hacking Methodology

- [ ] **hack-01** — Ethical Hacking Methodology & Mindset
- [ ] **hack-02** — Passive Recon (OSINT, Google Dorks, Shodan)
- [ ] **hack-03** — Active Recon (Nmap, Netcat, Enumeration)
- [ ] **hack-04** — Vulnerability Assessment (Nessus, OpenVAS, Nuclei)
- [ ] **hack-05** — Exploitation (Metasploit Framework Deep Dive)
- [ ] **hack-06** — Password Attacks (Cracking, Spraying, Credential Stuffing)
- [ ] **hack-07** — Social Engineering (Phishing, Pretexting, Vishing)
- [ ] **hack-08** — Post-Exploitation (Meterpreter, Persistence, Pivoting)
- [ ] **hack-09** — Privilege Escalation (Windows & Linux)
- [ ] **hack-10** — Mobile Security Testing (Android, iOS)
- [ ] **hack-11** — Nmap Advanced & Scanning Techniques
- [ ] **hack-12** — Metasploit Deep Dive
- [ ] **hack-13** — Penetration Test Report Writing

**Hacking content ke liye specific guidance:**
- **Legal disclaimer har jagah** — "Only on systems you own or have written permission"
- Metasploit: actual module names, exact commands, expected output
- Practice platforms mention karo — HackTheBox, TryHackMe, VulnHub specific machines
- Indian legal context — IT Act 2000 Section 66 ka jail term mention karo

---

### 🔴 PHASE 8: Red Team Operations

- [ ] **red-01** — Red Team vs Pentest — Differences & Mindset
- [ ] **red-02** — C2 (Command & Control) Frameworks (Cobalt Strike, Sliver, Havoc)
- [ ] **red-03** — Active Directory Attacks — Kerberoasting, Pass-the-Hash
- [ ] **red-04** — Active Directory — DCSync, Golden Ticket, Silver Ticket
- [ ] **red-05** — Lateral Movement Techniques
- [ ] **red-06** — AV/EDR Evasion Techniques
- [ ] **red-07** — Persistence & Data Exfiltration
- [ ] **red-08** — Malware Development for Red Teams
- [ ] **red-09** — Physical Security & Red Team
- [ ] **red-10** — Malware Analysis Basics

---

### 🔵 PHASE 9: Blue Team & Defense

- [ ] **blue-01** — SOC (Security Operations Center) Career Path
- [ ] **blue-02** — SIEM — Splunk Basics
- [ ] **blue-03** — SIEM — Elastic Stack (ELK) Setup & Queries
- [ ] **blue-04** — Digital Forensics — Disk & Memory
- [ ] **blue-05** — Windows Forensics — Event Logs, Registry, Artifacts
- [ ] **blue-06** — Network Forensics — Packet Capture Analysis
- [ ] **blue-07** — Threat Hunting Methodology
- [ ] **blue-08** — Incident Response Playbooks
- [ ] **blue-09** — Intrusion Detection (Snort, Suricata, Zeek)
- [ ] **blue-10** — Security Tools — YARA, Sigma, MITRE ATT&CK

---

### ☁️ PHASE 10: Cloud Security

- [ ] **cloud-01** — Cloud Basics — AWS, Azure, GCP Intro
- [ ] **cloud-02** — AWS Security — IAM, S3, EC2 Misconfigurations
- [ ] **cloud-03** — Docker & Kubernetes Security
- [ ] **cloud-04** — DevSecOps — Secure CI/CD Pipeline
- [ ] **cloud-05** — Infrastructure as Code Security (Terraform)

---

### 💣 PHASE 11: Advanced Hacking

- [ ] **adv-01** — Buffer Overflow — Stack Based Exploitation
- [ ] **adv-02** — Return-Oriented Programming (ROP)
- [ ] **adv-03** — Heap Exploitation Techniques
- [ ] **adv-04** — Reverse Engineering (Ghidra, IDA, Radare2)
- [ ] **adv-05** — Advanced Web Attacks (Prototype Pollution, Deserialization)

---

### 🏆 PHASE 12: Bug Bounty & Career

- [ ] **bb-01** — Bug Bounty Programs — Getting Started
- [ ] **bb-02** — Recon Pipeline & Automation
- [ ] **bb-03** — Writing Good Bug Reports
- [ ] **bb-04** — Certifications Guide (OSCP, CEH, eJPT, Security+)
- [ ] **bb-05** — Cybersecurity Career Paths & Salaries
- [ ] **bb-06** — Building Your Portfolio & Personal Brand
- [ ] **bb-07** — AI in Cybersecurity — Future Skills

---

## 🤖 NEW — PHASE 13: AI & Machine Learning Fundamentals

> **Pehle curriculum.ts mein yeh topics add karo**, phir content aur quiz likho.

**Phase name:** `"Phase 13: AI & Machine Learning"`

Yeh sab topics banana hai (curriculum.ts + topicContent.ts + staticQuizQuestions.ts teeno mein):

- [x] **ai-01** — What is AI? History, Types (ANI/AGI/ASI), Real-world Applications
  - Rewrite karo — existing content theek hai but aur deep karo
  - Add: ML pipeline step by step, Indian AI companies (Sarvam AI, Ola Krutrim, etc.)

- [x] **ai-02** — Machine Learning — How Machines Learn
  - Rewrite karo — supervised/unsupervised/reinforcement with hands-on Python examples
  - Add: Scikit-learn se ek simple classifier banana

- [x] **ai-03** — Neural Networks & Deep Learning
  - Rewrite — neurons, layers, backpropagation simple explanation
  - Add: TensorFlow/Keras Hello World (MNIST digit recognition)

- [x] **ai-04** — Large Language Models (LLMs) — How ChatGPT Works
  - Rewrite — transformer architecture, attention mechanism, training process
  - Add: Ollama se local LLM run karna, API calls Python se

- [x] **ai-05** — Computer Vision & NLP Basics
  - Rewrite — CNNs, image classification, NLP tasks
  - Add: Yolo object detection demo, sentiment analysis

- [x] **ai-06** — AI Tools for Cybersecurity Professionals
  - Rewrite — existing bahut surface level hai
  - Add: Using LLMs for code review, threat intel summarization, report writing

- [x] **ai-07** — Data Science Fundamentals for Security *(NEW)*
  - Pandas, NumPy basics; Log analysis with Python; Data visualization
  - Security dataset analysis — network traffic logs, authentication logs

- [x] **ai-08** — Building AI Security Tools *(NEW)*
  - Phishing URL detector (ML model banana step by step)
  - Network anomaly detection with isolation forest
  - Malware classification with random forest

- [x] **ai-09** — MLOps & AI in Production *(NEW)*
  - Model deployment, API serve karna (FastAPI + ML model)
  - Model monitoring, data drift
  - AI pipeline security — poisoning attacks

- [x] **ai-10** — Generative AI & Prompt Engineering *(NEW)*
  - Prompt engineering techniques — zero-shot, few-shot, chain-of-thought
  - RAG (Retrieval Augmented Generation) kya hai
  - Using AI for CTF solving, security research

---

## 🔓 NEW — PHASE 14: AI Security & LLM Hacking

> **Pehle curriculum.ts mein yeh topics add karo**, phir content aur quiz likho.

**Phase name:** `"Phase 14: AI Security & LLM Hacking"`

- [x] **aisec-01** — AI Attack Surface — Threat Model *(NEW)*
  - AI systems pe threats — data poisoning, model theft, adversarial examples
  - AI security vs traditional security differences
  - Real breaches: Samsung ChatGPT data leak, Bing AI jailbreaks

- [x] **aisec-02** — Prompt Injection Attacks *(NEW)*
  - Direct prompt injection — user input se system prompt override
  - Indirect prompt injection — web content mein hidden instructions
  - Actual PoC examples — "Ignore previous instructions and..."
  - Defense: input sanitization, output filtering, privilege separation

- [x] **aisec-03** — LLM Jailbreaking Techniques *(NEW)*
  - DAN (Do Anything Now), roleplay attacks, encoding tricks
  - Jailbreak history — GPT-3 se GPT-4 tak changes
  - Why jailbreaking matters for security professionals
  - Testing your own AI apps for jailbreak resistance

- [x] **aisec-04** — Data Poisoning & Model Attacks *(NEW)*
  - Training data poisoning — backdoor attacks
  - Model extraction — black-box attacks
  - Membership inference attack — kya yeh data training mein tha?
  - Supply chain attacks on open-source models (HuggingFace risks)

- [x] **aisec-05** — Adversarial Machine Learning *(NEW)*
  - Adversarial examples — image ko slightly modify karo, model dhoka kha jaata hai
  - FGSM (Fast Gradient Sign Method) — simple attack
  - Adversarial patches (physical world attacks — Tesla autopilot hack)
  - Defense: adversarial training, input preprocessing

- [x] **aisec-06** — AI-Powered Offensive Security *(NEW)*
  - FraudGPT, WormGPT, DarkBERT — malicious LLMs
  - AI-generated phishing campaigns — mass personalization
  - Automated vulnerability discovery with AI
  - AI-powered social engineering (deepfakes, voice clones)
  - India mein deepfake scam cases

- [x] **aisec-07** — Securing AI Systems — Defense *(NEW)*
  - AI red teaming methodology
  - OWASP Top 10 for LLMs
  - AI security frameworks — NIST AI RMF, Google SAIF
  - Responsible disclosure for AI vulnerabilities
  - AI governance aur compliance

- [x] **aisec-08** — Practical AI Security Lab *(NEW)*
  - GARAK framework se LLM vulnerability scan karna
  - Gandalf challenge (prompt injection game)
  - Building a safe AI chatbot — guardrails implement karna
  - Bug bounty for AI — programs jo AI bugs accept karte hain

---

## 📌 Existing Topics jo Topicontent mein Hain Lekin Improve Chahiye

Yeh topics `topicContent.ts` mein hain but `curriculum.ts` mein officially nahi (ya bahut shallow):

### Termux Topics (tmx-01 to tmx-07)
- [ ] **tmx-01** — Termux Setup & Basics
- [ ] **tmx-02** — Termux File System & Commands  
- [ ] **tmx-03** — Termux Networking Tools
- [ ] **tmx-04** — Termux Security Tools (Metasploit, sqlmap, hydra)
- [ ] **tmx-05** — Termux Scripting
- [ ] **tmx-06** — Termux Advanced Hacking
- [ ] **tmx-07** — Termux CTF & Practice

### Health & Wellbeing (health-01 to health-06) — optional, improve only if needed
- [ ] **health-01** — Digital Eye Strain & Ergonomics
- [ ] **health-02** — Sleep Hygiene for Night Hackers
- [ ] **health-03** — Mental Health in Cybersecurity
- [ ] **health-04** — Physical Exercise for Desk Workers
- [ ] **health-05** — Diet & Nutrition for Brain Performance
- [ ] **health-06** — Burnout Prevention

---

## 🛠️ Har Topic Complete Karne Ka Process

1. **`curriculum.ts` check karo** — topic ka description match karta hai content se?
2. **`topicContent.ts` update karo** — existing section rewrite ya naye add karo (minimum 5-6 sections, 300+ words each)
3. **`staticQuizQuestions.ts` update karo** — existing questions rakhne bhi theek hain, naye add karo jo content cover karte ho. Explanation mein galat options bhi explain karo.
4. **App mein check karo** — topic open karo, quiz do, dekho sab theek lag raha hai
5. **Is file mein tick karo** — `- [ ]` → `- [x]`
6. **Commit karo** with message: `content: improve <topic-id> — <one line what changed>`

---

## ⚠️ Zaroori Rules

1. **Ek topic ek baar** — multiple topics ek commit mein mat karo
2. **Existing questions delete mat karo** — sirf naye add karo ya improve karo
3. **Legal disclaimers** — offensive topics mein "Only on systems you have permission to test" likhna mat bhoolo
4. **India-relevant examples** — UPI frauds, Indian govt breaches, CERT-In cases, real Indian court judgments prefer karo
5. **Practical > Theoretical** — har topic mein kuch "try this" type exercise honi chahiye
6. **Content vs Quiz match** — jo quiz mein poochha hai woh content mein explain hona chahiye

---

## 📊 Progress Summary

| Phase | Total Topics | Done | Remaining |
|-------|-------------|------|-----------|
| Phase 1: Computer Basics | 10 | 0 | 10 |
| Phase 2: Networking | 12 | 0 | 12 |
| Phase 3: Linux & Windows | 10 | 0 | 10 |
| Phase 4: Programming | 10 | 0 | 10 |
| Phase 5: Web Security | 9 | 0 | 9 |
| Phase 6: Cybersecurity Basics | 9 | 0 | 9 |
| Phase 7: Ethical Hacking | 13 | 0 | 13 |
| Phase 8: Red Team | 10 | 0 | 10 |
| Phase 9: Blue Team | 10 | 0 | 10 |
| Phase 10: Cloud Security | 5 | 0 | 5 |
| Phase 11: Advanced Hacking | 5 | 0 | 5 |
| Phase 12: Bug Bounty & Career | 7 | 0 | 7 |
| Phase 13: AI & ML (NEW) | 10 | 10 | 0 |
| Phase 14: AI Security (NEW) | 8 | 8 | 0 |
| Termux Topics | 7 | 0 | 7 |
| Health Topics | 6 | 0 | 6 |
| **TOTAL** | **141** | **24** | **117** |

---

*Last updated: 2026-07-09*  
*Jab koi topic complete ho, is table ki "Done" column bhi update karo.*

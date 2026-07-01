export interface Topic {
  id: string;
  phase: string;
  category: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  order: number;
}

export const curriculum: Topic[] = [
  // Phase 1: Computer Basics
  { id: "cb-01", phase: "Phase 1: Computer Basics", category: "Hardware", title: "What is a Computer?", description: "CPU, RAM, storage, motherboard — how hardware components work together.", level: "beginner", order: 1 },
  { id: "cb-02", phase: "Phase 1: Computer Basics", category: "Hardware", title: "Input & Output Devices", description: "Keyboards, monitors, printers, USB, HDMI — how data enters and exits.", level: "beginner", order: 2 },
  { id: "cb-03", phase: "Phase 1: Computer Basics", category: "Software", title: "Operating System Basics", description: "What an OS does — process management, file systems, user interface.", level: "beginner", order: 3 },
  { id: "cb-04", phase: "Phase 1: Computer Basics", category: "Software", title: "File Systems & Storage", description: "FAT32, NTFS, ext4 — how files are stored and organized on disk.", level: "beginner", order: 4 },
  { id: "cb-05", phase: "Phase 1: Computer Basics", category: "Binary & Data", title: "Binary & Number Systems", description: "Binary, decimal, hex, octal — how computers represent data.", level: "beginner", order: 5 },
  { id: "cb-06", phase: "Phase 1: Computer Basics", category: "Binary & Data", title: "Data Units & Encoding", description: "Bits, bytes, ASCII, Unicode — how text and data are encoded.", level: "beginner", order: 6 },

  // Phase 2: Networking
  { id: "net-01", phase: "Phase 2: Networking", category: "Fundamentals", title: "What is a Network?", description: "LAN, WAN, MAN — types of networks and why they exist.", level: "beginner", order: 1 },
  { id: "net-02", phase: "Phase 2: Networking", category: "Fundamentals", title: "IP Addresses & Subnetting", description: "IPv4, IPv6, subnet masks, CIDR notation — addressing computers on a network.", level: "beginner", order: 2 },
  { id: "net-03", phase: "Phase 2: Networking", category: "Fundamentals", title: "Ports & Protocols", description: "What ports are, common ports (80, 443, 22, 21), TCP vs UDP explained.", level: "beginner", order: 3 },
  { id: "net-04", phase: "Phase 2: Networking", category: "Protocols", title: "OSI & TCP/IP Model", description: "7 layers of the OSI model — what each layer does and how data flows.", level: "intermediate", order: 4 },
  { id: "net-05", phase: "Phase 2: Networking", category: "Protocols", title: "DNS, DHCP & ARP", description: "How domain names resolve to IPs, how devices get addresses automatically.", level: "intermediate", order: 5 },
  { id: "net-06", phase: "Phase 2: Networking", category: "Protocols", title: "HTTP & HTTPS", description: "How the web works — request/response cycle, headers, status codes, TLS.", level: "intermediate", order: 6 },
  { id: "net-07", phase: "Phase 2: Networking", category: "Tools", title: "Network Tools (ping, nmap, Wireshark)", description: "Ping, traceroute, nmap, Wireshark — essential tools for network analysis.", level: "intermediate", order: 7 },
  { id: "net-08", phase: "Phase 2: Networking", category: "Tools", title: "Firewalls & VPNs", description: "How firewalls filter traffic, how VPNs create secure tunnels.", level: "intermediate", order: 8 },
  { id: "net-09", phase: "Phase 2: Networking", category: "Advanced", title: "Packet Analysis", description: "Reading raw packets with Wireshark — understanding network traffic deeply.", level: "advanced", order: 9 },
  { id: "net-10", phase: "Phase 2: Networking", category: "Advanced", title: "Routing & BGP Basics", description: "How routers forward packets, BGP, routing tables, static vs dynamic routing.", level: "advanced", order: 10 },

  // Phase 3: OS & Linux
  { id: "os-01", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "Linux Introduction & Installation", description: "What is Linux, distributions (Ubuntu, Kali, Debian), how to install.", level: "beginner", order: 1 },
  { id: "os-02", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "Linux Command Line Fundamentals", description: "ls, cd, mkdir, rm, cp, mv — navigating and managing the file system.", level: "beginner", order: 2 },
  { id: "os-03", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "File Permissions & Users", description: "chmod, chown, sudo, root — Linux permission model and user management.", level: "beginner", order: 3 },
  { id: "os-04", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Processes & System Monitoring", description: "ps, top, kill, htop — managing running processes and system resources.", level: "intermediate", order: 4 },
  { id: "os-05", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Shell Scripting (Bash)", description: "Writing bash scripts — variables, loops, conditionals, functions, automation.", level: "intermediate", order: 5 },
  { id: "os-06", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Package Management", description: "apt, yum, pip — installing, updating, removing software on Linux.", level: "intermediate", order: 6 },
  { id: "os-07", phase: "Phase 3: Operating Systems & Linux", category: "Linux Advanced", title: "Linux Networking & SSH", description: "ifconfig, netstat, iptables, SSH keys — networking from the terminal.", level: "advanced", order: 7 },
  { id: "os-08", phase: "Phase 3: Operating Systems & Linux", category: "Linux Advanced", title: "System Hardening", description: "Securing a Linux server — disabling root login, fail2ban, ufw, auditing.", level: "advanced", order: 8 },

  // Phase 4: Programming
  { id: "prog-01", phase: "Phase 4: Programming", category: "Python Basics", title: "Python Introduction", description: "Variables, data types, print, input — your first Python programs.", level: "beginner", order: 1 },
  { id: "prog-02", phase: "Phase 4: Programming", category: "Python Basics", title: "Control Flow & Functions", description: "if/else, for/while loops, defining and calling functions in Python.", level: "beginner", order: 2 },
  { id: "prog-03", phase: "Phase 4: Programming", category: "Python Basics", title: "Lists, Dicts & File I/O", description: "Python data structures, reading/writing files, working with JSON.", level: "beginner", order: 3 },
  { id: "prog-04", phase: "Phase 4: Programming", category: "Python Intermediate", title: "Object-Oriented Python", description: "Classes, objects, inheritance, encapsulation — OOP concepts in Python.", level: "intermediate", order: 4 },
  { id: "prog-05", phase: "Phase 4: Programming", category: "Python Intermediate", title: "Python for Networking (socket, requests)", description: "Using socket module, making HTTP requests, building simple network tools.", level: "intermediate", order: 5 },
  { id: "prog-06", phase: "Phase 4: Programming", category: "Python Advanced", title: "Scripting for Automation", description: "Writing reusable scripts, argparse, automating repetitive security tasks.", level: "advanced", order: 6 },
  { id: "prog-07", phase: "Phase 4: Programming", category: "Other Languages", title: "JavaScript Basics", description: "Variables, functions, DOM — JS fundamentals for web security testing.", level: "beginner", order: 7 },
  { id: "prog-08", phase: "Phase 4: Programming", category: "Other Languages", title: "SQL Basics", description: "SELECT, INSERT, UPDATE, DELETE — databases and queries for security.", level: "beginner", order: 8 },
  { id: "prog-09", phase: "Phase 4: Programming", category: "Other Languages", title: "SQL Injection Deep Dive", description: "Understanding how SQL injection works, payloads, detection, prevention.", level: "advanced", order: 9 },

  // Phase 5: Web Development
  { id: "web-01", phase: "Phase 5: Web Development", category: "Frontend", title: "HTML & CSS Fundamentals", description: "Building web pages — structure, styling, forms, responsive design.", level: "beginner", order: 1 },
  { id: "web-02", phase: "Phase 5: Web Development", category: "Frontend", title: "JavaScript & DOM Manipulation", description: "Events, selectors, fetch API — making web pages interactive.", level: "intermediate", order: 2 },
  { id: "web-03", phase: "Phase 5: Web Development", category: "Backend", title: "How Web Servers Work", description: "Apache, Nginx, Node.js — server-side processing, request handling.", level: "intermediate", order: 3 },
  { id: "web-04", phase: "Phase 5: Web Development", category: "Backend", title: "REST APIs & JSON", description: "Building and consuming APIs — endpoints, methods, authentication.", level: "intermediate", order: 4 },
  { id: "web-05", phase: "Phase 5: Web Development", category: "Security Concepts", title: "Web Security Basics", description: "CORS, cookies, sessions, HTTPS — security concepts every developer needs.", level: "intermediate", order: 5 },
  { id: "web-06", phase: "Phase 5: Web Development", category: "Security Concepts", title: "OWASP Top 10", description: "The 10 most critical web vulnerabilities — XSS, CSRF, IDOR, and more.", level: "advanced", order: 6 },

  // Phase 6: Cybersecurity Fundamentals
  { id: "sec-01", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "CIA Triad & Security Models", description: "Confidentiality, Integrity, Availability — the foundation of cybersecurity.", level: "beginner", order: 1 },
  { id: "sec-02", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "Types of Cyber Attacks", description: "Phishing, ransomware, DDoS, MITM, social engineering — attack taxonomy.", level: "beginner", order: 2 },
  { id: "sec-03", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "Cryptography Basics", description: "Symmetric, asymmetric encryption, hashing, SSL/TLS, PKI.", level: "intermediate", order: 3 },
  { id: "sec-04", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "Incident Response & Forensics", description: "How to detect, respond to, and recover from a security incident.", level: "intermediate", order: 4 },
  { id: "sec-05", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "SIEM & Log Analysis", description: "Security information and event management — reading and analyzing logs.", level: "intermediate", order: 5 },
  { id: "sec-06", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "Security Compliance & Laws (India)", description: "IT Act 2000, CERT-In, PDPB — India's cybersecurity legal framework.", level: "advanced", order: 6 },

  // Phase 7: Ethical Hacking
  { id: "hack-01", phase: "Phase 7: Ethical Hacking", category: "Methodology", title: "Ethical Hacking Introduction & CEH", description: "What ethical hacking is, legal frameworks, bug bounty programs, responsible disclosure.", level: "beginner", order: 1 },
  { id: "hack-02", phase: "Phase 7: Ethical Hacking", category: "Methodology", title: "Reconnaissance & OSINT", description: "Passive and active recon — Google dorking, Shodan, theHarvester, Maltego.", level: "intermediate", order: 2 },
  { id: "hack-03", phase: "Phase 7: Ethical Hacking", category: "Scanning", title: "Vulnerability Scanning", description: "Nessus, OpenVAS, Nikto — automated vulnerability discovery and analysis.", level: "intermediate", order: 3 },
  { id: "hack-04", phase: "Phase 7: Ethical Hacking", category: "Scanning", title: "Port Scanning & Enumeration", description: "Advanced nmap techniques, service enumeration, OS fingerprinting.", level: "intermediate", order: 4 },
  { id: "hack-05", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Metasploit Framework", description: "Using Metasploit for exploitation — modules, payloads, post-exploitation.", level: "advanced", order: 5 },
  { id: "hack-06", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Web App Hacking (Burp Suite)", description: "Using Burp Suite — intercepting, modifying requests, finding web vulnerabilities.", level: "advanced", order: 6 },
  { id: "hack-07", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Mobile App Security Testing", description: "Android/iOS app analysis, APK reverse engineering, frida, objection.", level: "advanced", order: 7 },
  { id: "hack-08", phase: "Phase 7: Ethical Hacking", category: "Post-Exploitation", title: "Privilege Escalation", description: "Linux and Windows privilege escalation techniques used in pentests.", level: "advanced", order: 8 },
  { id: "hack-09", phase: "Phase 7: Ethical Hacking", category: "Post-Exploitation", title: "Report Writing & Documentation", description: "How to write a professional pentest report with findings and remediations.", level: "advanced", order: 9 },

  // Phase 8: AI & Machine Learning
  { id: "ai-01", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "What is AI & Machine Learning?", description: "Types of AI, supervised vs unsupervised, how models learn.", level: "beginner", order: 1 },
  { id: "ai-02", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "Python for Data Science (NumPy, Pandas)", description: "Data manipulation, analysis, visualization — the toolkit for ML.", level: "intermediate", order: 2 },
  { id: "ai-03", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "Machine Learning Algorithms", description: "Regression, classification, clustering, decision trees, neural networks.", level: "intermediate", order: 3 },
  { id: "ai-04", phase: "Phase 8: AI & Machine Learning", category: "AI in Security", title: "AI for Threat Detection", description: "Using ML to detect anomalies, intrusions, malware — AI in cybersecurity.", level: "advanced", order: 4 },
  { id: "ai-05", phase: "Phase 8: AI & Machine Learning", category: "AI in Security", title: "LLMs & Prompt Injection", description: "How large language models work, prompt injection attacks, AI security risks.", level: "advanced", order: 5 },
  { id: "ai-06", phase: "Phase 8: AI & Machine Learning", category: "Building AI", title: "Building a Simple AI Tool", description: "Creating a practical AI-powered security tool using APIs and Python.", level: "advanced", order: 6 },

  // Phase 9: Health & Productivity
  { id: "health-01", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Posture & Ergonomics for Developers", description: "Correct sitting posture, monitor height, keyboard position to avoid injury.", level: "beginner", order: 1 },
  { id: "health-02", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Eye Care & Screen Time", description: "20-20-20 rule, blue light, eye exercises — protecting vision during long sessions.", level: "beginner", order: 2 },
  { id: "health-03", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Exercise Routine for Tech Workers", description: "Simple daily exercises, stretches, and movement habits for desk workers.", level: "beginner", order: 3 },
  { id: "health-04", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Focus & Deep Work Techniques", description: "Pomodoro, flow state, distraction elimination — maximizing cognitive output.", level: "intermediate", order: 4 },
  { id: "health-05", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Sleep & Recovery for Brain Performance", description: "Why sleep matters for learning, memory consolidation, cognitive function.", level: "intermediate", order: 5 },
  { id: "health-06", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Nutrition & Brain Foods", description: "Diet for mental clarity — hydration, omega-3, reducing sugar, meal timing.", level: "intermediate", order: 6 },
];

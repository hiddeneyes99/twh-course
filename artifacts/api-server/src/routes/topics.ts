import { Router, type IRouter } from "express";
import { curriculum } from "../lib/curriculum";
import { ListTopicsQueryParams, ListTopicsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface TopicSection {
  heading: string;
  content: string;
}

interface ExplainResult {
  sections: TopicSection[];
  summary: string;
}

const explainCache = new Map<string, ExplainResult>();

const categoryImages: Record<string, string> = {
  "Hardware": "https://images.unsplash.com/photo-1593640408182-31c228b24f19?w=800&fit=crop&auto=format",
  "Software": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&fit=crop&auto=format",
  "Binary & Data": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop&auto=format",
  "Virtualization": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&fit=crop&auto=format",
  "Lab Setup": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop&auto=format",
  "Fundamentals": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop&auto=format",
  "Protocols": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&fit=crop&auto=format",
  "Attacks": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Wireless": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&fit=crop&auto=format",
  "Anonymity": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&fit=crop&auto=format",
  "Linux Core": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&fit=crop&auto=format",
  "Linux Advanced": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&fit=crop&auto=format",
  "Windows": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&fit=crop&auto=format",
  "Python": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "C & Memory": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&fit=crop&auto=format",
  "Web Languages": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
  "Databases": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&fit=crop&auto=format",
  "Tools": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Web Basics": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&fit=crop&auto=format",
  "OWASP": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "Injection": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Authentication": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&fit=crop&auto=format",
  "Advanced": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&auto=format",
  "Concepts": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&auto=format",
  "Threats": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Cryptography": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&fit=crop&auto=format",
  "Defense": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Incident Response": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&fit=crop&auto=format",
  "Compliance": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&fit=crop&auto=format",
  "Risk": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop&auto=format",
  "Methodology": "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&fit=crop&auto=format",
  "Recon": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&auto=format",
  "Vulnerability": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "Exploitation": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Password": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&fit=crop&auto=format",
  "Social Eng": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&fit=crop&auto=format",
  "Post-Exploit": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&auto=format",
  "Mobile": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
  "Reporting": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&fit=crop&auto=format",
  "Red Team Core": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop&auto=format",
  "C2": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop&auto=format",
  "Active Directory": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&fit=crop&auto=format",
  "Lateral Movement": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop&auto=format",
  "Evasion": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&fit=crop&auto=format",
  "Persistence & Exfil": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Physical": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Malware": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Malware Analysis": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "SOC": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop&auto=format",
  "SIEM": "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&fit=crop&auto=format",
  "Forensics": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&auto=format",
  "Threat Hunting": "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&fit=crop&auto=format",
  "IR": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&fit=crop&auto=format",
  "Detection": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Cloud Basics": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&auto=format",
  "AWS": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&auto=format",
  "Containers": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&fit=crop&auto=format",
  "DevSecOps": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "IaC": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&fit=crop&auto=format",
  "Binary Exploit": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&fit=crop&auto=format",
  "Advanced Web": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
  "Bug Bounty": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop&auto=format",
  "Certifications": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&fit=crop&auto=format",
  "Career": "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&fit=crop&auto=format",
  "Future": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&auto=format",
  "Security Basics": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "Network Defense": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Linux Intermediate": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&fit=crop&auto=format",
  "Web Security": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
};

const defaultImage = "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&fit=crop&auto=format";

async function generateExplanation(topicTitle: string, topicDescription: string): Promise<ExplainResult> {
  const prompt = `Tum ek friendly IT trainer ho jo students ko Hinglish mein samjhate ho — jaise ek bade bhai ya dost samjhata hai. Simple, clear, aur engaging language use karo.

Topic: "${topicTitle}"
Description: "${topicDescription}"

Is topic ko 3-4 sections mein samjhao. Return a JSON object with:
- sections: array of 3-4 objects, har object mein:
  - heading: string (catchy heading relevant emoji ke saath, Hinglish mein)
  - content: string (2-3 paragraphs Hinglish mein, examples aur analogies use karo, technical English terms rakhna hai lekin baaki Hindi mein)
- summary: string (ek line mein is topic ka main point Hinglish mein)

Sirf valid JSON return karo, koi markdown nahi, koi extra text nahi.`;

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${err}`);
  }

  const data = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(text) as ExplainResult;
}

router.get("/topics", async (req, res): Promise<void> => {
  const query = ListTopicsQueryParams.safeParse(req.query);
  let topics = curriculum;
  if (query.success) {
    if (query.data.phase) {
      topics = topics.filter((t) => t.phase === query.data.phase);
    }
    if (query.data.category) {
      topics = topics.filter((t) => t.category === query.data.category);
    }
  }
  res.json(ListTopicsResponse.parse(topics));
});

router.get("/topics/:topicId/explain", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const topic = curriculum.find((t) => t.id === rawId);
  if (!topic) {
    res.status(404).json({ error: "Topic not found" });
    return;
  }
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  let result = explainCache.get(rawId);
  if (!result) {
    result = await generateExplanation(topic.title, topic.description);
    explainCache.set(rawId, result);
  }

  const imageUrl = categoryImages[topic.category] ?? defaultImage;

  res.json({
    topicId: topic.id,
    topicTitle: topic.title,
    imageUrl,
    sections: result.sections,
    summary: result.summary,
  });
});

export default router;

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
  "Fundamentals": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fit=crop&auto=format",
  "Protocols": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&fit=crop&auto=format",
  "Security Basics": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format",
  "Cryptography": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&fit=crop&auto=format",
  "Malware": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&auto=format",
  "Web Security": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
  "Linux": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&fit=crop&auto=format",
  "Windows": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&fit=crop&auto=format",
  "Network Defense": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&auto=format",
  "Incident Response": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&fit=crop&auto=format",
  "Forensics": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&auto=format",
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

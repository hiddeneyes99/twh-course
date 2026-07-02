import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import { curriculum } from "../lib/curriculum";
import { getApiKeyForMember } from "../lib/apiKey";
import {
  GenerateQuizResponse,
  SubmitQuizBody,
  SubmitQuizResponse,
  GetQuizStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface GeminiQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Cache keyed by "topicId:memberId" so each member has their own questions
const quizCache = new Map<string, GeminiQuizQuestion[]>();

function parseMemberId(req: { headers: Record<string, string | string[] | undefined> }): number | null {
  const raw = req.headers["x-member-id"];
  const val = Array.isArray(raw) ? raw[0] : raw;
  const parsed = parseInt(val ?? "", 10);
  return isNaN(parsed) ? null : parsed;
}

function parseKeyPoints(req: { headers: Record<string, string | string[] | undefined> }): string[] {
  try {
    const raw = req.headers["x-key-points"];
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (!val) return [];
    // Frontend sends encodeURIComponent(JSON.stringify(keyPoints))
    return JSON.parse(decodeURIComponent(val)) as string[];
  } catch {
    return [];
  }
}

async function generateQuestionsWithGemini(
  topicTitle: string,
  topicDescription: string,
  keyPoints: string[],
  apiKey: string,
): Promise<GeminiQuizQuestion[]> {
  const keyPointsBlock = keyPoints.length > 0
    ? `\nYeh specific key concepts hain jo is topic mein cover hue hain — SIRF inhi ke baare mein questions banao:\n${keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n")}\n`
    : "";

  const prompt = `Tum ek IT training quiz generator ho. Is topic ke liye EXACTLY 5 multiple choice questions banao.

IMPORTANT RULES:
1. Questions SIRF is topic ke specific concepts ke baare mein ho — koi bhi alag topic ya general IT knowledge mat poochho.
2. Har question directly is topic se related hona chahiye — jaise student ne yeh topic padha ho aur usse test kar rahe ho.
3. Questions aur options HINGLISH mein likho (Hindi + English mix). Technical terms English mein rakho lekin baaki Hindi mein.
4. Options realistic aur confusing honein chahiye — seedha obvious mat banao.

Topic: "${topicTitle}"
Description: "${topicDescription}"
${keyPointsBlock}
Return a JSON array of exactly 5 questions. Har question mein:
- question: string (Hinglish mein, is topic ke specific concept ke baare mein)
- options: array of exactly 4 strings (Hinglish mein, realistic choices)
- correctIndex: number (0-3, sahi answer ka index)
- explanation: string (Hinglish mein brief explanation kyun yeh sahi hai)

Sirf valid JSON array return karo, koi markdown nahi, koi extra text nahi.`;

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 2048,
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
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  const questions: GeminiQuizQuestion[] = JSON.parse(text);
  return questions.slice(0, 5);
}

router.get("/quiz/generate/:topicId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const topic = curriculum.find((t) => t.id === rawId);
  if (!topic) { res.status(404).json({ error: "Topic not found" }); return; }

  const memberId = parseMemberId(req as Parameters<typeof parseMemberId>[0]);
  const keyPoints = parseKeyPoints(req as Parameters<typeof parseKeyPoints>[0]);
  const apiKey = await getApiKeyForMember(memberId);

  if (!apiKey) { res.status(500).json({ error: "Gemini API key not configured" }); return; }

  // Cache key includes memberId so each member uses their own quota & questions
  const cacheKey = memberId ? `${rawId}:${memberId}` : rawId;
  let questions = quizCache.get(cacheKey);
  if (!questions) {
    questions = await generateQuestionsWithGemini(topic.title, topic.description, keyPoints, apiKey);
    quizCache.set(cacheKey, questions);
  }

  res.json(GenerateQuizResponse.parse({
    topicId: topic.id,
    topicTitle: topic.title,
    questions: questions.map((q, i) => ({ index: i, question: q.question, options: q.options })),
  }));
});

router.post("/quiz/submit", async (req, res): Promise<void> => {
  const parsed = SubmitQuizBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { memberId, topicId, answers } = parsed.data;
  const topic = curriculum.find((t) => t.id === topicId);
  if (!topic) { res.status(404).json({ error: "Topic not found" }); return; }

  // Try member-specific cache first, then generic cache
  let questions = quizCache.get(`${topicId}:${memberId}`) ?? quizCache.get(topicId);
  if (!questions) {
    const apiKey = await getApiKeyForMember(memberId);
    if (apiKey) {
      questions = await generateQuestionsWithGemini(topic.title, topic.description, [], apiKey);
      quizCache.set(`${topicId}:${memberId}`, questions);
    }
  }
  if (!questions || questions.length === 0) {
    res.status(400).json({ error: "Quiz questions not found. Please start the quiz first." });
    return;
  }

  let score = 0;
  const feedback = questions.map((q, i) => {
    const selected = answers[i] ?? -1;
    const correct = selected === q.correctIndex;
    if (correct) score++;
    return { questionIndex: i, correct, correctOption: q.correctIndex, explanation: q.explanation };
  });

  const totalQuestions = questions.length;
  const percentScore = Math.round((score / totalQuestions) * 100);
  const passed = percentScore >= 70;

  await supabase.from("quiz_attempts").insert({
    member_id: memberId,
    topic_id: topicId,
    score,
    total_questions: totalQuestions,
    passed,
    answers,
  });

  if (passed) {
    const { data: existing } = await supabase
      .from("progress")
      .select("id")
      .eq("member_id", memberId)
      .eq("topic_id", topicId)
      .single();
    if (!existing) {
      await supabase.from("progress").insert({ member_id: memberId, topic_id: topicId });
    }
  }

  res.json(SubmitQuizResponse.parse({ passed, score, totalQuestions, percentScore, feedback }));
});

router.get("/quiz/status/:memberId/:topicId", async (req, res): Promise<void> => {
  const rawMemberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const rawTopicId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const memberId = parseInt(rawMemberId, 10);

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("member_id", memberId)
    .eq("topic_id", rawTopicId);

  const list = attempts ?? [];
  const passed = list.some((a) => a.passed);
  const bestScore = list.length > 0 ? Math.max(...list.map((a) => a.score)) : 0;

  res.json(GetQuizStatusResponse.parse({ memberId, topicId: rawTopicId, passed, bestScore, attempts: list.length }));
});

router.get("/quiz/member/:memberId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const memberId = parseInt(rawId, 10);

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("member_id", memberId);

  const byTopic = new Map<string, { passed: boolean; bestScore: number; attempts: number }>();
  for (const a of (attempts ?? [])) {
    const ex = byTopic.get(a.topic_id);
    if (!ex) {
      byTopic.set(a.topic_id, { passed: a.passed, bestScore: a.score, attempts: 1 });
    } else {
      byTopic.set(a.topic_id, {
        passed: ex.passed || a.passed,
        bestScore: Math.max(ex.bestScore, a.score),
        attempts: ex.attempts + 1,
      });
    }
  }

  const statuses = Array.from(byTopic.entries()).map(([topicId, data]) =>
    GetQuizStatusResponse.parse({ memberId, topicId, ...data })
  );

  res.json(statuses);
});

export default router;

import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, quizAttemptsTable, progressTable } from "@workspace/db";
import { curriculum } from "../lib/curriculum";
import {
  GenerateQuizResponse,
  SubmitQuizBody,
  SubmitQuizResponse,
  GetQuizStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface GeminiQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// In-memory cache for quiz questions with correct answers (server-side only)
const quizCache = new Map<string, GeminiQuizQuestion[]>();

async function generateQuestionsWithGemini(topicTitle: string, topicDescription: string): Promise<GeminiQuizQuestion[]> {
  const prompt = `You are an IT training quiz generator. Generate exactly 5 multiple choice questions for this IT topic.

Topic: "${topicTitle}"
Description: "${topicDescription}"

Return a JSON array of exactly 5 questions. Each question must have:
- question: string (the question text)
- options: array of exactly 4 strings (answer choices)
- correctIndex: number (0-3, index of the correct option in the options array)
- explanation: string (brief explanation of the correct answer)

Return ONLY a valid JSON array, no markdown, no extra text.`;

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
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

// GET /quiz/generate/:topicId
router.get("/quiz/generate/:topicId", async (req, res): Promise<void> => {
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

  const questions = await generateQuestionsWithGemini(topic.title, topic.description);
  quizCache.set(rawId, questions);

  res.json(GenerateQuizResponse.parse({
    topicId: topic.id,
    topicTitle: topic.title,
    questions: questions.map((q, i) => ({
      index: i,
      question: q.question,
      options: q.options,
    })),
  }));
});

// POST /quiz/submit
router.post("/quiz/submit", async (req, res): Promise<void> => {
  const parsed = SubmitQuizBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { memberId, topicId, answers } = parsed.data;
  const topic = curriculum.find((t) => t.id === topicId);
  if (!topic) {
    res.status(404).json({ error: "Topic not found" });
    return;
  }

  let questions = quizCache.get(topicId);
  if (!questions && GEMINI_API_KEY) {
    questions = await generateQuestionsWithGemini(topic.title, topic.description);
    quizCache.set(topicId, questions);
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

  await db.insert(quizAttemptsTable).values({
    memberId,
    topicId,
    score,
    totalQuestions,
    passed,
    answers: answers as number[],
  });

  if (passed) {
    const existing = await db.select().from(progressTable).where(
      and(eq(progressTable.memberId, memberId), eq(progressTable.topicId, topicId))
    );
    if (existing.length === 0) {
      await db.insert(progressTable).values({ memberId, topicId });
    }
  }

  res.json(SubmitQuizResponse.parse({ passed, score, totalQuestions, percentScore, feedback }));
});

// GET /quiz/status/:memberId/:topicId
router.get("/quiz/status/:memberId/:topicId", async (req, res): Promise<void> => {
  const rawMemberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const rawTopicId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const memberId = parseInt(rawMemberId, 10);

  const attempts = await db.select().from(quizAttemptsTable).where(
    and(eq(quizAttemptsTable.memberId, memberId), eq(quizAttemptsTable.topicId, rawTopicId))
  );

  const passed = attempts.some((a) => a.passed);
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  res.json(GetQuizStatusResponse.parse({ memberId, topicId: rawTopicId, passed, bestScore, attempts: attempts.length }));
});

// GET /quiz/member/:memberId
router.get("/quiz/member/:memberId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const memberId = parseInt(rawId, 10);

  const attempts = await db.select().from(quizAttemptsTable).where(eq(quizAttemptsTable.memberId, memberId));

  const byTopic = new Map<string, { passed: boolean; bestScore: number; attempts: number }>();
  for (const a of attempts) {
    const ex = byTopic.get(a.topicId);
    if (!ex) {
      byTopic.set(a.topicId, { passed: a.passed, bestScore: a.score, attempts: 1 });
    } else {
      byTopic.set(a.topicId, {
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

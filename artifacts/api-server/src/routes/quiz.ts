import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import { curriculum } from "../lib/curriculum";
import { staticCorrectAnswers } from "../lib/staticCorrectAnswers";
import {
  SubmitQuizBody,
  SubmitQuizResponse,
  GetQuizStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/quiz/submit", async (req, res): Promise<void> => {
  const parsed = SubmitQuizBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { memberId, topicId, answers } = parsed.data;
  const topic = curriculum.find((t) => t.id === topicId);
  if (!topic) { res.status(404).json({ error: "Topic not found" }); return; }

  const correctIndices = staticCorrectAnswers[topicId];
  if (!correctIndices || correctIndices.length === 0) {
    res.status(400).json({ error: "Quiz questions not found for this topic." });
    return;
  }

  let score = 0;
  const feedback = correctIndices.map((correctIndex, i) => {
    const selected = answers[i] ?? -1;
    const correct = selected === correctIndex;
    if (correct) score++;
    return { questionIndex: i, correct, correctOption: correctIndex, explanation: "" };
  });
  const totalQuestions = correctIndices.length;
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

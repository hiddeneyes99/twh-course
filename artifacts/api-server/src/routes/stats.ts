import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import { curriculum } from "../lib/curriculum";
import { GetStatsResponse, GetMemberStatsResponse, GetMemberStatsParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const { data: members } = await supabase.from("members").select("*");
  const { data: allProgress } = await supabase.from("progress").select("*");
  const totalTopics = curriculum.length;
  const totalMembers = (members ?? []).length;
  const totalCompletions = (allProgress ?? []).length;

  let avgCompletionPercent = 0;
  let topPerformer: string | null = null;
  let topCount = -1;

  if (totalMembers > 0) {
    const perMember: Record<number, number> = {};
    for (const p of (allProgress ?? [])) {
      perMember[p.member_id] = (perMember[p.member_id] || 0) + 1;
    }
    const total = (members ?? []).reduce((sum, m) => sum + (perMember[m.id] || 0), 0);
    avgCompletionPercent = Math.round((total / (totalMembers * totalTopics)) * 100);
    for (const m of (members ?? [])) {
      const count = perMember[m.id] || 0;
      if (count > topCount) { topCount = count; topPerformer = m.name; }
    }
  }

  const phases = [...new Set(curriculum.map((t) => t.phase))];
  const phaseBreakdown = phases.map((phase) => {
    const phaseTopics = curriculum.filter((t) => t.phase === phase);
    const phaseIds = new Set(phaseTopics.map((t) => t.id));
    const phaseCompletions = (allProgress ?? []).filter((p) => phaseIds.has(p.topic_id));
    const avgCompleted = totalMembers > 0
      ? Math.round((phaseCompletions.length / (totalMembers * phaseTopics.length)) * 100)
      : 0;
    return { phase, totalTopics: phaseTopics.length, avgCompleted };
  });

  res.json(GetStatsResponse.parse({ totalMembers, totalTopics, totalCompletions, avgCompletionPercent, topPerformer, phaseBreakdown }));
});

router.get("/stats/member/:memberId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const params = GetMemberStatsParams.safeParse({ memberId: parseInt(rawId, 10) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const { data: member } = await supabase.from("members").select("*").eq("id", params.data.memberId).single();
  if (!member) { res.status(404).json({ error: "Member not found" }); return; }

  const { data: progress } = await supabase.from("progress").select("*").eq("member_id", params.data.memberId);
  const completedIds = new Set((progress ?? []).map((p) => p.topic_id));
  const totalTopics = curriculum.length;
  const totalCompleted = completedIds.size;
  const completionPercent = Math.round((totalCompleted / totalTopics) * 100);

  const phases = [...new Set(curriculum.map((t) => t.phase))];
  const byPhase = phases.map((phase) => {
    const phaseTopics = curriculum.filter((t) => t.phase === phase);
    const completed = phaseTopics.filter((t) => completedIds.has(t.id)).length;
    return { phase, completed, total: phaseTopics.length };
  });

  res.json(GetMemberStatsResponse.parse({ memberId: member.id, memberName: member.name, totalCompleted, totalTopics, completionPercent, byPhase }));
});

router.get("/stats/leaderboard", async (_req, res): Promise<void> => {
  const { data: members } = await supabase.from("members").select("*");
  const { data: allProgress } = await supabase.from("progress").select("*");
  const totalTopics = curriculum.length;

  const perMember: Record<number, number> = {};
  for (const p of (allProgress ?? [])) {
    perMember[p.member_id] = (perMember[p.member_id] || 0) + 1;
  }

  const entries = (members ?? [])
    .map((m) => {
      const totalCompleted = perMember[m.id] || 0;
      const completionPercent = Math.round((totalCompleted / totalTopics) * 100);
      return { memberId: m.id, memberName: m.name, memberRole: m.role ?? null, completionPercent, totalCompleted, totalTopics };
    })
    .sort((a, b) => b.completionPercent - a.completionPercent || b.totalCompleted - a.totalCompleted)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  res.json(entries);
});

export default router;

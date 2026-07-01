import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import {
  GetMemberProgressParams,
  GetMemberProgressResponse,
  MarkCompleteBody,
  MarkCompleteResponse,
  UnmarkCompleteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/progress/:memberId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const params = GetMemberProgressParams.safeParse({ memberId: parseInt(rawId, 10) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("member_id", params.data.memberId);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(GetMemberProgressResponse.parse((data ?? []).map((r) => ({
    id: r.id, memberId: r.member_id, topicId: r.topic_id, completedAt: r.completed_at,
  }))));
});

router.post("/progress", async (req, res): Promise<void> => {
  const parsed = MarkCompleteBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { data: existing } = await supabase
    .from("progress")
    .select("*")
    .eq("member_id", parsed.data.memberId)
    .eq("topic_id", parsed.data.topicId)
    .single();
  if (existing) {
    res.status(201).json(MarkCompleteResponse.parse({
      id: existing.id, memberId: existing.member_id, topicId: existing.topic_id, completedAt: existing.completed_at,
    }));
    return;
  }
  const { data, error } = await supabase
    .from("progress")
    .insert({ member_id: parsed.data.memberId, topic_id: parsed.data.topicId })
    .select()
    .single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(MarkCompleteResponse.parse({
    id: data.id, memberId: data.member_id, topicId: data.topic_id, completedAt: data.completed_at,
  }));
});

router.delete("/progress/:memberId/:topicId", async (req, res): Promise<void> => {
  const rawMemberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const rawTopicId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const params = UnmarkCompleteParams.safeParse({ memberId: parseInt(rawMemberId, 10), topicId: rawTopicId });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("member_id", params.data.memberId)
    .eq("topic_id", params.data.topicId);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.sendStatus(204);
});

export default router;

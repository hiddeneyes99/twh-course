import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, progressTable } from "@workspace/db";
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
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const rows = await db.select().from(progressTable).where(eq(progressTable.memberId, params.data.memberId));
  res.json(GetMemberProgressResponse.parse(rows.map((r) => ({ ...r, completedAt: r.completedAt.toISOString() }))));
});

router.post("/progress", async (req, res): Promise<void> => {
  const parsed = MarkCompleteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  // upsert — ignore if already exists
  const existing = await db.select().from(progressTable).where(
    and(eq(progressTable.memberId, parsed.data.memberId), eq(progressTable.topicId, parsed.data.topicId))
  );
  if (existing.length > 0) {
    res.status(201).json(MarkCompleteResponse.parse({ ...existing[0], completedAt: existing[0].completedAt.toISOString() }));
    return;
  }
  const [row] = await db.insert(progressTable).values(parsed.data).returning();
  res.status(201).json(MarkCompleteResponse.parse({ ...row, completedAt: row.completedAt.toISOString() }));
});

router.delete("/progress/:memberId/:topicId", async (req, res): Promise<void> => {
  const rawMemberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
  const rawTopicId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  const params = UnmarkCompleteParams.safeParse({ memberId: parseInt(rawMemberId, 10), topicId: rawTopicId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(progressTable).where(
    and(eq(progressTable.memberId, params.data.memberId), eq(progressTable.topicId, params.data.topicId))
  );
  res.sendStatus(204);
});

export default router;

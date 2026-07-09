import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase";
import { db, memberPinsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type AuthenticatedRequest } from "../lib/auth";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { memberId: number, pin: string }
 * Returns: { token, memberId, memberName } or { needsSetup: true }
 */
router.post("/auth/login", async (req, res): Promise<void> => {
  const { memberId, pin } = req.body as { memberId?: number; pin?: string };
  if (!memberId || !pin) {
    res.status(400).json({ error: "memberId aur pin dono chahiye." });
    return;
  }

  // Verify member exists in Supabase
  const { data: member, error } = await supabase
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (error || !member) {
    res.status(404).json({ error: "Member nahi mila." });
    return;
  }

  // Fetch PIN from Replit DB (drizzle)
  const [pinRecord] = await db
    .select()
    .from(memberPinsTable)
    .where(eq(memberPinsTable.memberId, memberId))
    .limit(1);

  if (!pinRecord) {
    res.status(403).json({
      error: "PIN abhi set nahi hua. Pehle apna PIN setup karo.",
      needsSetup: true,
    });
    return;
  }

  const valid = await bcrypt.compare(pin, pinRecord.pinHash);
  if (!valid) {
    res.status(401).json({ error: "Galat PIN hai. Dobara try karo." });
    return;
  }

  const token = signToken({
    memberId: member.id,
    memberName: member.name,
    isOwner: member.name === "Twh",
  });
  res.json({ token, memberId: member.id, memberName: member.name });
});

/**
 * POST /api/auth/setup-pin
 * Body: { memberId: number, pin: string }
 * Only works if no PIN exists yet (first-time setup per member).
 */
router.post("/auth/setup-pin", async (req, res): Promise<void> => {
  const { memberId, pin } = req.body as { memberId?: number; pin?: string };
  if (!memberId || !pin || pin.length < 4) {
    res.status(400).json({ error: "memberId aur kam se kam 4 character ka PIN chahiye." });
    return;
  }

  // Verify member exists in Supabase
  const { data: member, error } = await supabase
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (error || !member) {
    res.status(404).json({ error: "Member nahi mila." });
    return;
  }

  // Check if PIN already set
  const [existing] = await db
    .select()
    .from(memberPinsTable)
    .where(eq(memberPinsTable.memberId, memberId))
    .limit(1);

  if (existing) {
    res.status(409).json({
      error: "PIN already set hai. Change karne ke liye current PIN se login karo.",
    });
    return;
  }

  const hash = await bcrypt.hash(pin, 12);
  await db.insert(memberPinsTable).values({ memberId: member.id, pinHash: hash });

  const token = signToken({
    memberId: member.id,
    memberName: member.name,
    isOwner: member.name === "Twh",
  });
  res.json({ token, memberId: member.id, memberName: member.name });
});

/**
 * POST /api/auth/change-pin
 * Requires: Bearer token (can only change own PIN)
 * Body: { currentPin: string, newPin: string }
 */
router.post("/auth/change-pin", requireAuth, async (req, res): Promise<void> => {
  const { auth } = req as AuthenticatedRequest;
  const { currentPin, newPin } = req.body as { currentPin?: string; newPin?: string };

  if (!currentPin || !newPin || newPin.length < 4) {
    res.status(400).json({ error: "currentPin aur naya 4+ character ka newPin chahiye." });
    return;
  }

  const [pinRecord] = await db
    .select()
    .from(memberPinsTable)
    .where(eq(memberPinsTable.memberId, auth.memberId))
    .limit(1);

  if (!pinRecord) {
    res.status(404).json({ error: "PIN record nahi mila." });
    return;
  }

  const valid = await bcrypt.compare(currentPin, pinRecord.pinHash);
  if (!valid) {
    res.status(401).json({ error: "Current PIN galat hai." });
    return;
  }

  const hash = await bcrypt.hash(newPin, 12);
  await db
    .update(memberPinsTable)
    .set({ pinHash: hash, updatedAt: new Date() })
    .where(eq(memberPinsTable.memberId, auth.memberId));

  res.json({ ok: true });
});

export default router;

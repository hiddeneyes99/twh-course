import { Router } from "express";
import { supabase } from "../lib/supabase";
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
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (memberError || !member) {
    res.status(404).json({ error: "Member nahi mila." });
    return;
  }

  // Fetch PIN from Supabase
  const { data: pinRecord, error: pinError } = await supabase
    .from("member_pins")
    .select("pin_hash")
    .eq("member_id", memberId)
    .single();

  if (pinError || !pinRecord) {
    res.status(403).json({
      error: "PIN abhi set nahi hua. Pehle apna PIN setup karo.",
      needsSetup: true,
    });
    return;
  }

  if (pin !== pinRecord.pin_hash) {
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

  // Verify member exists
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, name")
    .eq("id", memberId)
    .single();

  if (memberError || !member) {
    res.status(404).json({ error: "Member nahi mila." });
    return;
  }

  // Check if PIN already set
  const { data: existing } = await supabase
    .from("member_pins")
    .select("member_id")
    .eq("member_id", memberId)
    .single();

  if (existing) {
    res.status(409).json({
      error: "PIN already set hai. Change karne ke liye current PIN se login karo.",
    });
    return;
  }

  const { error: insertError } = await supabase
    .from("member_pins")
    .insert({ member_id: member.id, pin_hash: pin });

  if (insertError) {
    res.status(500).json({ error: "PIN save nahi hua. Dobara try karo." });
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

  const { data: pinRecord, error: pinError } = await supabase
    .from("member_pins")
    .select("pin_hash")
    .eq("member_id", auth.memberId)
    .single();

  if (pinError || !pinRecord) {
    res.status(404).json({ error: "PIN record nahi mila." });
    return;
  }

  if (currentPin !== pinRecord.pin_hash) {
    res.status(401).json({ error: "Current PIN galat hai." });
    return;
  }

  const { error: updateError } = await supabase
    .from("member_pins")
    .update({ pin_hash: newPin, updated_at: new Date().toISOString() })
    .eq("member_id", auth.memberId);

  if (updateError) {
    res.status(500).json({ error: "PIN update nahi hua. Dobara try karo." });
    return;
  }

  res.json({ ok: true });
});

/**
 * POST /api/auth/switch
 * Owner can switch to any member without PIN.
 * Non-owner can only switch to a member by providing their PIN.
 * Body: { targetMemberId: number, pin?: string }
 */
router.post("/auth/switch", requireAuth, async (req, res): Promise<void> => {
  const { auth } = req as AuthenticatedRequest;
  const { targetMemberId, pin } = req.body as { targetMemberId?: number; pin?: string };

  if (!targetMemberId) {
    res.status(400).json({ error: "targetMemberId chahiye." });
    return;
  }

  // Fetch target member from Supabase
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, name")
    .eq("id", targetMemberId)
    .single();

  if (memberError || !member) {
    res.status(404).json({ error: "Member nahi mila." });
    return;
  }

  // Owner can switch freely
  if (auth.isOwner) {
    const token = signToken({
      memberId: member.id,
      memberName: member.name,
      isOwner: member.name === "Twh",
    });
    res.json({ token, memberId: member.id, memberName: member.name });
    return;
  }

  // Same member — allow freely
  if (auth.memberId === targetMemberId) {
    const token = signToken({
      memberId: member.id,
      memberName: member.name,
      isOwner: false,
    });
    res.json({ token, memberId: member.id, memberName: member.name });
    return;
  }

  // Non-owner switching to someone else — PIN required
  if (!pin) {
    res.status(403).json({ error: "Doosre account mein jaane ke liye PIN chahiye.", needsPin: true });
    return;
  }

  const { data: pinRecord, error: pinError } = await supabase
    .from("member_pins")
    .select("pin_hash")
    .eq("member_id", targetMemberId)
    .single();

  if (pinError || !pinRecord) {
    res.status(403).json({ error: "Is member ka PIN set nahi hai.", needsPin: true });
    return;
  }

  if (pin !== pinRecord.pin_hash) {
    res.status(401).json({ error: "Galat PIN. Dobara try karo." });
    return;
  }

  const token = signToken({
    memberId: member.id,
    memberName: member.name,
    isOwner: member.name === "Twh",
  });
  res.json({ token, memberId: member.id, memberName: member.name });
});

export default router;

import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";
import {
  CreateMemberBody,
  GetMemberParams,
  DeleteMemberParams,
  ListMembersResponse,
  CreateMemberResponse,
  GetMemberResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/members", async (_req, res): Promise<void> => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(ListMembersResponse.parse((data ?? []).map((m) => ({
    id: m.id, name: m.name, role: m.role ?? null, createdAt: m.created_at,
  }))));
});

router.post("/members", async (req, res): Promise<void> => {
  const parsed = CreateMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { data, error } = await supabase
    .from("members")
    .insert({ name: parsed.data.name, role: parsed.data.role ?? null })
    .select()
    .single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(CreateMemberResponse.parse({
    id: data.id, name: data.name, role: data.role ?? null, createdAt: data.created_at,
  }));
});

router.get("/members/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetMemberParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const { data, error } = await supabase.from("members").select("*").eq("id", params.data.id).single();
  if (error || !data) { res.status(404).json({ error: "Member not found" }); return; }
  res.json(GetMemberResponse.parse({ id: data.id, name: data.name, role: data.role ?? null, createdAt: data.created_at }));
});

router.delete("/members/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteMemberParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const { error } = await supabase.from("members").delete().eq("id", params.data.id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.sendStatus(204);
});

export default router;

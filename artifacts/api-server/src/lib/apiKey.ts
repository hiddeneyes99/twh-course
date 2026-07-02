import { supabase } from "./supabase";

// Cache so we don't hit DB on every request
const memberKeyCache = new Map<number, string>();

/**
 * Returns the Gemini API key for the given member.
 * Looks up the member's name, then reads env var GEMINI_API_KEY_<NAME>.
 * Falls back to GEMINI_API_KEY if member-specific key is not set.
 */
export async function getApiKeyForMember(memberId: number | null | undefined): Promise<string> {
  const fallback = process.env.GEMINI_API_KEY ?? "";

  if (!memberId) return fallback;

  if (memberKeyCache.has(memberId)) {
    return memberKeyCache.get(memberId)!;
  }

  try {
    const { data } = await supabase
      .from("members")
      .select("name")
      .eq("id", memberId)
      .single();

    if (!data?.name) return fallback;

    // e.g. "Twh" → GEMINI_API_KEY_TWH, "Prince" → GEMINI_API_KEY_PRINCE
    const envName = `GEMINI_API_KEY_${data.name.trim().toUpperCase().replace(/\s+/g, "_")}`;
    const key = process.env[envName] ?? fallback;
    memberKeyCache.set(memberId, key);
    return key;
  } catch {
    return fallback;
  }
}

/** Invalidate cached key for a member (call after member name change). */
export function clearMemberKeyCache(memberId?: number) {
  if (memberId !== undefined) {
    memberKeyCache.delete(memberId);
  } else {
    memberKeyCache.clear();
  }
}

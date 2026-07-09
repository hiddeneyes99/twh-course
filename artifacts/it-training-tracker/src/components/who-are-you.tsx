import React, { useState } from "react";
import { useListMembers } from "@workspace/api-client-react";
import { GraduationCap, Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WhoAreYouProps {
  onSelect: (memberId: number, token: string) => void;
}

type Step = "pick" | "pin" | "setup";

interface SelectedMember {
  id: number;
  name: string;
}

const avatarColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function callAuth(path: string, body: object): Promise<{ token?: string; needsSetup?: boolean; error?: string }> {
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function WhoAreYou({ onSelect }: WhoAreYouProps) {
  const { data: members, isLoading } = useListMembers();

  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<SelectedMember | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleMemberClick(member: SelectedMember) {
    setSelected(member);
    setPin("");
    setConfirmPin("");
    setError(null);
    setStep("pin");
  }

  function handleBack() {
    setStep("pick");
    setSelected(null);
    setPin("");
    setConfirmPin("");
    setError(null);
  }

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !pin) return;
    setLoading(true);
    setError(null);
    try {
      const result = await callAuth("/auth/login", { memberId: selected.id, pin });
      if (result.needsSetup) {
        setStep("setup");
        setPin("");
      } else if (result.token) {
        onSelect(selected.id, result.token);
      } else {
        setError(result.error ?? "Login fail ho gaya.");
      }
    } catch {
      setError("Server se connect nahi ho saka. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !pin || !confirmPin) return;
    if (pin.length < 4) { setError("PIN kam se kam 4 characters ka hona chahiye."); return; }
    if (pin !== confirmPin) { setError("Dono PINs match nahi kar rahe."); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await callAuth("/auth/setup-pin", { memberId: selected.id, pin });
      if (result.token) {
        onSelect(selected.id, result.token);
      } else {
        setError(result.error ?? "PIN setup fail ho gaya.");
      }
    } catch {
      setError("Server se connect nahi ho saka. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[hsl(263,50%,10%)] via-[hsl(263,50%,16%)] to-[hsl(263,40%,22%)]">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">CYBER_TRACK</h1>
          <p className="text-purple-200/60 text-sm mt-1 tracking-widest uppercase">IT Training System</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
          {/* Step: Pick member */}
          {step === "pick" && (
            <>
              <p className="text-white font-semibold text-lg text-center mb-1">Kaun ho tum? 👀</p>
              <p className="text-purple-200/60 text-sm text-center mb-6">Apna naam select karo continue karne ke liye</p>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
                </div>
              ) : members && members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((member, idx) => (
                    <button
                      key={member.id}
                      onClick={() => handleMemberClick({ id: member.id, name: member.name })}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group text-left"
                    >
                      <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0 font-bold text-white text-sm`}>
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold group-hover:text-purple-200 transition-colors">{member.name}</p>
                        {member.role && <p className="text-purple-300/60 text-xs truncate">{member.role}</p>}
                      </div>
                      <KeyRound className="w-4 h-4 text-white/30 group-hover:text-purple-300 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-purple-200/60 text-sm">Koi member nahi mila. Database check karo.</div>
              )}
            </>
          )}

          {/* Step: Enter PIN */}
          {step === "pin" && selected && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-purple-300/60 hover:text-purple-200 text-sm transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" /> Wapas
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${avatarColors[0]} flex items-center justify-center font-bold text-white text-sm shrink-0`}>
                  {selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{selected.name}</p>
                  <p className="text-purple-300/60 text-xs">PIN enter karo</p>
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="Apna PIN daalo"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(null); }}
                  autoFocus
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-purple-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading || !pin}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Login
              </Button>
            </form>
          )}

          {/* Step: First-time PIN setup */}
          {step === "setup" && selected && (
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <button type="button" onClick={handleBack} className="flex items-center gap-1.5 text-purple-300/60 hover:text-purple-200 text-sm transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" /> Wapas
              </button>
              <div className="text-center mb-2">
                <p className="text-white font-semibold">Pehli Baar? PIN Set Karo 🔐</p>
                <p className="text-purple-300/60 text-xs mt-1">Ek strong PIN banao — yeh sirf tumhara account protect karega.</p>
              </div>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="Naya PIN (min 4 characters)"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(null); }}
                  autoFocus
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-purple-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input
                type={showPin ? "text" : "password"}
                placeholder="PIN dobara daalo"
                value={confirmPin}
                onChange={(e) => { setConfirmPin(e.target.value); setError(null); }}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/40"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading || !pin || !confirmPin}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                PIN Set Karo aur Login
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-purple-300/40 text-xs mt-6">CYBER_TRACK · IT Training Tracker</p>
      </div>
    </div>
  );
}

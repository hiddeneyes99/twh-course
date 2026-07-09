import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, Trophy,
  LogOut, ChevronDown, Sun, Moon, Monitor, X, KeyRound, Loader2,
} from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useListMembers } from "@workspace/api-client-react";
import { useTheme } from "next-themes";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function callSwitch(targetMemberId: number, pin?: string, token?: string | null) {
  const res = await fetch(`${BASE}/api/auth/switch`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ targetMemberId, pin }),
  });
  return res.json() as Promise<{ token?: string; memberId?: number; memberName?: string; error?: string; needsPin?: boolean }>;
}

const avatarColors = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
];

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/team", label: "Team", icon: Users },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  const current = options.find(o => o.value === theme) ?? options[2];
  const Icon = current.icon;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-purple-200/60 hover:bg-white/10 hover:text-white transition-colors text-xs"
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-medium">{current.label} Mode</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[hsl(263,50%,16%)] border border-white/15 rounded-xl overflow-hidden shadow-xl z-20">
          {options.map(opt => {
            const OIcon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left ${
                  theme === opt.value ? "bg-white/20 text-white" : "text-purple-200/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <OIcon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PinDialog({ memberName, onConfirm, onCancel }: {
  memberName: string;
  onConfirm: (pin: string) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError(null);
    const err = await onConfirm(pin);
    if (err) { setError(err); setLoading(false); }
  }

  return (
    <div className="px-2 py-2 border-t border-white/10 mt-1">
      <p className="text-purple-200/70 text-[10px] px-1 mb-1.5">
        <span className="font-semibold text-white">{memberName}</span> ka PIN daalo
      </p>
      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <input
          autoFocus
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(null); }}
          className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/30 outline-none focus:border-purple-400/60"
        />
        <button
          type="submit"
          disabled={loading || !pin}
          className="px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-semibold disabled:opacity-50 transition-colors shrink-0"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
        </button>
        <button type="button" onClick={onCancel} className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-xs transition-colors">
          <X className="w-3 h-3" />
        </button>
      </form>
      {error && <p className="text-red-400 text-[10px] mt-1 px-1">{error}</p>}
    </div>
  );
}

function UserSwitcher({ onClose }: { onClose?: () => void }) {
  const { currentMemberId, isOwner, applySession, clearCurrentMember } = useCurrentUser();
  const { data: members } = useListMembers();
  const [showSwitch, setShowSwitch] = useState(false);
  const [pendingMember, setPendingMember] = useState<{ id: number; name: string } | null>(null);
  const currentMember = members?.find(m => m.id === currentMemberId);
  const idx = members?.findIndex(m => m.id === currentMemberId) ?? 0;

  async function handleMemberClick(m: { id: number; name: string }) {
    if (m.id === currentMemberId) { setShowSwitch(false); onClose?.(); return; }
    const token = localStorage.getItem("cybertrack_token");
    if (isOwner) {
      const result = await callSwitch(m.id, undefined, token);
      if (result.token && result.memberId != null) {
        applySession(result.memberId, result.token);
        setShowSwitch(false); onClose?.();
      }
    } else {
      setPendingMember(m);
    }
  }

  async function handlePinConfirm(pin: string): Promise<string | null> {
    if (!pendingMember) return null;
    const token = localStorage.getItem("cybertrack_token");
    const result = await callSwitch(pendingMember.id, pin, token);
    if (result.token && result.memberId != null) {
      applySession(result.memberId, result.token);
      setShowSwitch(false); setPendingMember(null); onClose?.();
      return null;
    }
    return result.error ?? "Kuch galat hua.";
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setShowSwitch(p => !p); setPendingMember(null); }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
      >
        <div className={`w-7 h-7 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0 text-[10px] font-bold text-white`}>
          {currentMember?.name.slice(0, 2).toUpperCase() ?? "??"}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-xs font-semibold truncate">{currentMember?.name ?? "Unknown"}</p>
          <p className="text-purple-300/50 text-[10px] truncate">{currentMember?.role?.split("—")[0]?.trim() ?? ""}</p>
        </div>
        <ChevronDown className={`w-3 h-3 text-purple-300/50 shrink-0 transition-transform ${showSwitch ? "rotate-180" : ""}`} />
      </button>

      {showSwitch && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[hsl(263,50%,22%)] rounded-xl border border-white/15 overflow-hidden shadow-xl z-10">
          <div className="p-2 space-y-0.5">
            <p className="text-purple-300/50 text-[10px] uppercase tracking-widest px-2 py-1">User switch karo</p>
            {members?.map((m, i) => (
              <button
                key={m.id}
                onClick={() => handleMemberClick(m)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                  m.id === currentMemberId ? "bg-white/20 text-white" : "text-purple-200/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-medium">{m.name}</span>
                {m.id === currentMemberId
                  ? <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-300" />
                  : !isOwner && m.id !== currentMemberId && <KeyRound className="ml-auto w-3 h-3 text-white/30" />
                }
              </button>
            ))}
            {pendingMember && (
              <PinDialog
                memberName={pendingMember.name}
                onConfirm={handlePinConfirm}
                onCancel={() => setPendingMember(null)}
              />
            )}
            <div className="border-t border-white/10 mt-1 pt-1">
              <button
                onClick={() => { clearCurrentMember(); setShowSwitch(false); onClose?.(); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-red-300/70 hover:bg-red-500/15 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Desktop sidebar ───────────────────────────────────────────────── */
function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-gradient-to-b from-[hsl(263,55%,15%)] to-[hsl(263,45%,11%)] border-r border-white/5">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400/30 to-violet-600/30 border border-white/15 flex items-center justify-center shadow-inner">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">CYBER_TRACK</div>
            <div className="text-[10px] text-purple-300/50 tracking-widest">IT TRAINING</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                active
                  ? "bg-white/18 text-white shadow-sm"
                  : "text-purple-200/55 hover:bg-white/8 hover:text-purple-100"
              }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  active ? "bg-violet-500/30" : "bg-transparent"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-300" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/8 space-y-1">
        <ThemeToggle />
        <UserSwitcher />
      </div>
    </aside>
  );
}

/* ── Mobile top bar ────────────────────────────────────────────────── */
function MobileTopBar({ onAvatarClick }: { onAvatarClick: () => void }) {
  const { currentMemberId } = useCurrentUser();
  const { data: members } = useListMembers();
  const currentMember = members?.find(m => m.id === currentMemberId);
  const idx = members?.findIndex(m => m.id === currentMemberId) ?? 0;

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-gradient-to-r from-[hsl(263,55%,15%)] to-[hsl(263,45%,12%)] border-b border-white/8 sticky top-0 z-30 md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm text-white tracking-wide">CYBER_TRACK</span>
      </div>
      <button
        onClick={onAvatarClick}
        className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white/10 active:bg-white/20 transition-colors"
      >
        <div className={`w-7 h-7 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-[10px] font-bold text-white`}>
          {currentMember?.name.slice(0, 2).toUpperCase() ?? "?"}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-white/60" />
      </button>
    </header>
  );
}

/* ── Mobile bottom nav ─────────────────────────────────────────────── */
function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-gradient-to-t from-[hsl(263,55%,13%)] to-[hsl(263,50%,16%)] border-t border-white/10 safe-area-bottom">
      <div className="flex items-stretch h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href} className="flex-1">
              <div className={`flex flex-col items-center justify-center h-full gap-1 transition-all duration-150 active:scale-95 ${
                active ? "text-violet-300" : "text-purple-300/45"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  active ? "bg-violet-500/25" : "bg-transparent"
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-150 ${active ? "scale-110" : ""}`} />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide ${active ? "opacity-100" : "opacity-60"}`}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Mobile profile sheet ──────────────────────────────────────────── */
function MobileProfileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const { currentMemberId, isOwner, applySession, clearCurrentMember } = useCurrentUser();
  const { data: members } = useListMembers();
  const [pendingMember, setPendingMember] = useState<{ id: number; name: string } | null>(null);
  const currentMember = members?.find(m => m.id === currentMemberId);
  const idx = members?.findIndex(m => m.id === currentMemberId) ?? 0;
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  if (!open) return null;

  async function handleMemberClick(m: { id: number; name: string }) {
    if (m.id === currentMemberId) { onClose(); return; }
    const token = localStorage.getItem("cybertrack_token");
    if (isOwner) {
      const result = await callSwitch(m.id, undefined, token);
      if (result.token && result.memberId != null) {
        applySession(result.memberId, result.token);
        setPendingMember(null); onClose();
      }
    } else {
      setPendingMember(m);
    }
  }

  async function handlePinConfirm(pin: string): Promise<string | null> {
    if (!pendingMember) return null;
    const token = localStorage.getItem("cybertrack_token");
    const result = await callSwitch(pendingMember.id, pin, token);
    if (result.token && result.memberId != null) {
      applySession(result.memberId, result.token);
      setPendingMember(null); onClose();
      return null;
    }
    return result.error ?? "Kuch galat hua.";
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 inset-x-0 rounded-t-3xl bg-gradient-to-b from-[hsl(263,55%,18%)] to-[hsl(263,45%,13%)] border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Current user */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
          <div className={`w-12 h-12 rounded-2xl ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-bold text-white text-base shadow-lg`}>
            {currentMember?.name.slice(0, 2).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-white font-bold text-base">{currentMember?.name ?? "Unknown"}</p>
            <p className="text-purple-300/60 text-xs">{currentMember?.role?.split("—")[0]?.trim() ?? ""}</p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 rounded-xl bg-white/10 text-white/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Switch user */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-purple-300/50 text-[11px] uppercase tracking-widest mb-2">Team members</p>
          <div className="space-y-1">
            {members?.map((m, i) => (
              <button
                key={m.id}
                onClick={() => handleMemberClick(m)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  m.id === currentMemberId ? "bg-white/18 text-white" : "text-purple-200/70 hover:bg-white/8"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{m.name}</span>
                {m.id === currentMemberId
                  ? <div className="ml-auto w-2 h-2 rounded-full bg-violet-300" />
                  : !isOwner && <KeyRound className="ml-auto w-3.5 h-3.5 text-white/30" />
                }
              </button>
            ))}
          </div>
          {/* Mobile PIN dialog */}
          {pendingMember && (
            <div className="mt-3">
              <PinDialog
                memberName={pendingMember.name}
                onConfirm={handlePinConfirm}
                onCancel={() => setPendingMember(null)}
              />
            </div>
          )}
        </div>

        {/* Theme */}
        <div className="px-5 pt-2 pb-2">
          <p className="text-purple-300/50 text-[11px] uppercase tracking-widest mb-2">Theme</p>
          <div className="flex gap-2">
            {themeOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                    theme === opt.value ? "bg-violet-500/25 text-violet-300 border border-violet-400/30" : "bg-white/8 text-purple-300/60 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="px-5 pb-6 pt-2">
          <button
            onClick={() => { clearCurrentMember(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Root layout ───────────────────────────────────────────────────── */
export default function Layout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileTopBar onAvatarClick={() => setProfileOpen(true)} />

        <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <MobileProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

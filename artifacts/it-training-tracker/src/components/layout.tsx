import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, LayoutDashboard, BookOpen, Users, Menu, X, LogOut, ChevronDown, Trophy, Sun, Moon, Monitor } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useListMembers } from "@workspace/api-client-react";
import { useTheme } from "next-themes";

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
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-purple-200/60 hover:bg-white/10 hover:text-white transition-colors text-xs"
        title="Theme change karo"
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const { currentMemberId, setCurrentMemberId, clearCurrentMember } = useCurrentUser();
  const { data: members } = useListMembers();

  const currentMember = members?.find(m => m.id === currentMemberId);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/team", label: "Team", icon: Users },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const avatarColors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
  const getMemberIdx = (id: number) => (members?.findIndex(m => m.id === id) ?? 0) % avatarColors.length;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">CYBER_TRACK</div>
            <div className="text-[10px] text-purple-200/60 tracking-widest">IT TRAINING</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <div
                className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-purple-200/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-300" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowSwitchMenu(prev => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors group"
          >
            {currentMember && (
              <div className={`w-7 h-7 rounded-full ${avatarColors[getMemberIdx(currentMember.id)]} flex items-center justify-center shrink-0 text-[10px] font-bold text-white`}>
                {currentMember.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-xs font-semibold truncate">{currentMember?.name ?? "Unknown"}</p>
              <p className="text-purple-300/50 text-[10px] truncate">{currentMember?.role?.split("—")[0]?.trim() ?? ""}</p>
            </div>
            <ChevronDown className={`w-3 h-3 text-purple-300/50 shrink-0 transition-transform ${showSwitchMenu ? "rotate-180" : ""}`} />
          </button>

          {showSwitchMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[hsl(263,50%,22%)] rounded-xl border border-white/15 overflow-hidden shadow-xl z-10">
              <div className="p-2 space-y-0.5">
                <p className="text-purple-300/50 text-[10px] uppercase tracking-widest px-2 py-1">User switch karo</p>
                {members?.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => { setCurrentMemberId(m.id); setShowSwitchMenu(false); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                      m.id === currentMemberId ? "bg-white/20 text-white" : "text-purple-200/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium">{m.name}</span>
                    {m.id === currentMemberId && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-300" />}
                  </button>
                ))}
                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    onClick={() => { clearCurrentMember(); setShowSwitchMenu(false); }}
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
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <aside className="w-56 bg-[hsl(263,50%,18%)] flex-col hidden md:flex shrink-0 relative">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 h-full w-56 bg-[hsl(263,50%,18%)] flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card md:hidden sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm text-foreground">CYBER_TRACK</span>
          </div>
          <div className="flex items-center gap-2">
            {currentMember && (
              <div className={`w-7 h-7 rounded-full ${avatarColors[getMemberIdx(currentMember.id)]} flex items-center justify-center text-[10px] font-bold text-white`}>
                {currentMember.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-md hover:bg-muted">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

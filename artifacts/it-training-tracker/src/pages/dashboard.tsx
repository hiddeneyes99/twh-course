import React from "react";
import {
  useGetMemberStats,
  useGetLeaderboard,
  useGetMember,
  getGetMemberStatsQueryKey,
  getGetMemberQueryKey,
} from "@workspace/api-client-react";
import { useCurrentUser } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, Trophy, Target, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { currentMemberId } = useCurrentUser();

  const memberId = currentMemberId ?? 0;

  const { data: stats, isLoading: loadingStats } = useGetMemberStats(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberStatsQueryKey(memberId) },
  });
  const { data: member, isLoading: loadingMember } = useGetMember(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberQueryKey(memberId) },
  });
  const { data: leaderboard } = useGetLeaderboard();

  const myRank = leaderboard?.find(e => e.memberId === memberId)?.rank ?? null;

  if (loadingStats || loadingMember || !stats || !member) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Dashboard load ho raha hai…</p>
        </div>
      </div>
    );
  }

  const remaining = stats.totalTopics - stats.totalCompleted;

  const statCards = [
    {
      label: "Meri Progress",
      value: `${stats.completionPercent}%`,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      ring: "ring-emerald-200 dark:ring-emerald-800/40",
      text: "text-emerald-700 dark:text-emerald-300",
      progress: stats.completionPercent,
    },
    {
      label: "Complete Modules",
      value: stats.totalCompleted,
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      ring: "ring-blue-200 dark:ring-blue-800/40",
      text: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "Baaki Modules",
      value: remaining,
      icon: Target,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      ring: "ring-violet-200 dark:ring-violet-800/40",
      text: "text-violet-700 dark:text-violet-300",
    },
    {
      label: "Meri Rank",
      value: myRank ? `#${myRank}` : "—",
      icon: Trophy,
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      ring: "ring-amber-200 dark:ring-amber-800/40",
      text: "text-amber-700 dark:text-amber-300",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {member.name} ka Dashboard 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {stats.totalCompleted} modules complete, {remaining} baaki hain. Chalte raho! 🚀
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`relative rounded-2xl p-4 sm:p-5 ${s.bg} ring-1 ${s.ring} overflow-hidden`}
            >
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-xl`} />
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-none mb-1">{s.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold ${s.text} leading-tight`}>{s.value}</p>
              {s.progress !== undefined && (
                <Progress value={s.progress} className="mt-3 h-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase breakdown — personal */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Mera Phase-wise Progress</h2>
          <button
            onClick={() => setLocation("/curriculum")}
            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
          >
            Curriculum dekho <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {stats.byPhase.map((phase) => {
            const pct = phase.total > 0 ? Math.round((phase.completed / phase.total) * 100) : 0;
            const color =
              pct >= 75 ? { bar: "bg-emerald-500", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" } :
              pct >= 40 ? { bar: "bg-amber-500",   badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" } :
                          { bar: "bg-slate-400",   badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" };

            return (
              <button
                key={phase.phase}
                onClick={() => setLocation(`/curriculum?phase=${encodeURIComponent(phase.phase)}`)}
                className="group text-left w-full rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm font-semibold text-foreground leading-tight flex-1 min-w-0 line-clamp-2">
                    {phase.phase}
                  </p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${color.badge}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${color.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {phase.completed} / {phase.total} modules
                  </p>
                  <span className="text-xs text-primary/60 font-medium group-hover:text-primary transition-colors flex items-center gap-0.5">
                    Dekho <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

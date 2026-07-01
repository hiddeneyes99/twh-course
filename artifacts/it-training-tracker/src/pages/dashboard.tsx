import React from "react";
import { useGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, TrendingUp, Trophy } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = useGetStats();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Team Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Total Modules",
      value: stats.totalTopics,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Completion",
      value: `${Math.round(stats.avgCompletionPercent)}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      progress: stats.avgCompletionPercent,
    },
    {
      label: "Top Performer",
      value: stats.topPerformer || "—",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track your team's IT training progress across all modules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                </div>
                {s.progress !== undefined && (
                  <Progress value={s.progress} className="mt-3 h-1.5" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress by Phase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.phaseBreakdown.map((phase) => {
            const pct = phase.totalTopics > 0
              ? Math.round((phase.avgCompleted / phase.totalTopics) * 100)
              : 0;
            return (
              <Card
                key={phase.phase}
                className="border shadow-sm cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200"
                onClick={() => setLocation(`/curriculum?phase=${encodeURIComponent(phase.phase)}`)}
                title={`${phase.phase} ke topics dekho`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground truncate" title={phase.phase}>
                      {phase.phase}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      pct >= 75 ? "bg-emerald-50 text-emerald-700" :
                      pct >= 40 ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {pct}%
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {phase.avgCompleted.toFixed(1)} / {phase.totalTopics} modules avg
                  </p>
                  <p className="text-xs text-primary/70 mt-1 font-medium">Topics dekho →</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

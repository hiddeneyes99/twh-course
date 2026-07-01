import React from "react";
import { useParams, Link } from "wouter";
import {
  useGetMember,
  useGetMemberStats,
  useGetMemberProgress,
  useListTopics,
  getGetMemberQueryKey,
  getGetMemberStatsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, Target } from "lucide-react";

export default function Member() {
  const params = useParams<{ id: string }>();
  const memberId = params?.id ? parseInt(params.id) : 0;

  const { data: member, isLoading: loadingMember } = useGetMember(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberQueryKey(memberId) }
  });
  const { data: stats, isLoading: loadingStats } = useGetMemberStats(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberStatsQueryKey(memberId) }
  });
  const { data: topics } = useListTopics();
  const { data: progress } = useGetMemberProgress(memberId, {
    query: { enabled: !!memberId }
  });

  if (loadingMember || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!member || !stats) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-destructive/30 rounded-xl bg-destructive/5">
        <p className="text-destructive font-medium">Member not found.</p>
      </div>
    );
  }

  const completedTopicIds = new Set(progress?.map(p => p.topicId) || []);

  const recentlyCompleted = [...(progress || [])]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)
    .map(p => ({ ...p, topic: topics?.find(t => t.id === p.topicId) }))
    .filter(p => p.topic);

  const completionPct = Math.round(stats.completionPercent);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/team">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Team
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xl">
              {member.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
            {member.role && (
              <Badge variant="secondary" className="mt-1 text-xs font-medium">
                {member.role}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Joined {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white border border-border rounded-xl px-6 py-4 shadow-sm">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Completion</p>
            <p className={`text-3xl font-bold ${
              completionPct >= 75 ? "text-emerald-600" :
              completionPct >= 40 ? "text-amber-600" : "text-primary"
            }`}>
              {completionPct}%
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Modules</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalCompleted}
              <span className="text-muted-foreground text-lg font-normal">/{stats.totalTopics}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Progress by Phase
          </h2>
          <div className="space-y-3">
            {stats.byPhase.map(phase => {
              const pct = phase.total > 0 ? (phase.completed / phase.total) * 100 : 0;
              return (
                <Card key={phase.phase} className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{phase.phase}</span>
                      <span className="text-xs text-muted-foreground">
                        {phase.completed}/{phase.total}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Activity
          </h2>
          <div className="space-y-2">
            {recentlyCompleted.length > 0 ? (
              recentlyCompleted.map(item => (
                <div key={item.id} className="p-3 bg-white border border-border rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight truncate">
                      {item.topic?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.topic?.phase}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {new Date(item.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                <CheckCircle2 className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No completed modules yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "wouter";
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
import { User, Target, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Member() {
  const params = useParams<{ id: string }>();
  const memberId = params?.id ? parseInt(params.id) : 0;

  const { data: member, isLoading: loadingMember } = useGetMember(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberQueryKey(memberId) }
  });

  const { data: stats, isLoading: loadingStats } = useGetMemberStats(memberId, {
    query: { enabled: !!memberId, queryKey: getGetMemberStatsQueryKey(memberId) }
  });

  const { data: topics, isLoading: loadingTopics } = useListTopics();
  const { data: progress, isLoading: loadingProgress } = useGetMemberProgress(memberId, {
    query: { enabled: !!memberId }
  });

  if (loadingMember || loadingStats || loadingTopics || loadingProgress) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="font-mono text-primary animate-pulse">FETCHING_OPERATIVE_DATA...</div>
      </div>
    );
  }

  if (!member || !stats || !topics) {
    return (
      <div className="text-center py-12 border border-dashed border-destructive/50 rounded-lg bg-destructive/10 text-destructive font-mono">
        OPERATIVE_NOT_FOUND
      </div>
    );
  }

  const completedTopicIds = new Set(progress?.map(p => p.topicId) || []);

  const recentlyCompleted = [...(progress || [])]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)
    .map(p => {
      const topic = topics.find(t => t.id === p.topicId);
      return { ...p, topic };
    })
    .filter(p => p.topic);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-mono text-foreground uppercase">
              {member.name}
            </h1>
            <Badge variant="outline" className="border-primary/50 text-primary font-mono ml-2">
              {member.role || "OPERATIVE"}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            ID: {member.id.toString().padStart(4, '0')} | JOINED: {new Date(member.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-6 bg-card px-6 py-4 rounded-lg border border-border">
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-mono mb-1">COMPLETION</div>
            <div className="text-3xl font-bold font-mono text-primary">
              {Math.round(stats.completionPercent)}%
            </div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-mono mb-1">MODULES</div>
            <div className="text-3xl font-bold font-mono">
              {stats.totalCompleted}<span className="text-muted-foreground text-xl">/{stats.totalTopics}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-mono text-foreground flex items-center">
            <Target className="w-5 h-5 text-primary mr-2" />
            PHASE_PROGRESS
          </h2>
          
          <div className="space-y-4">
            {stats.byPhase.map(phase => (
              <Card key={phase.phase} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono font-medium">{phase.phase}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {phase.completed}/{phase.total}
                    </span>
                  </div>
                  <Progress 
                    value={phase.total > 0 ? (phase.completed / phase.total) * 100 : 0} 
                    className="h-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold font-mono text-foreground flex items-center">
            <Activity className="w-5 h-5 text-primary mr-2" />
            RECENT_ACTIVITY
          </h2>
          
          <div className="space-y-3">
            {recentlyCompleted.length > 0 ? (
              recentlyCompleted.map(item => (
                <div key={item.id} className="p-3 bg-card border border-border rounded-md">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-mono text-sm font-medium leading-tight">
                        {item.topic?.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {item.topic?.phase}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-2">
                        {new Date(item.completedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm font-mono text-muted-foreground italic border border-dashed border-border p-4 text-center rounded-md bg-card/30">
                NO_ACTIVITY_RECORDED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

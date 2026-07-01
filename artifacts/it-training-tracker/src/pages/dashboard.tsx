import React from "react";
import { useGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, CheckCircle, Trophy, Activity } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="font-mono text-primary animate-pulse">INITIATING DIAGNOSTICS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold font-mono text-foreground mb-2 flex items-center">
          <Activity className="w-8 h-8 text-primary mr-3" />
          SYSTEM_OVERVIEW
        </h1>
        <p className="text-muted-foreground">Command center for team training progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Operatives</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{stats.totalMembers}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Modules</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{stats.totalTopics}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
            <CheckCircle className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{Math.round(stats.avgCompletionPercent)}%</div>
            <Progress value={stats.avgCompletionPercent} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={stats.topPerformer || "N/A"}>
              {stats.topPerformer || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold font-mono text-foreground mb-4">PHASE_ANALYSIS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.phaseBreakdown.map((phase) => (
            <Card key={phase.phase} className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium truncate" title={phase.phase}>
                  {phase.phase}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-mono">{phase.avgCompleted.toFixed(1)} / {phase.totalTopics} avg</span>
                  <span className="font-mono">{Math.round((phase.avgCompleted / phase.totalTopics) * 100)}%</span>
                </div>
                <Progress value={(phase.avgCompleted / phase.totalTopics) * 100} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

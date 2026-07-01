import React, { useState } from "react";
import { useListMembers, useListTopics, useGetMemberProgress, useMarkComplete, useUnmarkComplete, getGetMemberProgressQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FolderGit2 } from "lucide-react";

export default function Curriculum() {
  const queryClient = useQueryClient();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const { data: members } = useListMembers();
  const { data: topics, isLoading: isLoadingTopics } = useListTopics();
  const { data: progress } = useGetMemberProgress(selectedMemberId || 0, { query: { enabled: !!selectedMemberId } });

  const markComplete = useMarkComplete();
  const unmarkComplete = useUnmarkComplete();

  const handleToggle = (topicId: string, isCompleted: boolean) => {
    if (!selectedMemberId) return;

    if (isCompleted) {
      unmarkComplete.mutate(
        { memberId: selectedMemberId, topicId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(selectedMemberId) });
          }
        }
      );
    } else {
      markComplete.mutate(
        { data: { memberId: selectedMemberId, topicId } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(selectedMemberId) });
          }
        }
      );
    }
  };

  if (isLoadingTopics || !topics) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="font-mono text-primary animate-pulse">LOADING CURRICULUM...</div>
      </div>
    );
  }

  const completedTopicIds = new Set(progress?.map(p => p.topicId) || []);

  const topicsByPhase = topics.reduce((acc, topic) => {
    if (!acc[topic.phase]) acc[topic.phase] = [];
    acc[topic.phase].push(topic);
    return acc;
  }, {} as Record<string, typeof topics>);

  const phases = Object.keys(topicsByPhase).sort();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground flex items-center">
            <FolderGit2 className="w-8 h-8 text-primary mr-3" />
            MODULE_REGISTRY
          </h1>
          <p className="text-muted-foreground mt-1">Select an operative to record progress.</p>
        </div>

        <div className="w-full md:w-64">
          <Select onValueChange={(v) => setSelectedMemberId(parseInt(v))} value={selectedMemberId?.toString() || ""}>
            <SelectTrigger className="font-mono bg-card border-border">
              <SelectValue placeholder="SELECT_OPERATIVE" />
            </SelectTrigger>
            <SelectContent>
              {members?.map(m => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name} {m.role ? `(${m.role})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {phases.map(phase => {
          const phaseTopics = topicsByPhase[phase].sort((a, b) => a.order - b.order);
          const completedInPhase = phaseTopics.filter(t => completedTopicIds.has(t.id)).length;
          const phasePercent = phaseTopics.length > 0 ? (completedInPhase / phaseTopics.length) * 100 : 0;

          return (
            <Card key={phase} className="border-border bg-card overflow-hidden">
              <CardHeader className="bg-muted/50 border-b border-border">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <CardTitle className="font-mono text-lg">{phase}</CardTitle>
                  {selectedMemberId && (
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {completedInPhase}/{phaseTopics.length} COMPLETED
                      </span>
                      <Progress value={phasePercent} className="h-2 w-full md:w-32" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {phaseTopics.map(topic => {
                    const isCompleted = completedTopicIds.has(topic.id);
                    const levelColors = {
                      beginner: "bg-green-500/10 text-green-500 border-green-500/20",
                      intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                      advanced: "bg-red-500/10 text-red-500 border-red-500/20",
                    };

                    return (
                      <div key={topic.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
                        <div className="mt-1">
                          <Checkbox
                            checked={isCompleted}
                            disabled={!selectedMemberId || markComplete.isPending || unmarkComplete.isPending}
                            onCheckedChange={() => handleToggle(topic.id, isCompleted)}
                            className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-mono text-sm ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {topic.title}
                            </span>
                            <Badge variant="outline" className={`text-[10px] uppercase font-mono px-1.5 py-0 ${levelColors[topic.level]}`}>
                              {topic.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

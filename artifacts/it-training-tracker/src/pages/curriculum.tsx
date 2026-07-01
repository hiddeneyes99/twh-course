import React, { useState } from "react";
import {
  useListMembers,
  useListTopics,
  useGetMemberProgress,
  useMarkComplete,
  useUnmarkComplete,
  useGetMemberQuizStatuses,
  getGetMemberProgressQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Brain, Lock, ChevronDown, ChevronUp } from "lucide-react";
import QuizModal from "@/components/quiz-modal";

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

export default function Curriculum() {
  const queryClient = useQueryClient();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [quizTopic, setQuizTopic] = useState<{ id: string; title: string } | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const { data: members } = useListMembers();
  const { data: topics, isLoading: isLoadingTopics } = useListTopics();
  const { data: progress } = useGetMemberProgress(selectedMemberId || 0, {
    query: { enabled: !!selectedMemberId },
  });
  const { data: quizStatuses } = useGetMemberQuizStatuses(selectedMemberId || 0, {
    query: { enabled: !!selectedMemberId },
  });

  const markComplete = useMarkComplete();
  const unmarkComplete = useUnmarkComplete();

  const handleToggle = (topicId: string, isCompleted: boolean) => {
    if (!selectedMemberId) return;
    if (isCompleted) {
      unmarkComplete.mutate(
        { memberId: selectedMemberId, topicId },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(selectedMemberId) }) }
      );
    } else {
      markComplete.mutate(
        { data: { memberId: selectedMemberId, topicId } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(selectedMemberId) }) }
      );
    }
  };

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  if (isLoadingTopics || !topics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading curriculum…</p>
        </div>
      </div>
    );
  }

  const completedTopicIds = new Set(progress?.map(p => p.topicId) || []);
  const quizPassedIds = new Set(
    (quizStatuses || []).filter(qs => qs.passed).map(qs => qs.topicId)
  );

  const topicsByPhase = topics.reduce((acc, topic) => {
    if (!acc[topic.phase]) acc[topic.phase] = [];
    acc[topic.phase].push(topic);
    return acc;
  }, {} as Record<string, typeof topics>);

  const phases = Object.keys(topicsByPhase).sort();
  const totalCompleted = completedTopicIds.size;
  const totalTopics = topics.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {quizTopic && selectedMemberId && (
        <QuizModal
          topicId={quizTopic.id}
          topicTitle={quizTopic.title}
          memberId={selectedMemberId}
          onClose={() => setQuizTopic(null)}
          onPassed={() => {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(selectedMemberId) });
            setQuizTopic(null);
          }}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Curriculum
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            66 modules across 9 phases. Select a member to track progress.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {selectedMemberId && (
            <div className="flex items-center gap-3 bg-white border border-border rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-muted-foreground">Overall</span>
              <span className="font-bold text-foreground">{totalCompleted}/{totalTopics}</span>
              <Progress value={(totalCompleted / totalTopics) * 100} className="w-24 h-1.5" />
            </div>
          )}
          <Select
            onValueChange={(v) => setSelectedMemberId(parseInt(v))}
            value={selectedMemberId?.toString() || ""}
          >
            <SelectTrigger className="w-52 bg-white shadow-sm">
              <SelectValue placeholder="Select a member…" />
            </SelectTrigger>
            <SelectContent>
              {members?.map(m => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {phases.map(phase => {
          const phaseTopics = topicsByPhase[phase].sort((a, b) => a.order - b.order);
          const completedInPhase = phaseTopics.filter(t => completedTopicIds.has(t.id)).length;
          const phasePercent = phaseTopics.length > 0 ? (completedInPhase / phaseTopics.length) * 100 : 0;
          const isExpanded = expandedPhases.has(phase);

          return (
            <Card key={phase} className="border shadow-sm overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => togglePhase(phase)}
              >
                <CardHeader className="py-4 px-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      }
                      <CardTitle className="text-sm font-semibold text-foreground">{phase}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {phaseTopics.length} modules
                      </Badge>
                    </div>
                    {selectedMemberId && (
                      <div className="flex items-center gap-3 ml-7 sm:ml-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          completedInPhase === phaseTopics.length
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {completedInPhase}/{phaseTopics.length}
                        </span>
                        <Progress value={phasePercent} className="h-1.5 w-24" />
                      </div>
                    )}
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {phaseTopics.map((topic, idx) => {
                      const isCompleted = completedTopicIds.has(topic.id);
                      const quizPassed = quizPassedIds.has(topic.id);

                      return (
                        <div
                          key={topic.id}
                          className={`px-5 py-4 flex items-start gap-4 transition-colors ${
                            isCompleted ? "bg-emerald-50/30" : "hover:bg-muted/20"
                          }`}
                        >
                          <button
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-border hover:border-primary"
                            } ${!selectedMemberId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                            disabled={!selectedMemberId || markComplete.isPending || unmarkComplete.isPending}
                            onClick={() => handleToggle(topic.id, isCompleted)}
                          >
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className={`text-sm font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {idx + 1}. {topic.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] uppercase px-1.5 py-0 font-medium ${levelColors[topic.level] || ""}`}
                              >
                                {topic.level}
                              </Badge>
                              {isCompleted && (
                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0">
                                  Done
                                </Badge>
                              )}
                              {quizPassed && (
                                <Badge variant="outline" className="text-[10px] bg-violet-50 text-violet-700 border-violet-200 px-1.5 py-0">
                                  Quiz ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
                          </div>

                          {selectedMemberId && (
                            <Button
                              size="sm"
                              variant={quizPassed ? "outline" : "secondary"}
                              className={`shrink-0 gap-1.5 text-xs h-7 ${
                                quizPassed
                                  ? "border-violet-200 text-violet-600 hover:bg-violet-50"
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              }`}
                              onClick={() => setQuizTopic({ id: topic.id, title: topic.title })}
                            >
                              {quizPassed ? (
                                <><CheckCircle2 className="w-3 h-3" /> Passed</>
                              ) : (
                                <><Brain className="w-3 h-3" /> Quiz</>
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  useListTopics,
  useGetMemberProgress,
  useGetMemberQuizStatuses,
  useListMembers,
  getGetMemberProgressQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Brain, ChevronDown, ChevronUp, Info } from "lucide-react";
import QuizModal from "@/components/quiz-modal";

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

export default function Curriculum() {
  const queryClient = useQueryClient();
  const { currentMemberId } = useCurrentUser();
  const [quizTopic, setQuizTopic] = useState<{ id: string; title: string } | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedInfo, setExpandedInfo] = useState<Set<string>>(new Set());

  const { data: topics, isLoading: isLoadingTopics } = useListTopics();
  const { data: members } = useListMembers();
  const { data: progress } = useGetMemberProgress(currentMemberId || 0, {
    query: { enabled: !!currentMemberId },
  });
  const { data: quizStatuses, refetch: refetchQuizStatuses } = useGetMemberQuizStatuses(currentMemberId || 0, {
    query: { enabled: !!currentMemberId },
  });

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase); else next.add(phase);
      return next;
    });
  };

  const toggleInfo = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedInfo(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId); else next.add(topicId);
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

  const currentMember = members?.find(m => m.id === currentMemberId);
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
      {quizTopic && currentMemberId && (
        <QuizModal
          topicId={quizTopic.id}
          topicTitle={quizTopic.title}
          memberId={currentMemberId}
          onClose={() => setQuizTopic(null)}
          onPassed={() => {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(currentMemberId) });
            refetchQuizStatuses();
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
            66 modules, 9 phases. Quiz pass karo → module complete hoga automatically.
          </p>
        </div>

        {currentMember && (
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{currentMember.name}</span> ka progress
              </p>
              <p className="text-xs text-muted-foreground">{totalCompleted}/{totalTopics} complete</p>
            </div>
            <Progress value={(totalCompleted / totalTopics) * 100} className="w-24 h-2" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {phases.map(phase => {
          const phaseTopics = topicsByPhase[phase].sort((a, b) => a.order - b.order);
          const completedInPhase = phaseTopics.filter(t => completedTopicIds.has(t.id)).length;
          const phasePercent = phaseTopics.length > 0 ? (completedInPhase / phaseTopics.length) * 100 : 0;
          const isExpanded = expandedPhases.has(phase);

          return (
            <Card key={phase} className="border shadow-sm overflow-hidden">
              <button className="w-full text-left" onClick={() => togglePhase(phase)}>
                <CardHeader className="py-4 px-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <CardTitle className="text-sm font-semibold text-foreground">{phase}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{phaseTopics.length} modules</Badge>
                      {completedInPhase === phaseTopics.length && phaseTopics.length > 0 && (
                        <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">Completed ✓</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-7 sm:ml-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        completedInPhase === phaseTopics.length ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                      }`}>
                        {completedInPhase}/{phaseTopics.length}
                      </span>
                      <Progress value={phasePercent} className="h-1.5 w-24" />
                    </div>
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {phaseTopics.map((topic, idx) => {
                      const isCompleted = completedTopicIds.has(topic.id);
                      const quizPassed = quizPassedIds.has(topic.id);
                      const infoOpen = expandedInfo.has(topic.id);

                      return (
                        <div key={topic.id} className={`px-5 py-4 transition-colors ${isCompleted ? "bg-emerald-50/40" : "hover:bg-muted/15"}`}>
                          <div className="flex items-start gap-3">
                            {/* Status indicator */}
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? "bg-emerald-500"
                                : "border-2 border-border"
                            }`}>
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>

                            {/* Topic info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className={`text-sm font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                  {idx + 1}. {topic.title}
                                </span>
                                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 font-medium ${levelColors[topic.level] || ""}`}>
                                  {topic.level}
                                </Badge>
                                {isCompleted && (
                                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0">
                                    Complete ✓
                                  </Badge>
                                )}
                              </div>

                              {/* Short description always visible */}
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {topic.description}
                              </p>

                              {/* Expanded full description */}
                              {infoOpen && (
                                <div className="mt-2 p-3 bg-violet-50 border border-violet-100 rounded-lg">
                                  <p className="text-xs text-violet-900 leading-relaxed whitespace-pre-wrap">
                                    {topic.description}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={(e) => toggleInfo(topic.id, e)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  infoOpen ? "bg-violet-100 text-violet-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                                title="Topic info padhne ke liye"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>

                              {!isCompleted ? (
                                <Button
                                  size="sm"
                                  className="gap-1.5 text-xs h-7 bg-primary/10 text-primary hover:bg-primary hover:text-white border-0"
                                  onClick={() => setQuizTopic({ id: topic.id, title: topic.title })}
                                >
                                  <Brain className="w-3 h-3" />
                                  Quiz lo
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-xs h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => setQuizTopic({ id: topic.id, title: topic.title })}
                                  title="Practice ke liye fir se quiz lo"
                                >
                                  <Brain className="w-3 h-3" />
                                  Revise
                                </Button>
                              )}
                            </div>
                          </div>
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

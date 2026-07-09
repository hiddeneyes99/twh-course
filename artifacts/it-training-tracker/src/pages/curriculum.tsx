import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useListTopics,
  useGetMemberProgress,
  useGetMemberQuizStatuses,
  useListMembers,
  getGetMemberProgressQueryKey,
  getGetMemberQuizStatusesQueryKey,
} from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";
import { useCurrentUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Brain, ChevronDown, ChevronUp, Search, Award, X } from "lucide-react";

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  advanced: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
};

export default function Curriculum() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { currentMemberId } = useCurrentUser();
  const expandKey = currentMemberId ? `cybertrack_phases_${currentMemberId}` : null;
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => {
    if (!expandKey) return new Set();
    try {
      const saved = localStorage.getItem(expandKey);
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  const [search, setSearch] = useState("");
  const [certPhase, setCertPhase] = useState<string | null>(null);
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({}); 

  const { data: topics, isLoading: isLoadingTopics } = useListTopics();

  // Auto-expand and scroll to phase when navigated from dashboard.
  // Keyed on both searchString and topics so scroll runs only after cards have rendered.
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const targetPhase = params.get("phase");
    if (!targetPhase || !topics) return;

    setExpandedPhases(prev => {
      const next = new Set(prev);
      next.add(targetPhase);
      return next;
    });

    // Use rAF so the DOM has flushed the newly expanded card before scrolling.
    const raf = requestAnimationFrame(() => {
      phaseRefs.current[targetPhase]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [searchString, topics]);
  const { data: members } = useListMembers();
  const { data: progress } = useGetMemberProgress(currentMemberId || 0, {
    query: { enabled: !!currentMemberId, queryKey: getGetMemberProgressQueryKey(currentMemberId || 0) },
  });
  const { data: quizStatuses } = useGetMemberQuizStatuses(currentMemberId || 0, {
    query: { enabled: !!currentMemberId, queryKey: getGetMemberQuizStatusesQueryKey(currentMemberId || 0) },
  });

  const togglePhase = useCallback((phase: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase); else next.add(phase);
      if (expandKey) {
        try { localStorage.setItem(expandKey, JSON.stringify([...next])); } catch {}
      }
      return next;
    });
  }, [expandKey]);

  if (isLoadingTopics || !topics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Curriculum load ho raha hai…</p>
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

  const phases = Object.keys(topicsByPhase).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
    return numA - numB;
  });
  const totalCompleted = completedTopicIds.size;
  const totalTopics = topics.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Curriculum
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalTopics} modules, {phases.length} phases. AI se padho → Quiz do → Module complete!
          </p>
        </div>

        {currentMember && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
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
            <Card key={phase} ref={el => { phaseRefs.current[phase] = el as HTMLDivElement | null; }} className="border shadow-sm overflow-hidden">
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
                        <Badge className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">Complete ✓</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-7 sm:ml-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        completedInPhase === phaseTopics.length ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"
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

                      return (
                        <div
                          key={topic.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setLocation(`/learn/${topic.id}?phase=${encodeURIComponent(phase)}`)}
                          onKeyDown={e => e.key === "Enter" && setLocation(`/learn/${topic.id}?phase=${encodeURIComponent(phase)}`)}
                          className={`px-5 py-4 transition-colors cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              isCompleted ? "bg-emerald-500" : "border-2 border-border"
                            }`}>
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className={`text-sm font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                  {idx + 1}. {topic.title}
                                </span>
                                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 font-medium ${levelColors[topic.level] || ""}`}>
                                  {topic.level}
                                </Badge>
                                {isCompleted && (
                                  <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 px-1.5 py-0">
                                    Complete ✓
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {topic.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                              {!isCompleted ? (
                                <Button
                                  size="sm"
                                  className="gap-1.5 text-xs h-8 bg-primary/10 text-primary hover:bg-primary hover:text-white border-0"
                                  onClick={() => setLocation(`/learn/${topic.id}?phase=${encodeURIComponent(phase)}`)}
                                >
                                  <Brain className="w-3 h-3" />
                                  <span className="hidden sm:inline">Padho & Quiz do</span>
                                  <span className="sm:hidden">Quiz</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-xs h-8 border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  onClick={() => setLocation(`/learn/${topic.id}?phase=${encodeURIComponent(phase)}`)}
                                  title="Practice ke liye revise karo"
                                >
                                  <Brain className="w-3 h-3" />
                                  <span className="hidden sm:inline">Revise</span>
                                  <span className="sm:hidden">✓</span>
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

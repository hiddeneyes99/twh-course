import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  useExplainTopic,
  useGenerateQuiz,
  useSubmitQuiz,
  useListTopics,
  getGetMemberProgressQueryKey,
  getGenerateQuizQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Brain, Trophy, XCircle, CheckCircle2, ChevronLeft,
  ChevronRight, Loader2, BookOpen, Sparkles, RefreshCw, Star,
} from "lucide-react";

type Phase =
  | "loading-explain"
  | "explain"
  | "loading-quiz"
  | "quiz"
  | "submitting"
  | "passed"
  | "failed"
  | "re-explaining"
  | "re-loading-quiz"
  | "re-quiz"
  | "re-submitting"
  | "final-result";

interface QuizResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  percentScore: number;
  feedback: { questionIndex: number; correct: boolean; correctOption: number; explanation: string }[];
}

export default function Learn() {
  const params = useParams<{ topicId: string }>();
  const topicId = params?.topicId ?? "";
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { currentMemberId } = useCurrentUser();

  const [phase, setPhase] = useState<Phase>("loading-explain");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [reResult, setReResult] = useState<QuizResult | null>(null);
  const [imgError, setImgError] = useState(false);

  const { data: allTopics } = useListTopics();
  const { data: explanation, isSuccess: explainReady } = useExplainTopic(topicId);
  const { data: quiz, isSuccess: quizReady, refetch: refetchQuiz } = useGenerateQuiz(topicId, {
    query: { enabled: false, queryKey: getGenerateQuizQueryKey(topicId) },
  });
  const submitQuiz = useSubmitQuiz();

  const topic = allTopics?.find(t => t.id === topicId);

  useEffect(() => {
    if (explainReady && phase === "loading-explain") {
      setPhase("explain");
    }
  }, [explainReady, phase]);

  useEffect(() => {
    if (quizReady && quiz && (phase === "loading-quiz" || phase === "re-loading-quiz")) {
      setPhase(phase === "loading-quiz" ? "quiz" : "re-quiz");
      setAnswers({});
      setCurrentQ(0);
    }
  }, [quizReady, quiz, phase]);

  function startQuiz() {
    setPhase("loading-quiz");
    refetchQuiz();
  }

  function startReQuiz() {
    setPhase("re-loading-quiz");
    refetchQuiz();
  }

  function handleSelect(qIdx: number, optIdx: number) {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit(isRetry = false) {
    if (!quiz || !currentMemberId) return;
    const totalQ = quiz.questions.length;
    const answersArr = Array.from({ length: totalQ }, (_, i) => answers[i] ?? -1);
    setPhase(isRetry ? "re-submitting" : "submitting");
    submitQuiz.mutate(
      { data: { memberId: currentMemberId, topicId, answers: answersArr } },
      {
        onSuccess: (data) => {
          if (isRetry) {
            setReResult(data);
            setPhase("final-result");
          } else {
            setResult(data);
            if (data.passed) {
              queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(currentMemberId) });
              setPhase("passed");
            } else {
              setPhase("failed");
            }
          }
        },
        onError: () => setPhase(isRetry ? "re-quiz" : "quiz"),
      }
    );
  }

  const questions = quiz?.questions ?? [];
  const totalQ = questions.length;
  const allAnswered = Object.keys(answers).length === totalQ && totalQ > 0;

  function QuizUI({ onSubmit }: { onSubmit: () => void }) {
    const question = questions[currentQ];
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AI Quiz — Hinglish</p>
            <p className="text-sm font-semibold text-foreground leading-tight">{explanation?.topicTitle ?? topic?.title}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sawaal {currentQ + 1} / {totalQ}</span>
            <span className="text-xs text-muted-foreground">{Object.keys(answers).length}/{totalQ} jawab diya</span>
          </div>
          <Progress value={((currentQ + 1) / totalQ) * 100} className="h-1.5" />
        </div>

        <div className="bg-muted rounded-xl p-4 border border-border">
          <p className="font-semibold text-foreground leading-snug text-sm">{question?.question}</p>
        </div>

        <div className="space-y-2">
          {question?.options.map((opt, i) => {
            const selected = answers[currentQ] === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(currentQ, i)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 flex items-center gap-3 ${
                  selected
                    ? "border-primary bg-primary/8 ring-1 ring-primary/25"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/4"
                }`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full text-xs items-center justify-center shrink-0 font-bold ${
                  selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={selected ? "text-primary font-medium" : "text-foreground"}>{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Pehle
          </Button>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentQ ? "bg-primary scale-125" : answers[i] !== undefined ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
            ))}
          </div>
          {currentQ < totalQ - 1 ? (
            <Button size="sm" onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))} disabled={answers[currentQ] === undefined} className="gap-1">
              Agla <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={onSubmit} disabled={!allAnswered} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
              Submit
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "loading-explain") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-foreground">AI explanation taiyaar ho raha hai...</p>
            <p className="text-sm text-muted-foreground mt-1">Topic samjhane ke liye AI kaam kar raha hai 🤖</p>
          </div>
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (phase === "loading-quiz" || phase === "re-loading-quiz") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Quiz generate ho raha hai...</p>
            <p className="text-sm text-muted-foreground mt-1">AI Hinglish mein sawaal bana raha hai 🧠</p>
          </div>
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (phase === "submitting" || phase === "re-submitting") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Jawab check ho rahe hain...</p>
        </div>
      </div>
    );
  }

  if (phase === "passed") {
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zabardast! 🎉</h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-2">Module complete ho gaya!</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 rounded-full px-4 py-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">{result?.percentScore}%</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">score mila!</span>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-left space-y-2">
            {result?.feedback.map((fb, i) => (
              <div key={i} className="flex items-start gap-2">
                {fb.correct
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                <span className="text-xs text-foreground/80">{questions[i]?.question}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground italic">
            "Tum ne bahut accha kiya! {topic?.phase} mein ek aur step aage badh gaye. Keep it up! 💪"
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Curriculum par wapas jao
            </Button>
            <Button onClick={() => setLocation("/leaderboard")} className="gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard dekho
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Koi baat nahi! 💪</h1>
            <p className="text-muted-foreground mt-2 text-sm">Score {result?.percentScore}% tha, pass ke liye 70% chahiye.</p>
            <p className="text-foreground/80 font-medium mt-1">AI dobara samjhata hai, tension mat lo!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setPhase("re-explaining")}
              className="gap-2 bg-primary"
            >
              <Sparkles className="w-4 h-4" /> AI se dobara samjho
            </Button>
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Baad mein karta hoon
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "re-explaining") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Curriculum
          </Button>
        </div>

        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 p-4 text-center">
          <p className="text-amber-700 dark:text-amber-300 font-semibold">🔄 Dobara Samjho</p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">Is baar dhyan se padho, phir quiz dena!</p>
        </div>

        {explanation && (
          <>
            {!imgError && (
              <div className="rounded-2xl overflow-hidden h-48 md:h-64 relative">
                <img
                  src={explanation.imageUrl}
                  alt={explanation.topicTitle}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <h2 className="text-white font-bold text-xl drop-shadow">{explanation.topicTitle}</h2>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {explanation.sections.map((section, i) => (
                <Card key={i} className="border shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground mb-2">{section.heading}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-center pt-2">
          <Button onClick={startReQuiz} size="lg" className="gap-2 px-8">
            <Brain className="w-5 h-5" /> Ab Quiz do!
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "re-quiz") {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Curriculum
          </Button>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-center">
          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">🔄 Second Attempt — Tum kar sakte ho!</p>
        </div>
        <Card className="border shadow-md">
          <CardContent className="p-6">
            <QuizUI onSubmit={() => handleSubmit(true)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "final-result") {
    const fr = reResult;
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${fr?.passed ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-red-100 dark:bg-red-900/30"}`}>
            {fr?.passed
              ? <Trophy className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              : <RefreshCw className="w-10 h-10 text-red-500" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {fr?.passed ? "Waah! Dusri baar mein pass! 🎊" : "Koi baat nahi, practice karo! 💪"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Final score: <span className="font-bold text-foreground">{fr?.percentScore}%</span>
              {fr?.passed && " — Module complete ho gaya!"}
            </p>
          </div>
          {fr?.passed && (
            <p className="text-sm text-muted-foreground italic">
              "Tum ne haar nahi maani aur jeet liya! Yeh wali spirit hi success dilati hai. 🌟"
            </p>
          )}
          {!fr?.passed && (
            <p className="text-sm text-muted-foreground italic">
              "Har expert pehle ek beginner tha. Aaj ki galti kal ki seekh hai. Dobara aao! 🚀"
            </p>
          )}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Curriculum
            </Button>
            <Button onClick={() => { setPhase("explain"); setAnswers({}); setCurrentQ(0); }} className="gap-2" variant="outline">
              <RefreshCw className="w-4 h-4" /> Dobara padho
            </Button>
            <Button onClick={() => setLocation("/leaderboard")} className="gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPhase("explain")} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Wapas padho
          </Button>
        </div>
        <Card className="border shadow-md">
          <CardContent className="p-6">
            <QuizUI onSubmit={() => handleSubmit(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // "explain" phase - default
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
          <ArrowLeft className="w-4 h-4" /> Curriculum
        </Button>
      </div>

      {explanation && (
        <>
          {/* Hero image */}
          {!imgError ? (
            <div className="rounded-2xl overflow-hidden h-48 md:h-64 relative shadow-md">
              <img
                src={explanation.imageUrl}
                alt={explanation.topicTitle}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                <div>
                  {topic && (
                    <Badge className="mb-2 text-xs capitalize bg-white/20 text-white border-white/30">
                      {topic.level} · {topic.phase}
                    </Badge>
                  )}
                  <h1 className="text-white font-bold text-2xl drop-shadow">{explanation.topicTitle}</h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-primary/10 p-6 text-center">
              <BookOpen className="w-10 h-10 text-primary mx-auto mb-2" />
              <h1 className="font-bold text-2xl text-foreground">{explanation.topicTitle}</h1>
            </div>
          )}

          {/* Summary */}
          <div className="bg-primary/8 dark:bg-primary/15 border border-primary/20 rounded-xl p-4">
            <p className="text-sm font-medium text-primary flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
              {explanation.summary}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {explanation.sections.map((section, i) => (
              <Card key={i} className="border shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground text-base mb-3">{section.heading}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
            <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-lg mb-1">Padh liya? Quiz do! 🧠</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI aapke liye Hinglish mein sawaal banayega. 70% se upar laao to module complete!
            </p>
            <Button onClick={startQuiz} size="lg" className="gap-2 px-8 w-full sm:w-auto">
              <Brain className="w-5 h-5" /> Quiz Shuru Karo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

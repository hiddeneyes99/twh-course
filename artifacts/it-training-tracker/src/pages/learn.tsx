import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGenerateQuiz,
  useSubmitQuiz,
  useListTopics,
  useExplainTopic,
  getGetMemberProgressQueryKey,
  getGenerateQuizQueryKey,
  getExplainTopicQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Brain, Trophy, XCircle, CheckCircle2, ChevronLeft,
  ChevronRight, Loader2, BookOpen, RefreshCw, Star, Sparkles,
  Monitor, ExternalLink,
} from "lucide-react";
import { topicContent } from "@/data/topicContent";

type Phase =
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

  const [phase, setPhase] = useState<Phase>("explain");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [reResult, setReResult] = useState<QuizResult | null>(null);
  const [imgError, setImgError] = useState(false);

  const { data: allTopics } = useListTopics();
  const { data: quiz, isSuccess: quizReady, refetch: refetchQuiz } = useGenerateQuiz(topicId, {
    query: { enabled: false, queryKey: getGenerateQuizQueryKey(topicId) },
  });
  const submitQuiz = useSubmitQuiz();
  const staticContent = topicContent[topicId];
  const { data: explained, isLoading: explainLoading } = useExplainTopic(topicId, {
    query: { enabled: !!topicId && !staticContent, queryKey: getExplainTopicQueryKey(topicId) },
  });

  const topic = allTopics?.find(t => t.id === topicId);

  const content = React.useMemo(() => {
    if (explained) {
      return {
        title: explained.topicTitle,
        image: explained.imageUrl,
        tagline: explained.summary ?? staticContent?.tagline ?? "",
        sections: explained.sections,
        keyPoints: staticContent?.keyPoints ?? [],
      };
    }
    if (staticContent) {
      return {
        title: staticContent.title,
        image: staticContent.image,
        tagline: staticContent.tagline,
        sections: staticContent.sections,
        keyPoints: staticContent.keyPoints,
      };
    }
    return null;
  }, [explained, staticContent]);

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

  if (!content) {
    if (explainLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Content load ho raha hai...</p>
              <p className="text-sm text-muted-foreground mt-1">AI Hinglish mein explain kar raha hai 🤖</p>
            </div>
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">Is topic ka content load nahi ho saka.</p>
        <Button variant="outline" onClick={() => setLocation("/curriculum")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Curriculum par wapas jao
        </Button>
      </div>
    );
  }

  // ─── Loading Quiz ────────────────────────────────────────────────────────
  if (phase === "loading-quiz" || phase === "re-loading-quiz") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">Quiz generate ho raha hai...</p>
            <p className="text-sm text-muted-foreground mt-1">AI Hinglish mein sawaal bana raha hai 🧠</p>
          </div>
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // ─── Submitting ──────────────────────────────────────────────────────────
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

  // ─── Quiz UI Component ───────────────────────────────────────────────────
  function QuizUI({ onSubmit }: { onSubmit: () => void }) {
    const question = questions[currentQ];
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AI Quiz — Hinglish</p>
            <p className="text-sm font-semibold text-foreground leading-tight">{content?.title}</p>
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

  // ─── Quiz Phase ──────────────────────────────────────────────────────────
  if (phase === "quiz") {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
        <Button variant="ghost" size="sm" onClick={() => setPhase("explain")} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
          <ArrowLeft className="w-4 h-4" /> Wapas padho
        </Button>
        <Card className="border shadow-md">
          <CardContent className="p-6">
            <QuizUI onSubmit={() => handleSubmit(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Re-Quiz Phase ───────────────────────────────────────────────────────
  if (phase === "re-quiz") {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
          <ArrowLeft className="w-4 h-4" /> Curriculum
        </Button>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-center">
          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">🔄 Doosri Koshish — Tum kar sakte ho!</p>
        </div>
        <Card className="border shadow-md">
          <CardContent className="p-6">
            <QuizUI onSubmit={() => handleSubmit(true)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Passed ──────────────────────────────────────────────────────────────
  if (phase === "passed") {
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
            <Trophy className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zabardast! 🎉</h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-2">Module complete ho gaya!</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 rounded-full px-5 py-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xl">{result?.percentScore}%</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">score!</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-2">
            {result?.feedback.map((fb, i) => (
              <div key={i} className="flex items-start gap-2">
                {fb.correct
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
                <span className="text-xs text-foreground/80">{questions[i]?.question}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground italic">
            "Tum ne bahut accha kiya! Aage badhte raho, yahi attitude success dilata hai 💪"
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Curriculum
            </Button>
            <Button onClick={() => setLocation("/leaderboard")} className="gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Failed ──────────────────────────────────────────────────────────────
  if (phase === "failed") {
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
            <XCircle className="w-12 h-12 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Koi baat nahi! 💪</h1>
            <p className="text-muted-foreground mt-2">Score {result?.percentScore}% tha, pass ke liye 70% chahiye.</p>
            <p className="text-foreground/80 font-medium mt-1">Dobara padho, phir quiz do!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setPhase("re-explaining")} className="gap-2">
              <BookOpen className="w-4 h-4" /> Dobara padho
            </Button>
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Baad mein karta hoon
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Re-Explaining ───────────────────────────────────────────────────────
  if (phase === "re-explaining") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
          <ArrowLeft className="w-4 h-4" /> Curriculum
        </Button>

        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 p-4 text-center">
          <p className="text-amber-700 dark:text-amber-300 font-semibold">🔄 Dobara Padho — Is Baar Dhyan Se!</p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">Pehle sab samjho, phir quiz dena</p>
        </div>

        {!imgError && (
          <div className="rounded-2xl overflow-hidden h-48 md:h-56 relative shadow-md">
            <img
              src={content.image}
              alt={content.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
              <h2 className="text-white font-bold text-xl drop-shadow">{content.title}</h2>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {content.sections.map((section, i) => (
            <Card key={i} className="border shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground text-base mb-3">{section.heading}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
          <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-foreground text-lg mb-1">Ab ready ho? Dobara Quiz do! 🎯</h3>
          <p className="text-sm text-muted-foreground mb-4">Is baar 70% se upar lao — tum kar sakte ho!</p>
          <Button onClick={startReQuiz} size="lg" className="gap-2 px-8 w-full sm:w-auto">
            <Brain className="w-5 h-5" /> Quiz Shuru Karo
          </Button>
        </div>
      </div>
    );
  }

  // ─── Final Result ─────────────────────────────────────────────────────────
  if (phase === "final-result") {
    const fr = reResult;
    return (
      <div className="max-w-lg mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${fr?.passed ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-red-100 dark:bg-red-900/30"}`}>
            {fr?.passed
              ? <Trophy className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              : <RefreshCw className="w-12 h-12 text-red-500" />}
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
          <p className="text-sm text-muted-foreground italic">
            {fr?.passed
              ? "\"Tum ne haar nahi maani aur jeet liya! Yeh wali spirit hi success dilati hai. 🌟\""
              : "\"Har expert pehle ek beginner tha. Aao dobara padhein — is baar zaroor milega! 🚀\""}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="outline" onClick={() => setLocation("/curriculum")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Curriculum
            </Button>
            <Button onClick={() => { setPhase("explain"); setAnswers({}); setCurrentQ(0); }} variant="outline" className="gap-2">
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

  // ─── Explain Phase (DEFAULT) ──────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-3xl">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => setLocation("/curriculum")} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
        <ArrowLeft className="w-4 h-4" /> Curriculum
      </Button>

      {/* Hero Image */}
      {!imgError ? (
        <div className="rounded-2xl overflow-hidden h-52 md:h-72 relative shadow-lg">
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
            <div>
              {topic && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Badge className="text-xs capitalize bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {topic.level}
                  </Badge>
                  <Badge className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {topic.phase?.replace("Phase ", "P")}
                  </Badge>
                </div>
              )}
              <h1 className="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">{content.title}</h1>
              <p className="text-white/80 text-sm mt-1 drop-shadow">{content.tagline}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-8 text-center">
          <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-bold text-2xl text-foreground">{content.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{content.tagline}</p>
        </div>
      )}

      {/* Tagline card */}
      <div className="bg-primary/8 dark:bg-primary/15 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-primary leading-relaxed">{content.tagline}</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {content.sections.map((section, i) => (
          <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 md:p-6">
              <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
                {section.heading}
              </h3>
              <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
                {section.content.split('\n').map((line, j) => {
                  if (line.startsWith('```')) return null;
                  if (line.trim() === '') return <br key={j} />;
                  // Bold text between **
                  const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return (
                    <p key={j}
                      dangerouslySetInnerHTML={{ __html: boldFormatted }}
                      className={line.startsWith('•') || line.startsWith('-') ? 'ml-2' : ''}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Points */}
      {content.keyPoints.length > 0 && (
        <Card className="border border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" /> Key Points — Yaad Rakho!
            </h3>
            <ul className="space-y-2">
              {content.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quiz CTA */}
      <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-bold text-foreground text-xl mb-2">Padh liya? Ab Quiz do! 🧠</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
          AI Hinglish mein sawaal banega. 70% se upar lao to module complete ho jaayega!
        </p>
        <Button onClick={startQuiz} size="lg" className="gap-2 px-10 w-full sm:w-auto text-base">
          <Brain className="w-5 h-5" /> Quiz Shuru Karo
        </Button>
      </div>
    </div>
  );
}

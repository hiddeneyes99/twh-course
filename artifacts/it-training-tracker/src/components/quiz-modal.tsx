import React, { useState, useEffect } from "react";
import {
  useGenerateQuiz,
  useSubmitQuiz,
  getGetMemberProgressQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Brain,
  Trophy,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface QuizModalProps {
  topicId: string;
  topicTitle: string;
  memberId: number;
  onClose: () => void;
  onPassed: () => void;
}

type Phase = "loading" | "quiz" | "submitting" | "result";

interface QuizResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  percentScore: number;
  feedback: { questionIndex: number; correct: boolean; correctOption: number; explanation: string }[];
}

export default function QuizModal({ topicId, topicTitle, memberId, onClose, onPassed }: QuizModalProps) {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<Phase>("loading");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const { data: quiz, error: quizError, isSuccess: quizReady } = useGenerateQuiz(topicId);
  const submitQuiz = useSubmitQuiz();

  useEffect(() => {
    if (quizReady && quiz) {
      setPhase("quiz");
    }
  }, [quizReady, quiz]);

  if (phase === "loading" || (!quiz && !quizError)) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Generating Quiz</p>
            <p className="text-sm text-muted-foreground mt-1">AI is creating questions for &quot;{topicTitle}&quot;…</p>
          </div>
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </ModalShell>
    );
  }

  if (quizError || !quiz) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="font-semibold text-foreground">Failed to generate quiz</p>
          <p className="text-sm text-muted-foreground">Check that the GEMINI_API_KEY is set correctly.</p>
          <Button onClick={onClose} variant="outline" size="sm">Close</Button>
        </div>
      </ModalShell>
    );
  }

  const questions = quiz.questions;
  const totalQ = questions.length;

  function handleSelect(questionIndex: number, optionIndex: number) {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  }

  function handleSubmit() {
    const answersArr = Array.from({ length: totalQ }, (_, i) => answers[i] ?? -1);
    setPhase("submitting");
    submitQuiz.mutate(
      { data: { memberId, topicId, answers: answersArr } },
      {
        onSuccess: (data) => {
          setResult(data);
          setPhase("result");
          if (data.passed) {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(memberId) });
            onPassed();
          }
        },
        onError: () => setPhase("quiz"),
      }
    );
  }

  if (phase === "submitting") {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Evaluating your answers…</p>
        </div>
      </ModalShell>
    );
  }

  if (phase === "result" && result) {
    return (
      <ModalShell onClose={onClose}>
        <div className="space-y-6">
          <div className={`rounded-xl p-6 text-center ${result.passed ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
            {result.passed ? (
              <Trophy className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
            ) : (
              <XCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />
            )}
            <p className={`text-2xl font-bold ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
              {result.passed ? "Quiz Passed!" : "Not Passed Yet"}
            </p>
            <p className={`text-sm mt-1 ${result.passed ? "text-emerald-600" : "text-red-500"}`}>
              {result.passed
                ? "Module marked as complete automatically. Great work!"
                : "You need 70% to pass. Review the material and try again."}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-foreground">{result.percentScore}%</span>
              <span className="text-muted-foreground text-sm">
                ({result.score}/{result.totalQuestions} correct)
              </span>
            </div>
            <div className="mt-3 max-w-xs mx-auto">
              <Progress value={result.percentScore} className="h-2" />
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            <p className="text-sm font-semibold text-foreground sticky top-0 bg-white pb-1">Question Breakdown</p>
            {result.feedback.map((fb, i) => {
              const q = questions[i];
              return (
                <div key={i} className={`rounded-lg border p-3 text-sm ${fb.correct ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}`}>
                  <div className="flex items-start gap-2 mb-1.5">
                    {fb.correct
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                    <span className="font-medium text-foreground text-xs leading-snug">{q?.question}</span>
                  </div>
                  {!fb.correct && q && (
                    <p className="text-xs text-muted-foreground ml-6 mb-1">
                      Correct: <span className="font-medium text-foreground">{q.options[fb.correctOption]}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/80 ml-6 italic">{fb.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-1">
            {!result.passed && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAnswers({});
                  setCurrentQ(0);
                  setResult(null);
                  setPhase("loading");
                }}
              >
                Retry Quiz
              </Button>
            )}
            <Button className="flex-1" onClick={onClose}>
              {result.passed ? "Continue" : "Close"}
            </Button>
          </div>
        </div>
      </ModalShell>
    );
  }

  const question = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQ;

  return (
    <ModalShell onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AI Quiz</p>
            <p className="text-sm font-semibold text-foreground leading-tight">{topicTitle}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Question {currentQ + 1} of {totalQ}
            </span>
            <span className="text-xs text-muted-foreground">{answeredCount}/{totalQ} answered</span>
          </div>
          <Progress value={((currentQ + 1) / totalQ) * 100} className="h-1.5" />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-border">
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
                    : "border-border bg-white hover:border-primary/40 hover:bg-primary/4"
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>

          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentQ ? "bg-primary scale-125" :
                  answers[i] !== undefined ? "bg-primary/40" : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {currentQ < totalQ - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}
              disabled={answers[currentQ] === undefined}
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

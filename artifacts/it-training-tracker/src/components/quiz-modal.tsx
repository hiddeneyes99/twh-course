import React, { useState, useMemo } from "react";
import { useSubmitQuiz, getGetMemberProgressQueryKey } from "@workspace/api-client-react";
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
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { staticQuizQuestions } from "@/data/staticQuizQuestions";

interface QuizModalProps {
  topicId: string;
  topicTitle: string;
  memberId: number;
  onClose: () => void;
  onPassed: () => void;
}

type Phase = "quiz" | "submitting" | "result";

interface AnswerState {
  selected: number | null;
  locked: boolean;
  firstAttemptCorrect: boolean | null;
  wrongAttempts: number[];
}

interface QuizResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  percentScore: number;
  feedback: { questionIndex: number; correct: boolean; correctOption: number; explanation: string }[];
}

export default function QuizModal({ topicId, topicTitle, memberId, onClose, onPassed }: QuizModalProps) {
  const queryClient = useQueryClient();
  const submitQuiz = useSubmitQuiz();

  const questions = useMemo(() => {
    const qs = staticQuizQuestions[topicId];
    if (!qs || qs.length === 0) return [];
    return qs;
  }, [topicId]);

  const [phase, setPhase] = useState<Phase>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(() =>
    questions.map(() => ({ selected: null, locked: false, firstAttemptCorrect: null, wrongAttempts: [] }))
  );
  const [result, setResult] = useState<QuizResult | null>(null);

  const totalQ = questions.length;
  const allAnsweredCorrectly = answerStates.every(a => a.locked && a.firstAttemptCorrect !== null);
  const allLocked = answerStates.every(a => a.locked);

  function handleSelect(optionIndex: number) {
    const state = answerStates[currentQ];
    if (state.locked) return;

    const question = questions[currentQ];
    const isCorrect = optionIndex === question.correctIndex;

    setAnswerStates(prev => {
      const newStates = [...prev];
      if (isCorrect) {
        newStates[currentQ] = {
          selected: optionIndex,
          locked: true,
          firstAttemptCorrect: state.wrongAttempts.length === 0,
          wrongAttempts: state.wrongAttempts,
        };
      } else {
        newStates[currentQ] = {
          ...state,
          selected: optionIndex,
          wrongAttempts: [...state.wrongAttempts, optionIndex],
        };
      }
      return newStates;
    });
  }

  function handleSubmit() {
    const finalAnswers = answerStates.map((a) => {
      const q = questions[answerStates.indexOf(a)];
      return q ? q.correctIndex : 0;
    });

    const score = answerStates.filter(a => a.firstAttemptCorrect).length;
    const percentScore = Math.round((score / totalQ) * 100);
    const passed = percentScore >= 70;

    const feedback = questions.map((q, i) => ({
      questionIndex: i,
      correct: answerStates[i].firstAttemptCorrect === true,
      correctOption: q.correctIndex,
      explanation: q.explanation,
    }));

    setPhase("submitting");
    submitQuiz.mutate(
      { data: { memberId, topicId, answers: finalAnswers } },
      {
        onSuccess: () => {
          setResult({ passed, score, totalQuestions: totalQ, percentScore, feedback });
          setPhase("result");
          if (passed) {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(memberId) });
            onPassed();
          }
        },
        onError: () => {
          setResult({ passed, score, totalQuestions: totalQ, percentScore, feedback });
          setPhase("result");
          if (passed) {
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(memberId) });
            onPassed();
          }
        },
      }
    );
  }

  if (questions.length === 0) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Brain className="w-10 h-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">Quiz Not Available</p>
          <p className="text-sm text-muted-foreground">Is topic ke liye questions abhi nahi hain.</p>
          <Button onClick={onClose} variant="outline" size="sm">Close</Button>
        </div>
      </ModalShell>
    );
  }

  if (phase === "submitting") {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Results calculate ho rahe hain…</p>
        </div>
      </ModalShell>
    );
  }

  if (phase === "result" && result) {
    return (
      <ModalShell onClose={onClose}>
        <div className="space-y-5">
          <div className={`rounded-xl p-5 text-center ${result.passed ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
            {result.passed ? (
              <Trophy className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
            ) : (
              <XCircle className="w-10 h-10 mx-auto text-red-500 mb-2" />
            )}
            <p className={`text-2xl font-bold ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
              {result.passed ? "Quiz Pass Ho Gayi! 🎉" : "Pass Nahi Hua Abhi"}
            </p>
            <p className={`text-sm mt-1 ${result.passed ? "text-emerald-600" : "text-red-500"}`}>
              {result.passed
                ? "Module complete mark ho gaya. Bahut badhiya!"
                : "70% chahiye pass hone ke liye. Topic dobara padho aur try karo."}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-foreground">{result.percentScore}%</span>
              <span className="text-muted-foreground text-sm">({result.score}/{result.totalQuestions} sahi)</span>
            </div>
            <div className="mt-3 max-w-xs mx-auto">
              <Progress value={result.percentScore} className="h-2" />
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            <p className="text-sm font-semibold text-foreground sticky top-0 bg-white pb-1">Question Summary</p>
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
                      ✅ Sahi jawab: <span className="font-medium text-foreground">{q.options[fb.correctOption]}</span>
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
                className="flex-1 gap-1.5"
                onClick={() => {
                  setAnswerStates(questions.map(() => ({ selected: null, locked: false, firstAttemptCorrect: null, wrongAttempts: [] })));
                  setCurrentQ(0);
                  setResult(null);
                  setPhase("quiz");
                }}
              >
                <RotateCcw className="w-4 h-4" /> Dobara Try Karo
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
  const currentState = answerStates[currentQ];
  const answeredCount = answerStates.filter(a => a.locked).length;

  const isWrongSelected = currentState.selected !== null && !currentState.locked;
  const isCorrectLocked = currentState.locked;

  return (
    <ModalShell onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Quiz</p>
            <p className="text-sm font-semibold text-foreground leading-tight">{topicTitle}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Sawaal {currentQ + 1} / {totalQ}
            </span>
            <span className="text-xs text-muted-foreground">{answeredCount}/{totalQ} complete</span>
          </div>
          <Progress value={((currentQ + 1) / totalQ) * 100} className="h-1.5" />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-border">
          <p className="font-semibold text-foreground leading-snug text-sm">{question?.question}</p>
        </div>

        <div className="space-y-2">
          {question?.options.map((opt, i) => {
            const isSelected = currentState.selected === i;
            const isCorrect = i === question.correctIndex;
            const isWrong = currentState.wrongAttempts.includes(i);

            let btnClass = "border-border bg-white hover:border-primary/40 hover:bg-primary/4";
            let circleClass = "bg-muted text-muted-foreground";

            if (isCorrectLocked && isCorrect) {
              btnClass = "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300";
              circleClass = "bg-emerald-500 text-white";
            } else if (isWrong) {
              btnClass = "border-red-300 bg-red-50/60 opacity-70";
              circleClass = "bg-red-400 text-white";
            } else if (isSelected && !currentState.locked) {
              btnClass = "border-red-400 bg-red-50 ring-1 ring-red-300 animate-shake";
              circleClass = "bg-red-500 text-white";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={currentState.locked || isWrong}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 flex items-center gap-3 disabled:cursor-not-allowed ${btnClass}`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full text-xs items-center justify-center shrink-0 font-bold transition-colors ${circleClass}`}>
                  {isCorrectLocked && isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + i)}
                </span>
                <span className={
                  (isCorrectLocked && isCorrect) ? "text-emerald-700 font-medium" :
                  isWrong ? "text-red-400 line-through" :
                  "text-foreground"
                }>{opt}</span>
              </button>
            );
          })}
        </div>

        {isWrongSelected && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm font-semibold text-red-700">Galat Jawab!</p>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">{question?.explanation}</p>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-red-500">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Doosra option try karo — topic ko dhyan se padho phir.</span>
            </div>
          </div>
        )}

        {isCorrectLocked && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">
                {currentState.firstAttemptCorrect ? "Bilkul Sahi! 🎯" : "Sahi — lekin pehli baar nahi mila"}
              </p>
            </div>
            <p className="text-xs text-emerald-700/80 leading-relaxed">{question?.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Pehla
          </Button>

          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentQ ? "bg-primary scale-125" :
                  answerStates[i].locked && answerStates[i].firstAttemptCorrect ? "bg-emerald-400" :
                  answerStates[i].locked ? "bg-amber-400" :
                  "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {currentQ < totalQ - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentQ(q => Math.min(totalQ - 1, q + 1))}
              disabled={!currentState.locked}
              className="gap-1"
            >
              Agla <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!allLocked}
              className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Submit
            </Button>
          )}
        </div>

        {!currentState.locked && currentState.wrongAttempts.length >= 2 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Hint:</span> Sahi jawab hai: <span className="font-bold">"{question?.options[question.correctIndex]}"</span> — is topic ko dobara padho upar se!
            </p>
          </div>
        )}
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

import React, { useState } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import {
  useListTopics,
  getGetMemberProgressQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Brain, Trophy, BookOpen,
  Star, Sparkles,
} from "lucide-react";
import { topicContent } from "@/data/topicContent";
import { staticQuizQuestions } from "@/data/staticQuizQuestions";
import QuizModal from "@/components/quiz-modal";

export default function Learn() {
  const params = useParams<{ topicId: string }>();
  const topicId = params?.topicId ?? "";
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { currentMemberId } = useCurrentUser();

  const [imgError, setImgError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [passed, setPassed] = useState(false);

  const { data: allTopics } = useListTopics();
  const staticContent = topicContent[topicId];

  const topic = allTopics?.find(t => t.id === topicId);

  // Keep the phase accordion the user came from expanded when navigating back.
  const incomingPhase = new URLSearchParams(searchString).get("phase");
  const phaseForBack = incomingPhase ?? topic?.phase;
  const backToCurriculumHref = phaseForBack ? `/curriculum?phase=${encodeURIComponent(phaseForBack)}` : "/curriculum";

  const content = staticContent
    ? {
        title: staticContent.title,
        image: staticContent.image,
        tagline: staticContent.tagline,
        sections: staticContent.sections,
        keyPoints: staticContent.keyPoints,
      }
    : null;

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">Is topic ka content load nahi ho saka.</p>
        <Button variant="outline" onClick={() => setLocation(backToCurriculumHref)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Curriculum par wapas jao
        </Button>
      </div>
    );
  }

  return (
    <>
      {showQuiz && currentMemberId && (
        <QuizModal
          topicId={topicId}
          topicTitle={content.title}
          memberId={currentMemberId}
          onClose={() => setShowQuiz(false)}
          onPassed={() => {
            setPassed(true);
            setShowQuiz(false);
            queryClient.invalidateQueries({ queryKey: getGetMemberProgressQueryKey(currentMemberId) });
          }}
        />
      )}

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => setLocation(backToCurriculumHref)} className="gap-1.5 text-muted-foreground hover:text-foreground p-0">
          <ArrowLeft className="w-4 h-4" /> Curriculum
        </Button>

        {passed && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-700">Module Complete Ho Gaya! 🎉</p>
              <p className="text-sm text-emerald-600">Bahut badhiya! Curriculum mein progress update ho gaya.</p>
            </div>
            <Button size="sm" onClick={() => setLocation(backToCurriculumHref)} className="ml-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
              Curriculum
            </Button>
          </div>
        )}

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

        <div className="bg-primary/8 dark:bg-primary/15 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-primary leading-relaxed">{content.tagline}</p>
        </div>

        <div className="space-y-4">
          {content.sections.map((section, i) => (
            <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 md:p-6">
                <h3 className="font-bold text-foreground text-base mb-3 flex items-center gap-2">
                  {section.heading}
                </h3>
                <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
                  {(() => {
                    let inCodeBlock = false;
                    return section.content.split('\n').map((line, j) => {
                      if (line.startsWith('```')) {
                        inCodeBlock = !inCodeBlock;
                        return null;
                      }
                      if (line.trim() === '') return <br key={j} />;
                      if (inCodeBlock) {
                        return (
                          <code key={j} className="block text-xs font-mono text-foreground/60 bg-muted/50 px-1 rounded whitespace-pre-wrap break-all">
                            {line}
                          </code>
                        );
                      }
                      const escaped = line
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                      const boldFormatted = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      return (
                        <p key={j}
                          dangerouslySetInnerHTML={{ __html: boldFormatted }}
                          className={line.startsWith('•') || line.startsWith('-') ? 'ml-2' : ''}
                        />
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-bold text-foreground text-xl mb-2">Padh liya? Ab Quiz do! 🧠</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
            {staticQuizQuestions[topicId]?.length ?? 0} sawaal hain. 70% se upar lao to module complete ho jaayega!
          </p>
          <Button onClick={() => setShowQuiz(true)} size="lg" className="gap-2 px-10 w-full sm:w-auto text-base">
            <Brain className="w-5 h-5" /> Quiz Shuru Karo
          </Button>
        </div>
      </div>
    </>
  );
}

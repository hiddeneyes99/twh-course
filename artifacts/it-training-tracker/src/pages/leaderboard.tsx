import React from "react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { useCurrentUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Star, Loader2 } from "lucide-react";

const avatarColors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

const rankMedal = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <Star className="w-4 h-4 text-muted-foreground/40" />;
};

const rankBg = (rank: number) => {
  if (rank === 1) return "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30";
  if (rank === 2) return "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30";
  if (rank === 3) return "border-amber-100 dark:border-amber-800 bg-orange-50 dark:bg-orange-950/20";
  return "border-border bg-card";
};

export default function Leaderboard() {
  const { currentMemberId } = useCurrentUser();
  const { data: entries, isLoading } = useGetLeaderboard();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Dekho kaun sabse aage hai training mein! 🏆
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Leaderboard load ho raha hai…</p>
          </div>
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
          <Trophy className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">Abhi koi data nahi hai. Quiz do aur leaderboard mein aa jao!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const isMe = entry.memberId === currentMemberId;
            return (
              <Card
                key={entry.memberId}
                className={`border shadow-sm transition-all duration-200 ${rankBg(entry.rank)} ${isMe ? "ring-2 ring-primary/30" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border shrink-0 font-bold text-sm text-foreground">
                      {entry.rank <= 3 ? rankMedal(entry.rank) : `#${entry.rank}`}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0 font-bold text-white text-sm`}>
                      {entry.memberName.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">
                          {entry.memberName}
                        </p>
                        {isMe && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            Tum
                          </span>
                        )}
                        {entry.rank === 1 && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                            🥇 Champion
                          </span>
                        )}
                      </div>
                      {entry.memberRole && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {entry.memberRole.split("—")[0]?.trim()}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={entry.completionPercent} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-foreground shrink-0 tabular-nums">
                          {entry.completionPercent}%
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {entry.totalCompleted} / {entry.totalTopics} modules complete
                      </p>
                    </div>

                    {/* Score badge */}
                    <div className={`shrink-0 text-center px-3 py-2 rounded-xl border ${
                      entry.completionPercent >= 70
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700"
                        : entry.completionPercent >= 30
                        ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-700"
                        : "bg-muted border-border"
                    }`}>
                      <p className={`text-lg font-bold tabular-nums ${
                        entry.completionPercent >= 70 ? "text-emerald-600 dark:text-emerald-400"
                        : entry.completionPercent >= 30 ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                      }`}>
                        {entry.completionPercent}%
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {entries && entries.length > 0 && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Ranking completion percentage ke basis pe hai. Quiz pass karo aur upar aao! 🚀
        </p>
      )}
    </div>
  );
}

import React from "react";
import { useListMembers } from "@workspace/api-client-react";
import { GraduationCap, Loader2 } from "lucide-react";

interface WhoAreYouProps {
  onSelect: (memberId: number, memberName: string) => void;
}

const avatarColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function WhoAreYou({ onSelect }: WhoAreYouProps) {
  const { data: members, isLoading } = useListMembers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[hsl(263,50%,10%)] via-[hsl(263,50%,16%)] to-[hsl(263,40%,22%)]">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">CYBER_TRACK</h1>
          <p className="text-purple-200/60 text-sm mt-1 tracking-widest uppercase">IT Training System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
          <p className="text-white font-semibold text-lg text-center mb-1">
            Kaun ho tum? 👀
          </p>
          <p className="text-purple-200/60 text-sm text-center mb-6">
            Apna naam select karo continue karne ke liye
          </p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
            </div>
          ) : members && members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member, idx) => (
                <button
                  key={member.id}
                  onClick={() => onSelect(member.id, member.name)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group text-left"
                >
                  <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0 font-bold text-white text-sm`}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold group-hover:text-purple-200 transition-colors">
                      {member.name}
                    </p>
                    {member.role && (
                      <p className="text-purple-300/60 text-xs truncate">{member.role}</p>
                    )}
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 group-hover:border-purple-300 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-purple-200/60 text-sm">
              Koi member nahi mila. Database check karo.
            </div>
          )}
        </div>

        <p className="text-center text-purple-300/40 text-xs mt-6">
          CYBER_TRACK · IT Training Tracker
        </p>
      </div>
    </div>
  );
}

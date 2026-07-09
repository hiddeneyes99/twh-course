import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListMembers,
  useCreateMember,
  useDeleteMember,
  getListMembersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, UserPlus, ChevronRight, Users2, Lock } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
});

export default function Team() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { currentMemberId } = useCurrentUser();

  const { data: members, isLoading } = useListMembers();
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();

  const currentMember = members?.find(m => m.id === currentMemberId);
  const isOwner = currentMember?.name === "Twh";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", role: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMember.mutate(
      { data: values },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
        },
      }
    );
  }

  function handleDelete(id: number) {
    if (confirm("Is member ko team se remove karo?")) {
      deleteMember.mutate(
        { id },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }) }
      );
    }
  }

  const avatarColors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users2 className="w-6 h-6 text-primary" />
          Team Roster
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Team members aur unki training roles.
          {!isOwner && (
            <span className="ml-2 text-muted-foreground">Naye members add karne ke liye admin se contact karo.</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {isOwner ? (
                  <><UserPlus className="w-4 h-4 text-primary" /> Naya Member Add Karo</>
                ) : (
                  <><Lock className="w-4 h-4 text-muted-foreground" /> Member Add Karo</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isOwner ? (
                <div className="text-center py-6 border-2 border-dashed border-border rounded-xl bg-muted/40">
                  <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Yeh section admin ke liye hai</p>
                  <p className="text-xs text-muted-foreground mt-1">Naya member add karne ke liye admin se request karo</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Naam</FormLabel>
                          <FormControl>
                            <Input placeholder="jaise Prince" className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="jaise Security Analyst" className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full font-medium"
                      disabled={createMember.isPending}
                    >
                      {createMember.isPending ? "Adding…" : "Add Member"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : members?.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
              <Users2 className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Koi member nahi hai abhi.</p>
            </div>
          ) : (
            members?.map((member, idx) => (
              <Card
                key={member.id}
                className={`border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${
                  member.id === currentMemberId
                    ? "border-primary/40 bg-primary/3"
                    : "hover:border-primary/30"
                }`}
                onClick={() => setLocation(`/member/${member.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">
                      {member.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {member.name}
                      {member.id === currentMemberId && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Tum</span>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {member.role || "No role assigned"} · Joined {new Date(member.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {isOwner && member.name !== "Twh" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                      disabled={deleteMember.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

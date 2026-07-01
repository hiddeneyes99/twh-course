import React from "react";
import { useLocation, Link } from "wouter";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, UserPlus, Users, ChevronRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
});

export default function Team() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: members, isLoading } = useListMembers();
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
    },
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
    if (confirm("Remove operative from system?")) {
      deleteMember.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
          },
        }
      );
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold font-mono text-foreground mb-2 flex items-center">
          <Users className="w-8 h-8 text-primary mr-3" />
          OPERATIVE_ROSTER
        </h1>
        <p className="text-muted-foreground">Manage active team members and roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-lg flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-primary" />
                NEW_OPERATIVE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs text-muted-foreground">IDENTIFIER (NAME)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Neo" className="font-mono bg-background" {...field} />
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
                        <FormLabel className="font-mono text-xs text-muted-foreground">SPECIALIZATION (OPTIONAL)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Penetration Tester" className="font-mono bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full font-mono font-bold tracking-wider" 
                    disabled={createMember.isPending}
                  >
                    {createMember.isPending ? "INITIALIZING..." : "ADD_OPERATIVE"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="font-mono text-primary animate-pulse text-center py-8">SCANNING_ROSTER...</div>
          ) : (
            members?.map((member) => (
              <Card key={member.id} className="border-border bg-card hover:border-primary/50 transition-colors group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => setLocation(`/member/${member.id}`)}
                  >
                    <div className="font-mono font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center">
                      {member.name}
                      <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {member.role || "UNASSIGNED"} | REGISTERED: {new Date(member.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(member.id)}
                    disabled={deleteMember.isPending}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
          {members?.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/50">
              <p className="text-muted-foreground font-mono">NO_OPERATIVES_FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

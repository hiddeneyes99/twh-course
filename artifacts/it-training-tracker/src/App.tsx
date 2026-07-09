import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Curriculum from "@/pages/curriculum";
import Team from "@/pages/team";
import Member from "@/pages/member";
import Leaderboard from "@/pages/leaderboard";
import Learn from "@/pages/learn";
import Layout from "@/components/layout";
import WhoAreYou from "@/components/who-are-you";
import { UserProvider, useCurrentUser } from "@/context/UserContext";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — don't refetch if data is fresh
      gcTime: 15 * 60 * 1000,     // 15 min — keep in memory after unmount
      refetchOnWindowFocus: false, // don't refetch just because the window regained focus
      retry: 1,
    },
  },
});

const LAST_PAGE_KEY = (id: number) => `cybertrack_last_page_${id}`;

/** Saves current route to localStorage and restores it on first mount. */
function RouteWatcher({ memberId }: { memberId: number }) {
  const [location, navigate] = useLocation();
  const key = LAST_PAGE_KEY(memberId);
  const restored = useRef(false);

  // Restore once on first mount
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = localStorage.getItem(key);
    // Restore if there's a saved page and we're still on root "/"
    if (saved && saved !== "/" && location === "/") {
      navigate(saved, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every route change
  useEffect(() => {
    localStorage.setItem(key, location);
  }, [location, key]);

  return null;
}

function Router({ memberId }: { memberId: number }) {
  return (
    <Layout>
      <RouteWatcher memberId={memberId} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/curriculum" component={Curriculum} />
        <Route path="/team" component={Team} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/learn/:topicId" component={Learn} />
        <Route path="/member/:id" component={Member} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppInner() {
  const { currentMemberId, setCurrentMemberId, setToken } = useCurrentUser();

  if (!currentMemberId) {
    return (
      <WhoAreYou
        onSelect={(id, token) => {
          setToken(token);
          setCurrentMemberId(id);
        }}
      />
    );
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router memberId={currentMemberId} />
    </WouterRouter>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <AppInner />
            <Toaster />
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

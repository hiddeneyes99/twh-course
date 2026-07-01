import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Curriculum from "@/pages/curriculum";
import Team from "@/pages/team";
import Member from "@/pages/member";
import Layout from "@/components/layout";
import WhoAreYou from "@/components/who-are-you";
import { UserProvider, useCurrentUser } from "@/context/UserContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/curriculum" component={Curriculum} />
        <Route path="/team" component={Team} />
        <Route path="/member/:id" component={Member} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppInner() {
  const { currentMemberId, setCurrentMemberId } = useCurrentUser();

  if (!currentMemberId) {
    return (
      <WhoAreYou
        onSelect={(id) => setCurrentMemberId(id)}
      />
    );
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <AppInner />
          <Toaster />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

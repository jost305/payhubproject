import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminDashboard from "@/pages/dashboard/admin";
import FreelancerDashboard from "@/pages/dashboard/freelancer";
import ProjectPage from "@/pages/project/[id]";
import PreviewPage from "@/pages/preview/[id]";
import CheckoutPage from "@/pages/payment/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard/admin" component={AdminDashboard} />
      <Route path="/dashboard/freelancer" component={FreelancerDashboard} />
      <Route path="/project/:id" component={ProjectPage} />
      <Route path="/preview/:id" component={PreviewPage} />
      <Route path="/checkout/:id" component={CheckoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

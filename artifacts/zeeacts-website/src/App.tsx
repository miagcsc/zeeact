import { lazy, Suspense } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AnalyticsInjector from "@/components/AnalyticsInjector";
import { getRuntimeApiBaseUrl } from "./runtime-env";

const AdminPage = lazy(() => import("@/pages/AdminPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const SolutionPage = lazy(() => import("@/pages/SolutionPage"));

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiBaseUrl = getRuntimeApiBaseUrl(basePath);

// Configure the API client hooks to call the right backend origin.
// - Railway/local: `API_URL` is unset, so this falls back to `basePath` (usually '').
// - Coolify separate frontend/backend: set `API_URL` and the frontend will call it at runtime.
setBaseUrl(apiBaseUrl);

function AdminRoute() {
  return (
    <AdminPage />
  );
}

function AppRoutes() {
  const [, setLocation] = useLocation();

  return (
    <>
      <AnalyticsInjector />
      <TooltipProvider>
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/solutions/:slug" component={SolutionPage} />
            <Route path="/sign-in/*?">
              <Redirect to="/admin" />
            </Route>
            <Route path="/sign-up/*?">
              <Redirect to="/admin" />
            </Route>
            <Route path="/admin" component={AdminRoute} />
            <Route path="/admin/*?" component={AdminRoute} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;

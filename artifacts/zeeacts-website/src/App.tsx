import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, Show, useClerk } from '@clerk/react';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AdminPage from "@/pages/AdminPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import SolutionPage from "@/pages/SolutionPage";
import AnalyticsInjector from "@/components/AnalyticsInjector";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  console.error('Missing VITE_CLERK_PUBLISHABLE_KEY — set this variable and redeploy.');
}

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={undefined} fallbackRedirectUrl="/admin" />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function AdminRoute() {
  return (
    <>
      <Show when="signed-in">
        <AdminPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  if (!clerkPubKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white text-center p-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p className="text-zinc-400">VITE_CLERK_PUBLISHABLE_KEY is not set. Please add it to your environment variables and redeploy.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
      appearance={{
        variables: {
          colorPrimary: "#E63950",
          colorDanger: "#E63950",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <AnalyticsInjector />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/solutions/:slug" component={SolutionPage} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?"><Redirect to="/sign-in" /></Route>
            <Route path="/admin" component={AdminRoute} />
            <Route path="/admin/*?" component={AdminRoute} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Analytics from "./components/Analytics";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ServicePage from "./pages/ServicePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TradeflowPage from "./pages/TradeflowPage";
import BlogPost from "./pages/BlogPost";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Redirect } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

// Portal pages load on demand so marketing visitors don't download them
const PortalLogin = lazy(() => import("./pages/PortalLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const ProtectedRoute = ({ component: Component, role }: { component: any, role?: "admin" | "user" }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Redirect to="/portal/login" />;

  if (role && user.role !== role) {
    return <Redirect to={user.role === 'admin' ? '/admin' : '/portal'} />;
  }

  return <Component />;
};

// Portal and admin pages should never appear in search results
function PrivateNoIndex() {
  const [location] = useLocation();
  if (!/^\/(portal|admin|login)(\/|$)/.test(location)) return null;
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <>
      <ScrollToTop />
      <PrivateNoIndex />
      <Analytics />
      {/*
        initial={false}: the first page shows its content immediately (it arrives
        pre-rendered), so entrance animations only play on later page changes.
        Keyed by path so each new page mounts fresh and animates in.
      */}
      <AnimatePresence initial={false} mode="wait">
      <div key={location}>
      <Suspense fallback={<div className="min-h-screen" />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/projects"} component={ProjectsPage} />
        <Route path={"/services"} component={ServicesPage} />
        <Route path={"/services/:slug"} component={ServicePage} />
        <Route path={"/blog"} component={BlogPost} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/about"} component={AboutPage} />
        <Route path={"/contact"} component={ContactPage} />
        <Route path={"/products/tradeflow"} component={TradeflowPage} />
        <Route path={"/privacy"} component={PrivacyPolicy} />
        <Route path={"/terms"} component={TermsOfUse} />
        <Route path={"/login"}>
          <Redirect to="/portal/login" />
        </Route>
        <Route path={"/portal/login"} component={PortalLogin} />
        <Route path={"/portal/accept-invite"} component={AcceptInvite} />
        <Route path={"/portal/reset-password"} component={ResetPassword} />
        <Route path={"/portal"}>
          {() => <ProtectedRoute component={ClientPortal} role="user" />}
        </Route>
        <Route path={"/admin"}>
          {() => <ProtectedRoute component={AdminDashboard} role="admin" />}
        </Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      </div>
      </AnimatePresence>
    </>

  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

/**
 * `ssrPath` and `helmetContext` are only passed when pre-rendering pages at build
 * time (see entry-server.tsx); in the browser the app reads the real URL.
 */
function App({ ssrPath, helmetContext }: { ssrPath?: string; helmetContext?: object } = {}) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <AuthProvider>
          <HelmetProvider context={helmetContext}>
            {/* Only the animation features the site uses, instead of the full framer-motion bundle */}
            <LazyMotion features={domAnimation}>
              <WouterRouter ssrPath={ssrPath}>
                <Toaster />
                <Router />
              </WouterRouter>
            </LazyMotion>
          </HelmetProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

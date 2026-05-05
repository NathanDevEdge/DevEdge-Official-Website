import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ServicePage from "./pages/ServicePage";
import BlogPost from "./pages/BlogPost";
import PortalLogin from "./pages/PortalLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientPortal from "./pages/ClientPortal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Redirect } from "wouter";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const ProtectedRoute = ({ component: Component, role }: { component: any, role?: "admin" | "client" }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Redirect to="/portal/login" />;

  if (role && user.role !== role) {
    return <Redirect to={user.role === 'admin' ? '/admin' : '/portal'} />;
  }

  return <Component />;
};

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/projects"} component={ProjectsPage} />
        <Route path={"/services/:slug"} component={ServicePage} />
        <Route path={"/blog"} component={BlogPost} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/portal/login"} component={PortalLogin} />
        <Route path={"/portal"}>
          {() => <ProtectedRoute component={ClientPortal} role="client" />}
        </Route>
        <Route path={"/admin"}>
          {() => <ProtectedRoute component={AdminDashboard} role="admin" />}
        </Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>

  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <AuthProvider>
          <TooltipProvider>
            <HelmetProvider>
              <Toaster />
              <Router />
            </HelmetProvider>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

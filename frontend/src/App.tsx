import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Check, X } from "lucide-react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { ReleaseProvider } from "@/contexts/ReleaseContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { ArtistProvider } from "@/contexts/ArtistContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { Layout } from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import FeedPage from "@/pages/FeedPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ThemedToaster = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-center"
      theme={theme === "system" ? "system" : theme}
      icons={{
        success: <Check className="w-4 h-4 text-green-500" />,
        error: <X className="w-4 h-4 text-red-500" />,
      }}
    />
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <StatsProvider>
          <ArtistProvider>
            <ReleaseProvider>
              <SyncProvider>
                <Router>
                <ThemedToaster />
                <ScrollToTop />
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
              </SyncProvider>
            </ReleaseProvider>
          </ArtistProvider>
        </StatsProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

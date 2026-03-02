import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { ReleaseProvider } from "@/contexts/ReleaseContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { ArtistProvider } from "@/contexts/ArtistContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { Layout } from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import FeedPage from "@/pages/FeedPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => {
  return (
    <UserProvider>
      <StatsProvider>
        <ArtistProvider>
          <ReleaseProvider>
            <SyncProvider>
              <Router>
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            </SyncProvider>
          </ReleaseProvider>
        </ArtistProvider>
      </StatsProvider>
    </UserProvider>
  );
};

export default App;

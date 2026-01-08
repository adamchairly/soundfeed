import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { ReleaseProvider } from "@/contexts/ReleaseContext";
import "@/index.css";
import { ArtistProvider } from "@/contexts/ArtistContext";
import { UserProvider } from "@/contexts/UserContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ArtistProvider>
        <ReleaseProvider>
          <App />
        </ReleaseProvider>
      </ArtistProvider>
    </UserProvider>
  </StrictMode>
);

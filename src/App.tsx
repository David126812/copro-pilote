import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import { AuthGuard } from "./components/auth/AuthGuard";
import Dashboard from "./pages/Dashboard";
import DossiersList from "./pages/DossiersList";
import DossierDetail from "./pages/DossierDetail";
import StatusUpdate from "./pages/StatusUpdate";
import Confirmation from "./pages/Confirmation";
import SignalerIncident from "./pages/SignalerIncident";
import Assistant from "./pages/Assistant";
import VoiceAgent from "./pages/VoiceAgent";
import AssistantIA from "./pages/AssistantIA";
import Channels from "./pages/Channels";
import Settings from "./pages/Settings";
import PushSimulation from "./pages/PushSimulation";
import Signalements from "./pages/Signalements";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    const isNarrow = window.innerWidth <= 500;
    setIsMobile(isStandalone || isNarrow);

    const onChange = () => setIsMobile(
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      window.innerWidth <= 500
    );
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, []);
  return isMobile;
};

const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="min-h-screen bg-card">{children}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-5 px-4"
      style={{ background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #334155 100%)" }}
    >
      <div>
        <div className="text-center mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>
            Prototype • Conseil Syndical
          </h2>
        </div>
        <div className="relative w-[375px] h-[812px] rounded-[44px] overflow-hidden bg-card"
          style={{ boxShadow: "0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 20px 80px rgba(0,0,0,0.35)" }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[36px] bg-[#000] rounded-b-[24px] rounded-t-none z-50" style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
          {/* Screen */}
          <div className="h-full overflow-y-auto pt-[54px] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
        <div className="text-center mt-5">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Cliquez pour naviguer entre les écrans
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/dossiers" element={<AuthGuard><DossiersList /></AuthGuard>} />
            <Route path="/dossiers/:id" element={<AuthGuard><DossierDetail /></AuthGuard>} />
            <Route path="/dossiers/:id/update" element={<AuthGuard><StatusUpdate /></AuthGuard>} />
            <Route path="/dossiers/:id/confirmation" element={<AuthGuard><Confirmation /></AuthGuard>} />
            <Route path="/push-simulation" element={<AuthGuard><PushSimulation /></AuthGuard>} />
            <Route path="/signaler-incident" element={<AuthGuard><SignalerIncident /></AuthGuard>} />
            <Route path="/assistant" element={<AuthGuard><AssistantIA /></AuthGuard>} />
            <Route path="/voice-agent" element={<AuthGuard><AssistantIA /></AuthGuard>} />
            <Route path="/channels" element={<AuthGuard><Channels /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
            <Route path="/signalements" element={<AuthGuard><Signalements /></AuthGuard>} />
            <Route path="/events" element={<AuthGuard><Events /></AuthGuard>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

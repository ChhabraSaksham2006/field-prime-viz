import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import HealthMap from "./pages/HealthMap";
import TerrainVisualization from "./pages/TerrainVisualization";
import SpectralAnalysis from "./pages/SpectralAnalysis";
import Settings from "./pages/Settings";
import FieldManagement from "./pages/FieldManagement";
import Team from "./pages/Team";
import { DataSources } from "./pages/DataSources";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Help from "./pages/Help";
import GettingStarted from "./pages/help/GettingStarted";
import FAQ from "./pages/help/FAQ";
// AppHeader import removed as it's not needed
import { AppSidebar } from "./components/layout/AppSidebar";
import { Header } from "@/components/layout/Header"; // <-- Make sure this exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
            <Route path="/help/getting-started" element={<PublicLayout><GettingStarted /></PublicLayout>} />
            <Route path="/help/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />

            <Route path="/health-map" element={
              <AppLayout>
                <HealthMap />
              </AppLayout>
            } />
            <Route path="/terrain" element={
              <AppLayout>
                <TerrainVisualization />
              </AppLayout>
            } />
            <Route path="/spectral" element={
              <AppLayout>
                <SpectralAnalysis />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } />
            <Route path="/fields" element={
              <AppLayout>
                <FieldManagement />
              </AppLayout>
            } />
            <Route path="/data" element={
              <AppLayout>
                <DataSources />
              </AppLayout>
            } />
            <Route path="/team" element={
              <AppLayout>
                <Team />
              </AppLayout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

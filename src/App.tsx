import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import HealthMap from "./pages/HealthMap";
import TerrainVisualization from "./pages/TerrainVisualization";
import SpectralAnalysis from "./pages/SpectralAnalysis";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// AppHeader import removed as it's not needed
import { AppSidebar } from "./components/layout/AppSidebar";
import { Header } from "@/components/layout/Header"; // <-- Make sure this exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/upload" element={
              <AppLayout>
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    Image Upload Coming Soon
                  </h1>
                </div>
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
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    Settings Coming Soon
                  </h1>
                </div>
              </AppLayout>
            } />
            <Route path="/fields" element={
              <AppLayout>
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    Field Management Coming Soon
                  </h1>
                </div>
              </AppLayout>
            } />
            <Route path="/data" element={
              <AppLayout>
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    Data Sources Coming Soon
                  </h1>
                </div>
              </AppLayout>
            } />
            <Route path="/team" element={
              <AppLayout>
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    Team Management Coming Soon
                  </h1>
                </div>
              </AppLayout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

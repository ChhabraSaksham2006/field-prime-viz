import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import ImageUpload from "./pages/ImageUpload";
import HealthMap from "./pages/HealthMap";
import TerrainVisualization from "./pages/TerrainVisualization";
import SpectralAnalysis from "./pages/SpectralAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* Placeholder routes for other pages */}
                  <Route path="/upload" element={<ImageUpload />} />
                  <Route path="/health-map" element={<HealthMap />} />
                  <Route path="/terrain" element={<TerrainVisualization />} />
                  <Route path="/spectral" element={<SpectralAnalysis />} />
                  <Route path="/fields" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gradient-primary">Field Management Coming Soon</h1></div>} />
                  <Route path="/team" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gradient-primary">Team Management Coming Soon</h1></div>} />
                  <Route path="/data" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gradient-primary">Data Sources Coming Soon</h1></div>} />
                  <Route path="/settings" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gradient-primary">Settings Coming Soon</h1></div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

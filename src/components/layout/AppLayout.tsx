import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainContentWrapper } from "@/components/layout/MainContentWrapper";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <MainContentWrapper>
          {children}
        </MainContentWrapper>
      </div>
    </SidebarProvider>
  );
}
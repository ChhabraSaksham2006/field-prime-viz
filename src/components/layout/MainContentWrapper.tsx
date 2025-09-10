import { ReactNode } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";

interface MainContentWrapperProps {
  children: ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? "ml-4" : "ml-16"
      }`}
      style={{ minHeight: "100vh" }}
    >
      <Header />
      <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

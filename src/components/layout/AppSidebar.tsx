import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BarChart3,
  Upload,
  Map,
  Mountain,
  Activity,
  Leaf,
  Settings,
  Users,
  Database,
  AlertTriangle,
  Droplets,
  Sun,
  Thermometer,
  LineChart,
  PieChart,
  LayoutDashboard,
  ChevronRight
} from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    description: "Agricultural Analytics Overview"
  },
  {
    title: "Image Upload",
    url: "/upload",
    icon: Upload,
    description: "Hyperspectral Image Analysis"
  },
  {
    title: "Health Map",
    url: "/health-map",
    icon: Map,
    description: "Interactive Crop Health Visualization"
  },
  {
    title: "3D Terrain",
    url: "/terrain",
    icon: Mountain,
    description: "3D Field Visualization"
  },
  {
    title: "Spectral Analysis",
    url: "/spectral",
    icon: Activity,
    description: "Real-time Spectral Signatures"
  }
]

const secondaryItems = [
  {
    title: "Field Management",
    url: "/fields",
    icon: Leaf,
    description: "Manage Farm Fields"
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
    description: "Collaborate with Team"
  },
  {
    title: "Data Sources",
    url: "/data",
    icon: Database,
    description: "Manage Data Integrations"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Application Settings"
  }
]

export function AppSidebar() {
  const { state, open } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
    const isActiveRoute = isActive(path)
    
    if (isActiveRoute) {
      return `${baseClasses} bg-primary/15 text-primary border border-primary/30 shadow-soft after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary`
    }
    
    return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border hover:border-primary/10`
  }

  return (
    <Sidebar
      className={`${isCollapsed ? "w-4" : "w-72"} transition-all duration-300 border-r border-border/60 bg-card/30 backdrop-blur-lg z-30`}
      collapsible="icon"
      role="navigation"
      aria-label="Main Navigation"
    >
      <SidebarContent className={`${isCollapsed ? "px-2 sm:px-2 py-4 sm:py-6 overflow-y-auto max-h-screen" : "px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto max-h-screen"}`}>
        {/* Logo and Brand */}
        <div className={`${isCollapsed ? "flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2 sm:px-0" : "flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2 sm:px-3"}`}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-base sm:text-lg text-gradient-primary truncate">AgriTech Pro</h1>
              <p className="text-xs text-muted-foreground truncate">Smart India Hackathon 2025</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel id="analytics-heading" className={`px-2 sm:px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 ${isCollapsed ? "sr-only" : ""}`}>
            Analysis Tools
          </SidebarGroupLabel>
          <SidebarGroupContent aria-labelledby="analytics-heading" role="menu" className={`${isCollapsed ? "w-20 pr-3 absolute left-0" : "w-72"}`}>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-12">
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      title={isCollapsed ? item.title : undefined}
                      aria-current={isActive(item.url) ? "page" : undefined}
                      aria-label={`${item.title}: ${item.description}`}
                      role="menuitem"
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-colors ${isActive(item.url) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium text-xs sm:text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      )}
                      {!isCollapsed && isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        {!isCollapsed && (
          <SidebarGroup className="mt-6 sm:mt-8">
            <SidebarGroupLabel id="management-heading" className="px-2 sm:px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent aria-labelledby="management-heading" role="menu">
              <SidebarMenu className="space-y-1">
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses(item.url)}
                        aria-current={isActive(item.url) ? "page" : undefined}
                        aria-label={`${item.title}: ${item.description}`}
                        role="menuitem"
                      >
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-colors ${isActive(item.url) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                          <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium text-xs sm:text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                        {isActive(item.url) && (
                          <ChevronRight className="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Collapse trigger when sidebar is collapsed */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 ">
          <SidebarTrigger className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 shadow-soft transition-all hover:shadow-medium " />
        </div>
      )}
      
      {/* Mobile sidebar toggle - only visible on small screens */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <SidebarTrigger className="w-12 h-12 rounded-full bg-primary shadow-glow flex items-center justify-center text-primary-foreground" />
      </div>
    </Sidebar>
  )
}
import { useState } from "react"
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
  Database
} from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
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
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
    const isActiveRoute = isActive(path)
    
    if (isActiveRoute) {
      return `${baseClasses} bg-primary/10 text-primary border border-primary/20 shadow-soft`
    }
    
    return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent/50`
  }

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-72"} transition-all duration-300 border-r border-border/60 bg-card/30 backdrop-blur-lg`}
      collapsible="icon"
    >
      <SidebarContent className="px-4 py-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-8 px-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-gradient-primary">AgriTech Pro</h1>
              <p className="text-xs text-muted-foreground">Smart India Hackathon 2025</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={`px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${isCollapsed ? "sr-only" : ""}`}>
            Analysis Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.url) ? 'text-primary' : ''}`} />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
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
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses(item.url)}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.url) ? 'text-primary' : ''}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <SidebarTrigger className="w-8 h-8 bg-primary/10 hover:bg-primary/20 border border-primary/20" />
        </div>
      )}
    </Sidebar>
  )
}
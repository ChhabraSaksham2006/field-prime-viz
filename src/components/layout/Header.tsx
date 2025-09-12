import { Bell, Search, User, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { logout } = useAuth();
  
  const handleSignOut = () => {
    logout();
    // Dispatch custom event for the chatbot to detect
    const authChangeEvent = new CustomEvent('authChange', { detail: { isAuthenticated: false } });
    document.dispatchEvent(authChangeEvent);
  };
  
  return (
    <header className="h-16 border-b border-border/60 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent/50" />
          
          {/* Search */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-muted/30 border-border/60 focus:border-primary/40"
              aria-label="Search the application"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Status indicators */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="bg-health-excellent/10 text-health-excellent border-health-excellent/20">
              System Online
            </Badge>
            <Badge variant="outline" className="bg-tech-primary/10 text-tech-primary border-tech-primary/20">
              Live Data
            </Badge>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" aria-label="View notifications">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="sr-only">1 unread notification</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/50" aria-label="User menu">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">Dr. Agri Researcher</div>
                  <div className="text-xs text-muted-foreground">Senior Analyst</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Team Management</DropdownMenuItem>
              <DropdownMenuItem>Data Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
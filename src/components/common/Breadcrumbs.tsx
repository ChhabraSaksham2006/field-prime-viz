import { ChevronRight, Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/upload": "Image Upload",
  "/health-map": "Health Map",
  "/terrain": "3D Terrain",
  "/spectral": "Spectral Analysis",
  "/fields": "Field Management",
  "/team": "Team",
  "/data": "Data Sources",
  "/settings": "Settings"
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { path: '/', label: 'Dashboard', isHome: true }
  ]
  
  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const label = routeLabels[currentPath] || segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    breadcrumbs.push({ path: currentPath, label, isHome: false })
  })

  if (breadcrumbs.length === 1) return null

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium flex items-center gap-1">
              {breadcrumb.isHome && <Home className="w-4 h-4" />}
              {breadcrumb.label}
            </span>
          ) : (
            <Link 
              to={breadcrumb.path} 
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              {breadcrumb.isHome && <Home className="w-4 h-4" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  )
}
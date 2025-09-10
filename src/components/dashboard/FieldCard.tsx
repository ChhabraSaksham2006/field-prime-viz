import { motion } from "framer-motion"
import { MapPin, ChevronRight, CropIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FieldCardProps {
  id: number | string
  name: string
  health: number
  area: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
  showDetails?: boolean
  moisture?: number
  temperature?: number
  ndvi?: number
  stress?: string
}

export function FieldCard({
  id,
  name,
  health,
  area,
  isSelected = false,
  onClick,
  className = "",
  showDetails = false,
  moisture,
  temperature,
  ndvi,
  stress
}: FieldCardProps) {
  // Health status color
  const healthColor =
    health >= 90 ? 'bg-health-excellent text-health-excellent' :
    health >= 75 ? 'bg-health-good text-health-good' :
    health >= 50 ? 'bg-health-moderate text-health-moderate' :
    health >= 25 ? 'bg-health-poor text-health-poor' :
    'bg-health-critical text-health-critical';

  return (
    <motion.div
      className={cn(
        "p-2 sm:p-3 rounded-md cursor-pointer border",
        "overflow-visible", // critical!
        isSelected
          ? "bg-primary/10 border-primary/30 shadow-md"
          : "bg-card hover:bg-muted/50 border-border/40",
        className
      )}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${name} with health score ${health}%`}
      aria-selected={isSelected}
      style={{ overflow: "visible" }} // React inline as backup
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className="font-medium text-xs sm:text-sm flex items-center gap-1 truncate max-w-[70%] break-words">
          <MapPin className="w-3 h-3 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{name}</span>
        </span>
        <Badge
          className={`text-xs ${healthColor.replace('text-', 'bg-opacity-20 text-')} border ${healthColor.replace('bg-', 'border-').replace('text-', '')}/30 flex-shrink-0`}
          aria-label={`Health score: ${health}%`}
        >
          {health}%
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 break-words">
          <CropIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" aria-hidden="true" />
          <span aria-label={`Field area: ${area}`}>{area}</span>
        </div>
        {onClick && (
          <div className="text-[10px] sm:text-xs text-primary flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            View <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
          </div>
        )}
      </div>

      <Progress
        value={health}
        className={cn("h-1 mt-1.5 sm:mt-2", healthColor.replace('text-', 'bg-'))}
        aria-label={`Health progress: ${health}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={health}
      />

      {showDetails && (
        <motion.div
          // Always allow content to be visible/scrollable!
          className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 overflow-y-auto max-h-[180px] overflow-visible"
          style={{ overflow: "visible" }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {moisture !== undefined && (
            <div className="bg-muted/30 p-1.5 sm:p-2 rounded-md break-words">
              <span className="text-[10px] sm:text-xs text-muted-foreground block">Moisture</span>
              <span className="text-xs sm:text-sm font-medium">{moisture}%</span>
            </div>
          )}
          {temperature !== undefined && (
            <div className="bg-muted/30 p-1.5 sm:p-2 rounded-md break-words">
              <span className="text-[10px] sm:text-xs text-muted-foreground block">Temperature</span>
              <span className="text-xs sm:text-sm font-medium">{temperature}°C</span>
            </div>
          )}
          {ndvi !== undefined && (
            <div className="bg-muted/30 p-1.5 sm:p-2 rounded-md break-words">
              <span className="text-[10px] sm:text-xs text-muted-foreground block">NDVI</span>
              <span className="text-xs sm:text-sm font-medium">{ndvi}</span>
            </div>
          )}
          {stress !== undefined && (
            <div className="bg-muted/30 p-1.5 sm:p-2 rounded-md break-words">
              <span className="text-[10px] sm:text-xs text-muted-foreground block">Stress Level</span>
              <span className="text-xs sm:text-sm font-medium">{stress}</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

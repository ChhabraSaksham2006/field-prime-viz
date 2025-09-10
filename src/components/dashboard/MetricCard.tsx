import { motion } from "framer-motion"
import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon: LucideIcon
  iconColor: string
  trend?: number[]
  delay?: number
  className?: string
  description?: string
  status?: 'normal' | 'warning' | 'critical' | 'success'
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  trend = [],
  delay = 0,
  className = "",
  description,
  status = 'normal',
  onClick
}: MetricCardProps) {
  const isPositiveChange = change?.type === 'increase'
  const changeColor = isPositiveChange ? 'text-health-excellent' : 'text-destructive'
  const changeSymbol = isPositiveChange ? '+' : '-'
  
  const statusColors = {
    normal: '',
    warning: 'border-l-4 border-l-health-moderate',
    critical: 'border-l-4 border-l-health-critical',
    success: 'border-l-4 border-l-health-excellent'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -4, 
        boxShadow: "var(--shadow-strong)",
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className={cn(
        "metric-card group relative overflow-hidden", 
        statusColors[status],
        onClick && "cursor-pointer",
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${title}` : undefined}
    >
      {/* Status indicator */}
      {status !== 'normal' && (
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    status === 'warning' && "bg-health-moderate animate-pulse",
                    status === 'critical' && "bg-health-critical animate-pulse",
                    status === 'success' && "bg-health-excellent"
                  )}
                  aria-label={`Status: ${status}`}
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
            <Icon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <motion.div 
          className="text-3xl font-bold text-foreground flex items-center gap-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >
          {value}
          {change && (
            <motion.div 
              className={cn(
                "flex items-center justify-center rounded-full w-6 h-6 text-white text-xs",
                isPositiveChange ? "bg-health-excellent" : "bg-destructive"
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.4, duration: 0.3 }}
            >
              {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </motion.div>
          )}
        </motion.div>

        {change && (
          <motion.div 
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
          >
            <span className={`font-medium ${changeColor} flex items-center gap-1`}>
              {changeSymbol}{Math.abs(change.value)}%
              {isPositiveChange ? 
                <TrendingUp className="w-3 h-3" /> : 
                <TrendingDown className="w-3 h-3" />}
            </span>
            <span className="text-muted-foreground">
              from {change.period}
            </span>
          </motion.div>
        )}

        {trend.length > 0 && (
          <motion.div 
            className="mt-4 h-16 flex items-end gap-1 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.5 }}
          >
            {/* Baseline */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border opacity-50"></div>
            
            {trend.map((height, index) => {
              const isLast = index === trend.length - 1;
              const isIncreasing = index > 0 && trend[index] > trend[index - 1];
              const isDecreasing = index > 0 && trend[index] < trend[index - 1];
              
              return (
                <motion.div
                  key={index}
                  className={cn(
                    "flex-1 rounded-t-sm min-h-[4px] relative group",
                    isIncreasing ? "bg-health-excellent/60" : 
                    isDecreasing ? "bg-destructive/60" : 
                    "bg-primary/20"
                  )}
                  style={{ height: `${Math.max(height, 10)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 10)}%` }}
                  transition={{ 
                    delay: delay + 0.5 + (index * 0.05), 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  {isLast && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary hidden group-hover:block"></div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
        
        {onClick && (
          <div className="mt-4 flex justify-end">
            <motion.div 
              className="text-xs text-primary flex items-center gap-1 opacity-70 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: delay + 0.6 }}
            >
              View details <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
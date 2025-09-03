import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

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
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  trend = [],
  delay = 0,
  className = ""
}: MetricCardProps) {
  const changeColor = change?.type === 'increase' ? 'text-health-excellent' : 'text-destructive'
  const changeSymbol = change?.type === 'increase' ? '+' : '-'

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
      className={`metric-card group ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <motion.div 
          className="text-3xl font-bold text-foreground"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >
          {value}
        </motion.div>

        {change && (
          <motion.div 
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
          >
            <span className={`font-medium ${changeColor}`}>
              {changeSymbol}{Math.abs(change.value)}%
            </span>
            <span className="text-muted-foreground">
              from {change.period}
            </span>
          </motion.div>
        )}

        {trend.length > 0 && (
          <motion.div 
            className="mt-4 h-16 flex items-end gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.5 }}
          >
            {trend.map((height, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-primary/20 rounded-t-sm min-h-[4px]"
                style={{ height: `${Math.max(height, 10)}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 10)}%` }}
                transition={{ 
                  delay: delay + 0.5 + (index * 0.05), 
                  duration: 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
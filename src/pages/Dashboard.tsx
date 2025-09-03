import { motion } from "framer-motion"
import { 
  Leaf, 
  Droplets, 
  Thermometer, 
  Sun,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const Dashboard = () => {
  // Mock data for the charts
  const healthData = [
    { name: 'Jan', health: 85, yield: 120 },
    { name: 'Feb', health: 88, yield: 125 },
    { name: 'Mar', health: 92, yield: 135 },
    { name: 'Apr', health: 89, yield: 130 },
    { name: 'May', health: 94, yield: 145 },
    { name: 'Jun', health: 91, yield: 140 },
  ]

  const cropDistribution = [
    { name: 'Healthy', value: 78, color: 'hsl(var(--health-excellent))' },
    { name: 'Good', value: 15, color: 'hsl(var(--health-good))' },
    { name: 'Moderate', value: 5, color: 'hsl(var(--health-moderate))' },
    { name: 'Critical', value: 2, color: 'hsl(var(--health-critical))' },
  ]

  const alerts = [
    { id: 1, type: 'warning', field: 'North Field A', message: 'Moisture levels below optimal', time: '2 hours ago' },
    { id: 2, type: 'success', field: 'South Field C', message: 'Harvest ready - optimal conditions', time: '4 hours ago' },
    { id: 3, type: 'info', field: 'East Field B', message: 'Spectral analysis complete', time: '6 hours ago' },
  ]

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Agricultural Dashboard</h1>
          <p className="text-lg text-muted-foreground">Smart India Hackathon 2025 - Precision Agriculture Platform</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex gap-2 mt-4 sm:mt-0"
        >
          <Button className="bg-gradient-primary shadow-glow">Generate Report</Button>
          <Button variant="outline">Export Data</Button>
        </motion.div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Crop Health Index"
          value="94.2%"
          change={{ value: 5.2, type: 'increase', period: 'last week' }}
          icon={Leaf}
          iconColor="bg-health-excellent"
          trend={[65, 72, 78, 85, 88, 92, 94]}
          delay={0.1}
        />
        <MetricCard
          title="Soil Moisture"
          value="68%"
          change={{ value: 2.1, type: 'decrease', period: 'last week' }}
          icon={Droplets}
          iconColor="bg-tech-primary"
          trend={[70, 69, 71, 68, 65, 67, 68]}
          delay={0.2}
        />
        <MetricCard
          title="Temperature"
          value="24.5°C"
          change={{ value: 1.8, type: 'increase', period: 'yesterday' }}
          icon={Thermometer}
          iconColor="bg-health-moderate"
          trend={[22, 23, 24, 25, 24, 23, 25]}
          delay={0.3}
        />
        <MetricCard
          title="UV Index"
          value="7.2"
          change={{ value: 0.5, type: 'increase', period: 'today' }}
          icon={Sun}
          iconColor="bg-health-poor"
          trend={[6, 6.5, 7, 7.5, 7.2, 7.1, 7.2]}
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="viz-container h-96">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Crop Health & Yield Trends
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-health-excellent/10 text-health-excellent">Health Index</Badge>
                <Badge variant="outline" className="bg-tech-primary/10 text-tech-primary">Predicted Yield</Badge>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  stroke="hsl(var(--health-excellent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--health-excellent))', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="hsl(var(--tech-primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--tech-primary))', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="viz-container h-96">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Field Health Distribution
            </h3>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {cropDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Alerts and Field Status */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="viz-container">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Field Alerts & Status
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + (alert.id * 0.1) }}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/60"
              >
                <div className={`w-2 h-2 rounded-full ${
                  alert.type === 'warning' ? 'bg-health-poor' :
                  alert.type === 'success' ? 'bg-health-excellent' : 'bg-tech-primary'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.field}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        alert.type === 'warning' ? 'bg-health-poor/10 text-health-poor border-health-poor/20' :
                        alert.type === 'success' ? 'bg-health-excellent/10 text-health-excellent border-health-excellent/20' :
                        'bg-tech-primary/10 text-tech-primary border-tech-primary/20'
                      }`}
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {alert.time}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard
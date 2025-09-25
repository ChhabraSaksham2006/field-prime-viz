import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Play, Pause, RotateCcw, Download, Settings, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { useSpectralSignature } from "@/hooks/use-api"
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
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts'

// Generate realistic spectral signature data
const generateSpectralData = (timestamp: number, cropType: string) => {
  const baselineData = {
    wheat: { red: 0.15, nir: 0.45, swir: 0.25 },
    corn: { red: 0.12, nir: 0.52, swir: 0.22 },
    soybean: { red: 0.18, nir: 0.48, swir: 0.28 }
  }[cropType] || { red: 0.15, nir: 0.45, swir: 0.25 }

  const data = []
  for (let wavelength = 400; wavelength <= 2400; wavelength += 10) {
    let reflectance = 0.1

    // Visible spectrum (400-700nm)
    if (wavelength < 700) {
      if (wavelength < 500) {
        reflectance = 0.08 + Math.random() * 0.02 // Blue
      } else if (wavelength < 600) {
        reflectance = 0.06 + Math.random() * 0.02 // Green
      } else {
        reflectance = baselineData.red + Math.random() * 0.03 // Red
      }
    }
    // Near-infrared (700-1300nm)
    else if (wavelength < 1300) {
      reflectance = baselineData.nir + Math.sin((wavelength - 700) * 0.01) * 0.1 + Math.random() * 0.05
    }
    // Short-wave infrared (1300-2400nm)
    else {
      reflectance = baselineData.swir + Math.cos((wavelength - 1300) * 0.005) * 0.08 + Math.random() * 0.03
    }

    // Add time-based variations for health changes
    const healthVariation = Math.sin(timestamp * 0.001) * 0.02
    reflectance += healthVariation

    data.push({
      wavelength,
      reflectance: Math.max(0, Math.min(1, reflectance)),
      timestamp
    })
  }
  return data
}

// Generate NDVI time series data
const generateNDVITimeSeries = () => {
  const data = []
  const now = Date.now()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now - (29 - i) * 24 * 60 * 60 * 1000)
    const baseNDVI = 0.7 + Math.sin(i * 0.2) * 0.15
    const noise = (Math.random() - 0.5) * 0.05
    
    data.push({
      date: date.toISOString().split('T')[0],
      ndvi: Math.max(0.2, Math.min(0.9, baseNDVI + noise)),
      gndvi: Math.max(0.2, Math.min(0.8, baseNDVI * 0.9 + noise)),
      evi: Math.max(0.1, Math.min(0.7, baseNDVI * 0.8 + noise))
    })
  }
  return data
}

// Generate real-time spectral bands data
const generateBandData = () => [
  { band: 'Blue (450nm)', value: 0.08, health: 'good', change: 2.1 },
  { band: 'Green (550nm)', value: 0.12, health: 'excellent', change: 1.8 },
  { band: 'Red (680nm)', value: 0.15, health: 'good', change: -0.3 },
  { band: 'NIR (850nm)', value: 0.48, health: 'excellent', change: 3.2 },
  { band: 'SWIR1 (1650nm)', value: 0.25, health: 'moderate', change: -1.1 },
  { band: 'SWIR2 (2200nm)', value: 0.18, health: 'good', change: 0.8 }
]

const SpectralAnalysis = () => {
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [cropType, setCropType] = useState("wheat")
  const [samplingRate, setSamplingRate] = useState([1000])
  const [smoothing, setSmoothing] = useState([5])
  const [showReference, setShowReference] = useState(true)
  const [spectralData, setSpectralData] = useState(() => generateSpectralData(Date.now(), "wheat"))
  const [ndviData] = useState(() => generateNDVITimeSeries())
  const [bandData] = useState(() => generateBandData())
  
  // Use API hook for spectral signature
  const { data: apiSpectralData, isLoading: isApiLoading, error: apiError, getSignature } = useSpectralSignature()
  
  // Combined spectral data (prefer live data, fallback to API data)
  const [combinedSpectralData, setCombinedSpectralData] = useState<any>(null)

  // Real-time data updates
  useEffect(() => {
    if (!isLiveMode) return

    const interval = setInterval(() => {
      const newTime = Date.now()
      setCurrentTime(newTime)
      setSpectralData(generateSpectralData(newTime, cropType))
    }, samplingRate[0])

    return () => clearInterval(interval)
  }, [isLiveMode, samplingRate, cropType])
  
  // Log API data when it's loaded
  useEffect(() => {
    if (apiSpectralData) {
      console.log('API spectral data loaded:', apiSpectralData);
    }
    if (apiError) {
      console.error('API spectral error:', apiError);
    }
  }, [apiSpectralData, apiError])
  
  // Fetch spectral signature data from API when component mounts or crop type changes
  useEffect(() => {
    // Use center coordinates as default and pass crop type
    getSignature(50, 50);
  }, [cropType])
  
  // Combine spectral data from live updates and API
  useEffect(() => {
    if (spectralData) {
      setCombinedSpectralData(spectralData);
    } else if (apiSpectralData && apiSpectralData.spectral_signature) {
      // Transform API spectral data to match the format of live data
      const transformedData = apiSpectralData.spectral_signature.map((value: number, index: number) => ({
        wavelength: 400 + index * 10,
        reflectance: value,
        timestamp: Date.now()
      }));
      setCombinedSpectralData(transformedData);
    }
  }, [spectralData, apiSpectralData])

  const calculateVegetationIndices = (data: any[]) => {
    const red = data.find(d => d.wavelength === 680)?.reflectance || 0.15
    const nir = data.find(d => d.wavelength === 850)?.reflectance || 0.48
    const green = data.find(d => d.wavelength === 550)?.reflectance || 0.12
    
    const ndvi = (nir - red) / (nir + red)
    const gndvi = (nir - green) / (nir + green)
    const evi = 2.5 * ((nir - red) / (nir + 6 * red - 7.5 * data.find(d => d.wavelength === 450)?.reflectance + 1))
    
    return { ndvi, gndvi, evi }
  }

  const indices = calculateVegetationIndices(spectralData)

  const getHealthColor = (value: number, type: string) => {
    if (type === 'ndvi') {
      if (value > 0.7) return 'text-health-excellent'
      if (value > 0.5) return 'text-health-good'
      if (value > 0.3) return 'text-health-moderate'
      return 'text-health-poor'
    }
    return 'text-foreground'
  }

  const getBandHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20'
      case 'good': return 'bg-health-good/10 text-health-good border-health-good/20'
      case 'moderate': return 'bg-health-moderate/10 text-health-moderate border-health-moderate/20'
      case 'poor': return 'bg-health-poor/10 text-health-poor border-health-poor/20'
      default: return 'bg-muted/10 text-muted-foreground border-muted/20'
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary mb-1 sm:mb-2">Real-time Spectral Analysis</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Live hyperspectral signature monitoring and vegetation indices</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mt-3 lg:mt-0"
        >
          <Button
            variant="outline"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 ${isLiveMode ? "bg-health-excellent/10 border-health-excellent/20" : ""}`}
          >
            {isLiveMode ? <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />}
            <span className="truncate">{isLiveMode ? "Pause" : "Start"} Live Mode</span>
          </Button>
          <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Export Data</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Real-time Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-card/50 rounded-lg border border-border/60"
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-health-excellent animate-pulse' : 'bg-muted'}`}></div>
          <span className="text-sm font-medium">
            {isLiveMode ? "Live Data Stream" : "Paused"}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Last Update: {new Date(currentTime).toLocaleTimeString()}
        </div>
        <div className="text-sm text-muted-foreground">
          Sampling Rate: {samplingRate[0]}ms
        </div>
        <Badge variant="outline" className="bg-tech-primary/10 text-tech-primary border-tech-primary/20">
          {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
        </Badge>
      </motion.div>

      {/* Vegetation Indices Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {Object.entries(indices).map(([key, value], index) => (
          <Card key={key} className="metric-card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-xs sm:text-sm uppercase tracking-wide truncate">
                  {key.toUpperCase()}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {key === 'ndvi' ? 'Normalized Difference Vegetation Index' :
                   key === 'gndvi' ? 'Green NDVI' : 'Enhanced Vegetation Index'}
                </p>
              </div>
            </div>
            <motion.div 
              className={`text-xl sm:text-2xl font-bold ${getHealthColor(value as number, key)}`}
              animate={{ scale: isLiveMode ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: isLiveMode ? Infinity : 0 }}
            >
              {(value as number).toFixed(3)}
            </motion.div>
            <div className="mt-2 h-1.5 sm:h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, (value as number) * 100))}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Spectral Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3"
        >
          <Card className="viz-container p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h3 className="text-lg sm:text-xl font-semibold truncate">Live Spectral Signature</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={isLiveMode ? "bg-health-excellent/10 text-health-excellent border-health-excellent/20" : "bg-muted/10"}>
                  {isLiveMode ? "Streaming" : "Offline"}
                </Badge>
                <Badge variant="outline" className={isApiLoading ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                  apiSpectralData ? "bg-health-excellent/10 text-health-excellent border-health-excellent/20" : 
                  apiError ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted/10"}>
                  {isApiLoading ? "API Loading" : 
                   apiSpectralData ? "API Ready" : 
                   apiError ? "API Error" : "API Idle"}
                </Badge>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => getSignature(50, 50)}>
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedSpectralData || spectralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="wavelength" 
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Reflectance', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [(value as number).toFixed(4), 'Reflectance']}
                />
                
                {/* Reference lines for important bands */}
                {showReference && (
                  <>
                    <ReferenceLine x={680} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                    <ReferenceLine x={850} stroke="hsl(var(--health-excellent))" strokeDasharray="5 5" />
                  </>
                )}
                
                <Line 
                  type="monotone" 
                  dataKey="reflectance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={isLiveMode}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* NDVI Time Series */}
          <Card className="viz-container mt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              30-Day Vegetation Index Trends
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={ndviData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  stackId="1"
                  stroke="hsl(var(--health-excellent))"
                  fill="hsl(var(--health-excellent) / 0.3)"
                  name="NDVI"
                />
                <Area
                  type="monotone"
                  dataKey="gndvi"
                  stackId="1"
                  stroke="hsl(var(--health-good))"
                  fill="hsl(var(--health-good) / 0.3)"
                  name="GNDVI"
                />
                <Area
                  type="monotone"
                  dataKey="evi"
                  stackId="1"
                  stroke="hsl(var(--tech-primary))"
                  fill="hsl(var(--tech-primary) / 0.3)"
                  name="EVI"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Controls and Band Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Analysis Controls */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Analysis Controls
            </h3>
            
            <div className="space-y-4">
              {/* Crop Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="soybean">Soybean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sampling Rate */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Sampling Rate: {samplingRate[0]}ms
                </Label>
                <Slider
                  value={samplingRate}
                  onValueChange={setSamplingRate}
                  max={5000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Smoothing */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Smoothing: {smoothing[0]}
                </Label>
                <Slider
                  value={smoothing}
                  onValueChange={setSmoothing}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Toggle Controls */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="reference"
                  checked={showReference}
                  onCheckedChange={setShowReference}
                />
                <Label htmlFor="reference">Show Reference Lines</Label>
              </div>
            </div>
          </Card>

          {/* Spectral Bands */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Spectral Bands
            </h3>
            
            <div className="space-y-3">
              {bandData.map((band, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/20 border border-border/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{band.band}</span>
                    <Badge variant="outline" className={getBandHealthColor(band.health)}>
                      {band.health}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{band.value.toFixed(3)}</span>
                    <span className={`text-sm ${band.change >= 0 ? 'text-health-excellent' : 'text-health-poor'}`}>
                      {band.change >= 0 ? '+' : ''}{band.change}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${band.value * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Analysis Summary */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overall Health</span>
                <Badge variant="outline" className="bg-health-excellent/10 text-health-excellent border-health-excellent/20">
                  Excellent
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chlorophyll Content</span>
                <span className="font-medium">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Water Stress</span>
                <span className="font-medium text-health-excellent">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disease Risk</span>
                <span className="font-medium text-health-good">Minimal</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SpectralAnalysis
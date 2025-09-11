import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Map, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw,
  Download, 
  Filter, 
  Satellite, 
  Settings2, 
  Plus, 
  Minus, 
  Tag, 
  Activity, 
  MapPin, 
  ChevronRight, 
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FieldCard } from "@/components/dashboard/FieldCard"
// TODO: Implement socket hook
// For now, return mock data structure
const usePredictionMap = () => {
  return {
    data: null,
    isConnected: false
  }
}
import { useApiData } from "@/hooks/use-api"

// Mock field data with health indices
const fieldData = [
  { id: 1, name: "North Field A", health: 92, area: "15.2 ha", coords: [0, 0], color: "#22c55e", moisture: 78, temperature: 24, ndvi: 0.85, stress: "Low" },
  { id: 2, name: "North Field B", health: 78, area: "18.7 ha", coords: [100, 50], color: "#84cc16", moisture: 65, temperature: 26, ndvi: 0.72, stress: "Low" },
  { id: 3, name: "South Field C", health: 65, area: "22.1 ha", coords: [200, 150], color: "#eab308", moisture: 52, temperature: 28, ndvi: 0.61, stress: "Moderate" },
  { id: 4, name: "East Field D", health: 45, area: "12.8 ha", coords: [300, 100], color: "#f97316", moisture: 38, temperature: 31, ndvi: 0.48, stress: "High" },
  { id: 5, name: "West Field E", health: 38, area: "19.5 ha", coords: [50, 200], color: "#ef4444", moisture: 30, temperature: 33, ndvi: 0.41, stress: "Critical" },
]

// Helper function to convert prediction values to colors
const getColorForPrediction = (value: number): string => {
  // Define colors for different prediction classes
  const colors = [
    '#22c55e', // Healthy - Green
    '#84cc16', // Slightly Stressed - Light Green
    '#eab308', // Moderately Stressed - Yellow
    '#f97316', // Highly Stressed - Orange
    '#ef4444'  // Critical - Red
  ]
  
  // Ensure the value is within bounds
  const index = Math.min(Math.max(0, value), colors.length - 1)
  return colors[index]
}

const HealthMap = () => {
  const [selectedField, setSelectedField] = useState<typeof fieldData[0] | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [mapLayer, setMapLayer] = useState("satellite")
  const [healthFilter, setHealthFilter] = useState(0)
  const [zoom, setZoom] = useState(5)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Use real-time prediction map data from socket
  const { data: predictionData, isConnected } = usePredictionMap()
  
  // Use API data for prediction map
  const { data: apiData, isLoading: isApiLoading, error: apiError } = useApiData()
  
  // Combined prediction data (prefer socket data, fallback to API data)
  const [combinedPredictionData, setCombinedPredictionData] = useState<any>(null)
  
  // Log API data when it's loaded
  useEffect(() => {
    if (apiData) {
      console.log('API data loaded for HealthMap:', apiData);
    }
    if (apiError) {
      console.error('API error in HealthMap:', apiError);
    }
  }, [apiData, apiError])
  
  // Combine prediction data from socket and API
  useEffect(() => {
    if (predictionData) {
      setCombinedPredictionData(predictionData);
    } else if (apiData) {
      setCombinedPredictionData(apiData);
    }
  }, [predictionData, apiData])

  // Generate heatmap visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 800;
    const height = canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Generate health heatmap
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Check if we have prediction data (from either socket or API)
     if (combinedPredictionData && combinedPredictionData.prediction_map && combinedPredictionData.prediction_map.length > 0) {
       // Determine the dimensions of the prediction map (assuming it's square)
       const mapSize = Math.sqrt(combinedPredictionData.prediction_map.length);
      const cellWidth = width / mapSize;
      const cellHeight = height / mapSize;
      
      // Draw the prediction map
      for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
          const predictionValue = combinedPredictionData.prediction_map[y * mapSize + x];
          const color = getColorForPrediction(predictionValue);
          
          // Fill the cell with the appropriate color
          ctx.fillStyle = color;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    } else {
      // Fallback to the original visualization if no prediction data
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;

          // Calculate distance-based health from field centers
          let maxHealth = 0;
          fieldData.forEach(field => {
            const dx = x - (field.coords[0] + 100);
            const dy = y - (field.coords[1] + 100);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - distance / 100);
            maxHealth = Math.max(maxHealth, field.health * influence);
          });

          // Convert health to color
          const normalizedHealth = maxHealth / 100;
          if (normalizedHealth > 0.8) {
            data[index] = 34;      // Green (healthy)
            data[index + 1] = 197;
            data[index + 2] = 94;
          } else if (normalizedHealth > 0.6) {
            data[index] = 132;     // Yellow-green
            data[index + 1] = 204;
            data[index + 2] = 22;
          } else if (normalizedHealth > 0.4) {
            data[index] = 234;     // Yellow
            data[index + 1] = 179;
            data[index + 2] = 8;
          } else if (normalizedHealth > 0.2) {
            data[index] = 249;     // Orange
            data[index + 1] = 115;
            data[index + 2] = 22;
          } else {
            data[index] = 239;     // Red (unhealthy)
            data[index + 1] = 68;
            data[index + 2] = 68;
          }
          data[index + 3] = Math.floor(normalizedHealth * 128 + 32); // Alpha
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw field boundaries and labels
    fieldData.forEach(field => {
      if (field.health >= healthFilter[0] && field.health <= healthFilter[1]) {
        const x = field.coords[0] + 100;
        const y = field.coords[1] + 100;

        // Draw field boundary
        ctx.strokeStyle = field.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 40, y - 30, 80, 60);

        // Draw field marker
        ctx.fillStyle = field.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw labels if enabled
        if (showLabels) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(field.name, x, y - 40);
          ctx.fillText(`${field.health}%`, x, y + 50);
        }
      }
    });

  }, [zoom, showLabels, healthFilter, combinedPredictionData]);

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-health-excellent'
    if (health >= 70) return 'text-health-good'
    if (health >= 55) return 'text-health-moderate'
    if (health >= 40) return 'text-health-poor'
    return 'text-health-critical'
  }

  const getHealthBadgeClass = (health: number) => {
    if (health >= 85) return 'bg-health-excellent/10 text-health-excellent border-health-excellent/20'
    if (health >= 70) return 'bg-health-good/10 text-health-good border-health-good/20'
    if (health >= 55) return 'bg-health-moderate/10 text-health-moderate border-health-moderate/20'
    if (health >= 40) return 'bg-health-poor/10 text-health-poor border-health-poor/20'
    return 'bg-health-critical/10 text-health-critical border-health-critical/20'
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
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Interactive Health Map</h1>
          <p className="text-lg text-muted-foreground">Real-time crop health visualization with zoom and pan capabilities</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mt-4 lg:mt-0"
        >
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Map
          </Button>
          <Button className="bg-gradient-primary">
            <Satellite className="w-4 h-4 mr-2" />
            Satellite View
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Map Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="viz-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Field Health Heatmap</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Zoom in"
                  onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
                >
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Zoom out"
                  onClick={() => setZoom(prev => Math.max(prev - 10, 10))}
                >
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Rotate counterclockwise"
                  onClick={() => setRotation(prev => prev - 15)}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Interactive Canvas Map */}
            <div className="relative bg-muted/20 rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 800
                  const y = ((e.clientY - rect.top) / rect.height) * 600
                  
                  // Find closest field
                  let closestField = null
                  let minDistance = Infinity
                  
                  fieldData.forEach(field => {
                    const fieldX = field.coords[0] + 100
                    const fieldY = field.coords[1] + 100
                    const distance = Math.sqrt((x - fieldX) ** 2 + (y - fieldY) ** 2)
                    
                    if (distance < 50 && distance < minDistance) {
                      minDistance = distance
                      closestField = field
                    }
                  })
                  
                  setSelectedField(closestField)
                }}
              />
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2">Health Index</h4>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-health-critical rounded"></div>
                  <span>Critical</span>
                  <div className="w-4 h-4 bg-health-poor rounded ml-2"></div>
                  <span>Poor</span>
                  <div className="w-4 h-4 bg-health-moderate rounded ml-2"></div>
                  <span>Moderate</span>
                  <div className="w-4 h-4 bg-health-good rounded ml-2"></div>
                  <span>Good</span>
                  <div className="w-4 h-4 bg-health-excellent rounded ml-2"></div>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Coordinates and Connection Status */}
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur rounded-lg px-3 py-2 text-sm space-y-1">
                <div>Zoom: {zoom}%</div>
                <div className="flex items-center gap-2">
                  <span>Socket:</span>
                  {isConnected ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs py-0 h-5">
                      <CheckCircle className="w-3 h-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs py-0 h-5">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Disconnected
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>API:</span>
                  {isApiLoading ? (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs py-0 h-5">
                      <TrendingUp className="w-3 h-3 mr-1" /> Loading
                    </Badge>
                  ) : apiData ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs py-0 h-5">
                      <CheckCircle className="w-3 h-3 mr-1" /> Loaded
                    </Badge>
                  ) : apiError ? (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs py-0 h-5">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Error
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs py-0 h-5">
                      Idle
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Controls and Field Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Map Controls */}
          <Card className="viz-container p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Map Controls
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Layer Selection */}
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Map Layer</Label>
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite" className="text-xs sm:text-sm">Satellite</SelectItem>
                    <SelectItem value="terrain" className="text-xs sm:text-sm">Terrain</SelectItem>
                    <SelectItem value="hybrid" className="text-xs sm:text-sm">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zoom Control */}
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Zoom Level: {zoom}%</Label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  max={200}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Health Filter */}
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">
                  Health Filter: {healthFilter}%
                </Label>
                <Slider
                  value={[healthFilter]}
                  onValueChange={(value) => setHealthFilter(value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Show Labels Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="labels"
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                  className="scale-90 sm:scale-100"
                />
                <Label htmlFor="labels" className="text-xs sm:text-sm">Show Field Labels</Label>
              </div>
            </div>
          </Card>

          {/* Selected Field Info */}
          {selectedField && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="viz-container p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Field Details
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <FieldCard
                    id={selectedField.id}
                    name={selectedField.name}
                    health={selectedField.health}
                    area={selectedField.area}
                    isSelected={true}
                    showDetails={true}
                    moisture={selectedField.moisture}
                    temperature={selectedField.temperature}
                    ndvi={selectedField.ndvi}
                    stress={selectedField.stress}
                    className="border-primary/30 bg-primary/5"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" className="w-full bg-gradient-primary text-xs sm:text-sm py-1 h-8 sm:h-9">
                      <LineChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">View Detailed Analysis</span>
                    </Button>
                    <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm py-1 h-8 sm:h-9">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">View History</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Field List */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Field Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {fieldData.map((field) => (
                <FieldCard
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  health={field.health}
                  area={field.area}
                  isSelected={selectedField?.id === field.id}
                  onClick={() => setSelectedField(field)}
                  showDetails={selectedField?.id === field.id}
                  moisture={field.moisture}
                  temperature={field.temperature}
                  ndvi={field.ndvi}
                  stress={field.stress}
                />
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Field Health Distribution - Added to match Dashboard layout */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="viz-container p-3 sm:p-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Field Health Distribution
            </h3>
            <div className="flex justify-center items-center h-[200px] sm:h-[250px]">
              <div className="w-full max-w-[250px] aspect-square relative">
                {/* Placeholder for pie chart - in a real app, you would use a chart component */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-health-excellent via-health-good to-health-poor flex items-center justify-center">
                  <div className="bg-card rounded-full w-[60%] h-[60%] flex items-center justify-center text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold">78%</div>
                      <div className="text-xs text-muted-foreground">Healthy Fields</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-health-excellent rounded-full"></div>
                <span className="text-xs">Excellent (40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-health-good rounded-full"></div>
                <span className="text-xs">Good (38%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-health-moderate rounded-full"></div>
                <span className="text-xs">Moderate (12%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-health-poor rounded-full"></div>
                <span className="text-xs">Poor (10%)</span>
              </div>
            </div>
          </Card>
          
          {/* Field Alerts & Status - Added to match Dashboard layout */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 md:mt-6"
          >
            <Card className="viz-container p-3 sm:p-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Field Alerts & Status
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {fieldData.slice(0, 3).map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Alert for ${field.name}`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse flex-shrink-0 ${
                      field.health > 80 ? 'bg-health-excellent' :
                      field.health > 60 ? 'bg-health-good' :
                      field.health > 40 ? 'bg-health-moderate' : 'bg-health-poor'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-sm sm:text-base truncate">{field.name}</span>
                        <Badge 
                          variant="outline" 
                          className={getHealthBadgeClass(field.health)}
                        >
                          {field.health > 80 ? <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> :
                           field.health > 40 ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> :
                           <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />}
                          {field.health > 80 ? 'Healthy' :
                           field.health > 60 ? 'Good' :
                           field.health > 40 ? 'Warning' : 'Critical'}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {field.health > 80 ? 'All parameters within optimal range' :
                         field.health > 60 ? 'Minor variations in soil moisture' :
                         field.health > 40 ? 'Moderate stress detected' : 'Critical conditions detected'}
                      </p>
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      Now
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HealthMap
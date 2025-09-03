import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Map, Layers, ZoomIn, ZoomOut, RotateCcw, Download, Filter, Satellite } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"

// Mock field data with health indices
const fieldData = [
  { id: 1, name: "North Field A", health: 92, area: "15.2 ha", coords: [0, 0], color: "#22c55e" },
  { id: 2, name: "North Field B", health: 78, area: "18.7 ha", coords: [100, 50], color: "#84cc16" },
  { id: 3, name: "South Field C", health: 65, area: "22.1 ha", coords: [200, 150], color: "#eab308" },
  { id: 4, name: "East Field D", health: 45, area: "12.8 ha", coords: [300, 100], color: "#f97316" },
  { id: 5, name: "West Field E", health: 38, area: "19.5 ha", coords: [50, 200], color: "#ef4444" },
]

const HealthMap = () => {
  const [selectedField, setSelectedField] = useState<typeof fieldData[0] | null>(null)
  const [zoomLevel, setZoomLevel] = useState([50])
  const [showLabels, setShowLabels] = useState(true)
  const [mapLayer, setMapLayer] = useState("satellite")
  const [healthFilter, setHealthFilter] = useState([0, 100])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate heatmap visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width = 800
    const height = canvas.height = 600

    // Clear canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, height)

    // Draw grid background
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i <= height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Generate health heatmap
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4

        // Calculate distance-based health from field centers
        let maxHealth = 0
        fieldData.forEach(field => {
          const dx = x - (field.coords[0] + 100)
          const dy = y - (field.coords[1] + 100)
          const distance = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - distance / 100)
          maxHealth = Math.max(maxHealth, field.health * influence)
        })

        // Convert health to color
        const normalizedHealth = maxHealth / 100
        if (normalizedHealth > 0.8) {
          data[index] = 34      // Green (healthy)
          data[index + 1] = 197
          data[index + 2] = 94
        } else if (normalizedHealth > 0.6) {
          data[index] = 132     // Yellow-green
          data[index + 1] = 204
          data[index + 2] = 22
        } else if (normalizedHealth > 0.4) {
          data[index] = 234     // Yellow
          data[index + 1] = 179
          data[index + 2] = 8
        } else if (normalizedHealth > 0.2) {
          data[index] = 249     // Orange
          data[index + 1] = 115
          data[index + 2] = 22
        } else {
          data[index] = 239     // Red (unhealthy)
          data[index + 1] = 68
          data[index + 2] = 68
        }
        data[index + 3] = Math.floor(normalizedHealth * 128 + 32) // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Draw field boundaries and labels
    fieldData.forEach(field => {
      if (field.health >= healthFilter[0] && field.health <= healthFilter[1]) {
        const x = field.coords[0] + 100
        const y = field.coords[1] + 100

        // Draw field boundary
        ctx.strokeStyle = field.color
        ctx.lineWidth = 2
        ctx.strokeRect(x - 40, y - 30, 80, 60)

        // Draw field marker
        ctx.fillStyle = field.color
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.fill()

        // Draw labels if enabled
        if (showLabels) {
          ctx.fillStyle = '#ffffff'
          ctx.font = '12px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(field.name, x, y - 40)
          ctx.fillText(`${field.health}%`, x, y + 50)
        }
      }
    })

  }, [zoomLevel, showLabels, healthFilter])

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-health-excellent'
    if (health >= 70) return 'text-health-good'
    if (health >= 55) return 'text-health-moderate'
    if (health >= 40) return 'text-health-poor'
    return 'text-health-critical'
  }

  const getHealthBadge = (health: number) => {
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3"
        >
          <Card className="viz-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Field Health Heatmap</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Interactive Canvas Map */}
            <div className="relative bg-muted/20 rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-[500px] cursor-grab active:cursor-grabbing"
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

              {/* Coordinates */}
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur rounded-lg px-3 py-2 text-sm">
                Zoom: {zoomLevel[0]}%
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
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Map Controls
            </h3>
            
            <div className="space-y-4">
              {/* Layer Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Map Layer</Label>
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zoom Control */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Zoom Level: {zoomLevel[0]}%</Label>
                <Slider
                  value={zoomLevel}
                  onValueChange={setZoomLevel}
                  max={200}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Health Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Health Filter: {healthFilter[0]}% - {healthFilter[1]}%
                </Label>
                <Slider
                  value={healthFilter}
                  onValueChange={setHealthFilter}
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
                />
                <Label htmlFor="labels">Show Field Labels</Label>
              </div>
            </div>
          </Card>

          {/* Selected Field Info */}
          {selectedField && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="viz-container">
                <h3 className="text-lg font-semibold mb-4">Field Details</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{selectedField.name}</h4>
                    <p className="text-sm text-muted-foreground">Area: {selectedField.area}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Health Score:</span>
                    <Badge variant="outline" className={getHealthBadge(selectedField.health)}>
                      {selectedField.health}%
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">NDVI:</span>
                        <div className="font-medium">0.{Math.floor(selectedField.health * 0.8)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Moisture:</span>
                        <div className="font-medium">{Math.floor(selectedField.health * 0.7)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temperature:</span>
                        <div className="font-medium">{(24 + Math.random() * 6).toFixed(1)}°C</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stress Level:</span>
                        <div className={`font-medium ${getHealthColor(selectedField.health)}`}>
                          {selectedField.health > 70 ? 'Low' : selectedField.health > 40 ? 'Medium' : 'High'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-gradient-primary">
                    View Detailed Analysis
                  </Button>
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
            <div className="space-y-3">
              {fieldData.map((field) => (
                <motion.div
                  key={field.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedField?.id === field.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/60 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedField(field)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{field.name}</h4>
                      <p className="text-xs text-muted-foreground">{field.area}</p>
                    </div>
                    <Badge variant="outline" className={getHealthBadge(field.health)}>
                      {field.health}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default HealthMap
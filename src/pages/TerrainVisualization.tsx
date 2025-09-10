import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Box, Plane } from "@react-three/drei"
import { motion } from "framer-motion"
import { Mountain, RotateCcw, Download, Settings, Layers, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import * as THREE from "three"

// Terrain Component with height mapping
function TerrainMesh({ heightScale = 1, showWireframe = false, colorMode = "elevation" }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Generate heightmap data
  const generateHeightmap = () => {
    const size = 50
    const data = new Float32Array(size * size)
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = (i / size) * 8 - 4
        const z = (j / size) * 8 - 4
        
        // Generate realistic terrain with multiple octaves of noise
        let height = 0
        height += Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8
        height += Math.sin(x * 2) * Math.cos(z * 2) * 0.3
        height += Math.sin(x * 4) * Math.cos(z * 4) * 0.1
        height += Math.random() * 0.1 - 0.05
        
        data[i * size + j] = height * heightScale
      }
    }
    
    return { data, size }
  }

  const { data, size } = generateHeightmap()
  
  // Create geometry from heightmap
  const geometry = new THREE.PlaneGeometry(8, 8, size - 1, size - 1)
  const vertices = geometry.attributes.position.array as Float32Array
  
  for (let i = 0; i < vertices.length; i += 3) {
    const index = Math.floor(i / 3)
    vertices[i + 2] = data[index] // Set Z coordinate (height)
  }
  
  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()

  // Generate colors based on height or health
  const colors = new Float32Array((vertices.length / 3) * 3)
  for (let i = 0; i < vertices.length; i += 3) {
    const height = vertices[i + 2]
    const normalizedHeight = (height + 1) / 2
    
    let r, g, b
    
    if (colorMode === "elevation") {
      // Elevation-based coloring (blue to green to brown)
      if (normalizedHeight < 0.3) {
        r = 0.2; g = 0.4; b = 0.8 // Blue (low elevation)
      } else if (normalizedHeight < 0.6) {
        r = 0.2; g = 0.8; b = 0.2 // Green (medium elevation)
      } else {
        r = 0.6; g = 0.4; b = 0.2 // Brown (high elevation)
      }
    } else {
      // Health-based coloring (red to yellow to green)
      const healthIndex = 0.5 + normalizedHeight * 0.5 // Simulate health correlation
      if (healthIndex < 0.4) {
        r = 1; g = 0.2; b = 0.2 // Red (poor health)
      } else if (healthIndex < 0.7) {
        r = 1; g = 1; b = 0.2 // Yellow (moderate health)
      } else {
        r = 0.2; g = 1; b = 0.2 // Green (good health)
      }
    }
    
    const vertexIndex = i / 3
    colors[vertexIndex * 3] = r
    colors[vertexIndex * 3 + 1] = g
    colors[vertexIndex * 3 + 2] = b
  }
  
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.002
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshPhongMaterial
        vertexColors
        wireframe={showWireframe}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// Animated field markers
function FieldMarkers() {
  const markersRef = useRef<THREE.Group>(null!)
  
  const fields = [
    { name: "Field A", position: [2, 1, 2] as [number, number, number], health: 92, color: "#22c55e" },
    { name: "Field B", position: [-2, 0.5, 1] as [number, number, number], health: 78, color: "#84cc16" },
    { name: "Field C", position: [1, 0.8, -2] as [number, number, number], health: 65, color: "#eab308" },
    { name: "Field D", position: [-1, 1.2, -1] as [number, number, number], health: 45, color: "#f97316" },
  ]

  useFrame((state) => {
    if (markersRef.current) {
      markersRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.1 + 1
      })
    }
  })

  return (
    <group ref={markersRef}>
      {fields.map((field, index) => (
        <group key={index} position={field.position}>
          <Box args={[0.1, 0.5, 0.1]}>
            <meshPhongMaterial color={field.color} />
          </Box>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.2}
            color={field.color}
            anchorX="center"
            anchorY="middle"
          >
            {field.name}
          </Text>
        </group>
      ))}
    </group>
  )
}

// Loading placeholder
function Loading() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading 3D Terrain...</p>
      </div>
    </div>
  )
}

const TerrainVisualization = () => {
  const [heightScale, setHeightScale] = useState([1])
  const [showWireframe, setShowWireframe] = useState(false)
  const [showMarkers, setShowMarkers] = useState(true)
  const [colorMode, setColorMode] = useState("elevation")
  const [viewMode, setViewMode] = useState("perspective")

  const stats = [
    { label: "Elevation Range", value: "145-287m", icon: Mountain },
    { label: "Slope Analysis", value: "2.3° avg", icon: Mountain },
    { label: "Drainage", value: "Good", icon: Mountain },
    { label: "Soil Erosion", value: "Low Risk", icon: Mountain }
  ]

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary mb-1 sm:mb-2">3D Terrain Visualization</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Interactive field topography and elevation analysis</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mt-3 lg:mt-0"
        >
          <Button 
            variant="outline" 
            className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            aria-label="Export 3D terrain model"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Export 3D Model</span>
          </Button>
          <Button 
            className="bg-gradient-primary text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            aria-label="View terrain in augmented reality"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">AR View</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="metric-card p-2 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate" id={`stat-label-${index}`}>{stat.label}</p>
                  <p className="text-sm sm:text-base font-semibold truncate" aria-labelledby={`stat-label-${index}`}>{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3"
        >
          <Card className="viz-container p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">Interactive 3D Terrain</h3>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Badge variant="outline" className="bg-tech-primary/10 text-tech-primary border-tech-primary/20 text-xs sm:text-sm px-1 sm:px-2 h-5 sm:h-6">
                  WebGL Enabled
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  aria-label="Reset terrain view"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden" style={{ height: '500px' }}>
              <Suspense fallback={<Loading />}>
                <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                  <pointLight position={[-10, 10, -10]} intensity={0.5} />
                  
                  <TerrainMesh 
                    heightScale={heightScale[0]} 
                    showWireframe={showWireframe}
                    colorMode={colorMode}
                  />
                  
                  {showMarkers && <FieldMarkers />}
                  
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={2}
                    maxDistance={20}
                  />
                  
                  {/* Ground plane */}
                  <Plane 
                    args={[20, 20]} 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    position={[0, -2, 0]}
                  >
                    <meshPhongMaterial color="#1a1a1a" transparent opacity={0.3} />
                  </Plane>
                </Canvas>
              </Suspense>
            </div>

            <div className="mt-4 text-sm text-muted-foreground text-center">
              Drag to rotate • Scroll to zoom • Right-click to pan
            </div>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Visualization Controls */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" id="viz-controls-heading">
              <Settings className="w-5 h-5 text-primary" aria-hidden="true" />
              Visualization Controls
            </h3>
            
            <div className="space-y-4">
              {/* Height Scale */}
              <div>
                <Label htmlFor="height-scale" className="text-sm font-medium mb-2 block">
                  Height Scale: {heightScale[0]}x
                </Label>
                <Slider
                  id="height-scale"
                  value={heightScale}
                  onValueChange={setHeightScale}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                  aria-label={`Height scale: ${heightScale[0]}x`}
                  aria-valuemin={0.1}
                  aria-valuemax={3}
                  aria-valuenow={heightScale[0]}
                />
              </div>

              {/* Color Mode */}
              <div>
                <Label htmlFor="color-mode" className="text-sm font-medium mb-2 block">Color Mode</Label>
                <Select value={colorMode} onValueChange={setColorMode}>
                  <SelectTrigger aria-label={`Current color mode: ${colorMode}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elevation">Elevation</SelectItem>
                    <SelectItem value="health">Crop Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div>
                <Label htmlFor="view-mode" className="text-sm font-medium mb-2 block">View Mode</Label>
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger aria-label={`Current view mode: ${viewMode}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perspective">Perspective</SelectItem>
                    <SelectItem value="orthographic">Orthographic</SelectItem>
                    <SelectItem value="topdown">Top Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Controls */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wireframe"
                    checked={showWireframe}
                    onCheckedChange={setShowWireframe}
                  />
                  <Label htmlFor="wireframe">Show Wireframe</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="markers"
                    checked={showMarkers}
                    onCheckedChange={setShowMarkers}
                  />
                  <Label htmlFor="markers">Show Field Markers</Label>
                </div>
              </div>
            </div>
          </Card>

          {/* Terrain Analysis */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Terrain Analysis
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Min Elevation</span>
                  <div className="font-medium">145.2m</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Elevation</span>
                  <div className="font-medium">287.8m</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Average Slope</span>
                  <div className="font-medium">2.3°</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface Area</span>
                  <div className="font-medium">145.7 ha</div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60">
                <h4 className="font-medium text-sm mb-2">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water Runoff</span>
                    <Badge variant="outline" className="bg-health-good/10 text-health-good border-health-good/20">
                      Low
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Soil Erosion</span>
                    <Badge variant="outline" className="bg-health-moderate/10 text-health-moderate border-health-moderate/20">
                      Moderate
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Drainage</span>
                    <Badge variant="outline" className="bg-health-excellent/10 text-health-excellent border-health-excellent/20">
                      Good
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Export Options */}
          <Card className="viz-container">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export as STL
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export as OBJ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default TerrainVisualization
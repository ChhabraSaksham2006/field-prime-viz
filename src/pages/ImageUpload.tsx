import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  id: string
  file: File
  preview?: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  analysis?: {
    health: number
    moisture: number
    nutrients: number
    diseases: string[]
  }
}

const ImageUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload and processing
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif'],
    },
    multiple: true
  })

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, progress }
          : f
      ))
    }
    
    // Change to processing
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'processing', progress: 0 }
        : f
    ))
    
    // Simulate processing
    for (let progress = 0; progress <= 100; progress += 15) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, progress }
          : f
      ))
    }
    
    // Complete with mock analysis
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { 
            ...f, 
            status: 'completed',
            progress: 100,
            analysis: {
              health: Math.floor(Math.random() * 30) + 70,
              moisture: Math.floor(Math.random() * 40) + 40,
              nutrients: Math.floor(Math.random() * 25) + 60,
              diseases: ['Leaf Spot', 'Rust'].filter(() => Math.random() > 0.7)
            }
          }
        : f
    ))
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-health-excellent'
    if (health >= 70) return 'text-health-good'
    if (health >= 55) return 'text-health-moderate'
    if (health >= 40) return 'text-health-poor'
    return 'text-health-critical'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Hyperspectral Image Analysis</h1>
          <p className="text-lg text-muted-foreground">Upload and analyze crop images for comprehensive health assessment</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mt-4 sm:mt-0"
        >
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </motion.div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="viz-container">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive || dragActive 
                ? 'border-primary bg-primary/5 shadow-glow' 
                : 'border-border/60 hover:border-primary/50 hover:bg-accent/30'
              }
            `}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? "Drop your images here" : "Drag & drop hyperspectral images"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports JPEG, PNG, TIFF formats. Multiple files allowed.
            </p>
            <Button className="bg-gradient-primary">
              Choose Files
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Processing Queue</h2>
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="metric-card"
              >
                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{file.file.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          file.status === 'uploading' ? 'bg-tech-primary/10 text-tech-primary border-tech-primary/20' :
                          file.status === 'processing' ? 'bg-health-moderate/10 text-health-moderate border-health-moderate/20' :
                          file.status === 'completed' ? 'bg-health-excellent/10 text-health-excellent border-health-excellent/20' :
                          'bg-health-critical/10 text-health-critical border-health-critical/20'
                        }`}
                      >
                        {file.status === 'uploading' && <Upload className="w-3 h-3 mr-1" />}
                        {file.status === 'processing' && <AlertCircle className="w-3 h-3 mr-1 animate-spin" />}
                        {file.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    {file.status !== 'completed' && (
                      <div className="mb-3">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.status === 'uploading' ? 'Uploading...' : 'Processing...'} {file.progress}%
                        </p>
                      </div>
                    )}

                    {/* Analysis Results */}
                    {file.status === 'completed' && file.analysis && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Health Score</span>
                            <div className={`font-semibold ${getHealthColor(file.analysis.health)}`}>
                              {file.analysis.health}%
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Moisture</span>
                            <div className="font-semibold text-tech-primary">
                              {file.analysis.moisture}%
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Nutrients</span>
                            <div className="font-semibold text-health-good">
                              {file.analysis.nutrients}%
                            </div>
                          </div>
                        </div>
                        {file.analysis.diseases.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {file.analysis.diseases.map((disease, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-health-critical/10 text-health-critical border-health-critical/20">
                                {disease}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageUpload
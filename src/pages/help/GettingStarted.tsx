import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";

const GettingStarted = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up for a AgriTech Pro account to get started",
      completed: true,
      action: () => navigate("/signup")
    },
    {
      title: "View Health Analysis",
      description: "Analyze crop health using our AI-powered spectral analysis",
      completed: false,
      action: () => navigate("/health-map")
    },
    {
      title: "Explore 3D Terrain",
      description: "Visualize your fields in 3D with elevation and terrain data",
      completed: false,
      action: () => navigate("/terrain")
    },
    {
      title: "Invite Team Members",
      description: "Collaborate with your team by inviting them to your workspace",
      completed: false,
      action: () => navigate("/team")
    }
  ];

  const videoTutorials = [
    {
      title: "Quick Start Guide",
      duration: "5 min",
      description: "Learn the basics in just 5 minutes"
    },
    {
      title: "Understanding Health Maps",
      duration: "7 min",
      description: "Interpreting crop health visualization and indicators"
    },
    {
      title: "Team Collaboration",
      duration: "4 min",
      description: "Setting up your team and managing permissions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/help")}
            className="mb-4 hover:bg-accent/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Button>
          
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Getting Started
          </h1>
          <p className="text-lg text-muted-foreground">
            Follow these steps to get up and running with Field Prime Viz
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          step.completed ? 'text-green-500' : ''
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={step.completed ? "outline" : "default"}
                      size="sm"
                      onClick={step.action}
                    >
                      {step.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Video Tutorials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Video Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoTutorials.map((video, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GettingStarted;
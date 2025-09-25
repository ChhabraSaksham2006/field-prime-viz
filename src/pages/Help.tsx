import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  ArrowLeft, 
  FileText, 
  Video, 
  HelpCircle 
} from "lucide-react";

const Help = () => {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using Field Prime Viz",
      action: () => navigate("/help/getting-started")
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Comprehensive guides and API references",
      action: () => window.open("https://docs.fieldprime.com", "_blank")
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      action: () => window.open("https://youtube.com/fieldprime", "_blank")
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions and answers",
      action: () => navigate("/help/faq")
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@fieldprime.com",
      action: () => window.location.href = "mailto:support@fieldprime.com"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: () => window.open("https://chat.fieldprime.com", "_blank")
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      action: () => window.location.href = "tel:+15551234567"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-accent/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Get the help you need to make the most of Field Prime Viz
          </p>
        </motion.div>

        {/* Help Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {helpSections.map((section, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-medium transition-all duration-300 cursor-pointer"
              onClick={section.action}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient-primary">
                Contact Support
              </CardTitle>
              <CardDescription>
                Need personalized assistance? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 hover:bg-accent/50"
                    onClick={method.action}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">{method.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Navigation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use the sidebar to navigate between different sections</li>
                    <li>• Click on status badges to view detailed system information</li>
                    <li>• Use the search bar to quickly find specific data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Data Analysis</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use spectral analysis for detailed crop monitoring</li>
                    <li>• Export reports for sharing with your team</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
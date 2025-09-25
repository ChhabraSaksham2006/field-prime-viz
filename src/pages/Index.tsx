import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, BarChart3, Map, Activity, Shield, ArrowRight, Cpu, Database, LineChart, Zap, Globe, Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const FeatureCard = ({ icon: Icon, title, description, delay = 0, iconColor = "primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-card/50 backdrop-blur-sm border border-border/40 p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
  >
    <div className={`h-12 w-12 rounded-full bg-${iconColor}/10 flex items-center justify-center mb-4`}>
      <Icon className={`h-6 w-6 text-${iconColor}`} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const TechCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.03 }}
    className="flex gap-4 p-4 rounded-lg hover:bg-card/50 transition-all duration-300"
  >
    <div className="h-10 w-10 rounded-lg bg-tech-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="h-5 w-5 text-tech-primary" />
    </div>
    <div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const StatisticItem = ({ value, label, color = "primary" }) => (
  <motion.div 
    className="text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className={`text-3xl font-bold text-${color} mb-1`}>{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

const Index = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const dashboardImages = [
    "/agricultural-dashboard-1.svg",
    "/agricultural-dashboard-2.svg",
    "/agricultural-dashboard-3.svg"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % dashboardImages.length);
        setIsVisible(true);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/agricultural-pattern.svg')] opacity-5" />
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-tech-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 left-10 w-64 h-64 rounded-full bg-health-excellent/10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-10 w-72 h-72 rounded-full bg-tech-accent/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Leaf className="mr-1 h-4 w-4" />
                <span>AI-Powered Agricultural Monitoring</span>
                <Badge variant="outline" className="ml-2 bg-tech-primary/10 text-tech-primary border-tech-primary/20">Beta</Badge>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              >
                <motion.span 
                  className="text-gradient-primary bg-clip-text text-transparent bg-gradient-primary inline-block"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut"
                  }}
                >
                  AgriTech Pro
                </motion.span>
                <br />
                <span>Precision Agriculture Platform</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Revolutionize your farming with real-time crop health analysis, soil condition monitoring, and pest risk detection using advanced hyperspectral imaging technology and MATLAB's powerful analytical tools. Our platform integrates multispectral data with AI-driven insights to maximize yields while minimizing resource usage.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 text-primary hover:bg-primary/5"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0"
              >
                <StatisticItem value="98.5%" label="Detection Accuracy" color="primary" />
                <StatisticItem value="15k+" label="Fields Monitored" color="tech-primary" />
                <StatisticItem value="42%" label="Resource Savings" color="health-excellent" />
              </motion.div>
            </div>
            
            {/* Right Content - Hero Image */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl blur-xl transform -rotate-3" />
                <div className="absolute inset-0 bg-gradient-earth opacity-5 rounded-2xl blur-lg transform rotate-3" />
                
                <AnimatePresence mode="wait">
                  {isVisible && (
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={dashboardImages[currentImageIndex] || "/agricultural-dashboard-1.svg"} 
                        alt="Agricultural Monitoring Dashboard" 
                        className="rounded-2xl border border-border/40 shadow-medium relative z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full h-auto"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-card p-4 rounded-lg shadow-medium border border-border/40 z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-health-excellent" />
                    <span className="text-sm font-medium">Crop Health: Excellent</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-medium border border-border/40 z-20"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-tech-primary" />
                    <span className="text-sm font-medium">Soil Moisture: Optimal</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-card p-3 rounded-lg shadow-medium border border-border/40 z-20"
                  animate={{ x: ["50%", "45%", "50%"] }}
                  transition={{ repeat: Infinity, duration: 7 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-tech-accent" />
                    <span className="text-sm font-medium">Pest Risk: Low</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-tech-primary/10 text-tech-primary text-sm font-medium mb-6"
            >
              <Activity className="mr-1 h-4 w-4" />
              <span>Precision Agriculture Features</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Agricultural Monitoring</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines hyperspectral imaging with AI to provide comprehensive insights for precision agriculture, leveraging MATLAB's Hyperspectral Imaging Library and Deep Learning Toolbox.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3}
              title="Real-time Analytics"
              description="Monitor crop health metrics and environmental conditions with real-time data visualization and alerts."
              delay={0.1}
            />
            <FeatureCard 
              icon={Map}
              title="Health Mapping"
              description="Generate detailed health maps of your fields using multispectral and hyperspectral imaging technology."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity}
              title="Spectral Analysis"
              description="Analyze spectral signatures to identify plant stress, nutrient deficiencies, and disease outbreaks early."
              delay={0.3}
            />
            <FeatureCard 
              icon={Shield}
              title="Pest Risk Detection"
              description="Predict and prevent pest outbreaks with AI-powered risk assessment and early warning systems."
              delay={0.4}
            />
            <FeatureCard 
              icon={Leaf}
              title="Soil Condition Monitoring"
              description="Track soil moisture, composition, and health to optimize irrigation and fertilization strategies."
              delay={0.5}
            />
            <FeatureCard 
              icon={Activity}
              title="Yield Prediction"
              description="Forecast crop yields based on historical data, current conditions, and advanced predictive models."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-tech-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-tech-accent/10 text-tech-accent text-sm font-medium mb-6"
              >
                <Cpu className="mr-1 h-4 w-4" />
                <span>Cutting-Edge Technology</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powered by Advanced Analytics</h2>
              <p className="text-lg text-muted-foreground mb-8">
                AgriTech Pro integrates MATLAB's powerful analytical capabilities with state-of-the-art machine learning to deliver actionable insights from complex agricultural data.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TechCard 
                  icon={Database}
                  title="Hyperspectral Imaging"
                  description="Process and analyze multispectral and hyperspectral data to detect subtle changes in crop health."
                  delay={0.1}
                />
                <TechCard 
                  icon={LineChart}
                  title="Advanced Analytics"
                  description="Utilize MATLAB's Image Processing Toolbox for precise analysis of agricultural imagery."
                  delay={0.2}
                />
                <TechCard 
                  icon={Cpu}
                  title="AI-Powered Predictions"
                  description="Machine learning models trained on vast agricultural datasets for accurate forecasting."
                  delay={0.3}
                />
                <TechCard 
                  icon={Zap}
                  title="Real-time Processing"
                  description="Process sensor data in real-time to provide immediate insights and alerts."
                  delay={0.4}
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative p-1 bg-gradient-to-br from-tech-primary/20 to-tech-accent/20 rounded-2xl shadow-medium overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-card rounded-xl z-0"
                  animate={{ 
                    background: [
                      "linear-gradient(45deg, rgba(var(--tech-primary), 0.05) 0%, rgba(var(--tech-accent), 0.05) 100%)",
                      "linear-gradient(45deg, rgba(var(--tech-accent), 0.05) 0%, rgba(var(--tech-primary), 0.05) 100%)",
                      "linear-gradient(45deg, rgba(var(--tech-primary), 0.05) 0%, rgba(var(--tech-accent), 0.05) 100%)"
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 10,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-tech-primary" />
                      <div className="h-3 w-3 rounded-full bg-tech-accent" />
                      <div className="h-3 w-3 rounded-full bg-primary" />
                    </div>
                    <Badge variant="outline" className="bg-tech-primary/5 text-tech-primary border-tech-primary/20">MATLAB Integration</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.div 
                      className="h-8 bg-tech-primary/10 rounded-md w-full"
                      animate={{ width: ["100%", "80%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        className="h-24 bg-tech-accent/10 rounded-md"
                        animate={{ height: ["6rem", "5rem", "6rem"] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="h-24 bg-primary/10 rounded-md"
                        animate={{ height: ["6rem", "7rem", "6rem"] }}
                        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="h-24 bg-tech-primary/10 rounded-md"
                        animate={{ height: ["6rem", "5.5rem", "6rem"] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <motion.div 
                          className="h-4 bg-tech-primary/10 rounded-md w-full"
                          animate={{ width: ["100%", "90%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                        />
                        <motion.div 
                          className="h-4 bg-tech-primary/10 rounded-md w-4/5"
                          animate={{ width: ["80%", "70%", "80%"] }}
                          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                        />
                        <motion.div 
                          className="h-4 bg-tech-primary/10 rounded-md w-3/5"
                          animate={{ width: ["60%", "50%", "60%"] }}
                          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="h-full bg-tech-accent/5 rounded-md flex items-center justify-center">
                        <Globe className="h-10 w-10 text-tech-accent/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-health-excellent/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-health-excellent/10 text-health-excellent text-sm font-medium mb-6"
            >
              <Droplets className="mr-1 h-4 w-4" />
              <span>Sustainable Agriculture</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits for Modern Farming</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AgriTech Pro helps agricultural professionals make data-driven decisions that improve yields while reducing environmental impact.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Leaf}
              title="Increased Crop Yields"
              description="Optimize growing conditions and detect issues early to maximize production and quality."
              delay={0.1}
              iconColor="health-excellent"
            />
            <FeatureCard 
              icon={Droplets}
              title="Water Conservation"
              description="Precise irrigation recommendations based on real-time soil moisture and crop water needs."
              delay={0.2}
              iconColor="tech-accent"
            />
            <FeatureCard 
              icon={Shield}
              title="Reduced Chemical Usage"
              description="Target pesticide and fertilizer application only where needed, reducing costs and environmental impact."
              delay={0.3}
              iconColor="tech-primary"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 to-tech-primary/5 border border-border/40 rounded-2xl p-8 md:p-12 shadow-medium text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Agriculture?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of agricultural professionals using our platform to optimize yields, reduce resource usage, and prevent crop losses.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                onClick={() => navigate("/signup")}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

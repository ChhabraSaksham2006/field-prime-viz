import { SignupForm } from "@/components/auth/SignupForm";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Agricultural imagery */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex-1 bg-gradient-to-br from-accent/30 to-primary/10 hidden md:flex flex-col items-center justify-center p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/agricultural-pattern.svg')] opacity-5" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-md z-10"
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient-primary bg-clip-text text-transparent bg-gradient-primary">
            Precision Agriculture Platform
          </h2>
          <p className="text-foreground/80 mb-6">
            Join thousands of agricultural professionals using advanced spectral imaging and AI to optimize crop yields, reduce resource usage, and prevent pest outbreaks.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-soft">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">10,000+</div>
                  <div className="text-sm text-muted-foreground">Fields monitored</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-tech-primary mb-1">25%</div>
                  <div className="text-sm text-muted-foreground">Yield increase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-health-excellent mb-1">30%</div>
                  <div className="text-sm text-muted-foreground">Resource savings</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Animated elements */}
        <motion.div 
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
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
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-tech-primary/10 blur-3xl"
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
      </motion.div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
import { LoginForm } from "@/components/auth/LoginForm";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <LoginForm />
      </div>
      
      {/* Right side - Agricultural imagery */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex-1 bg-gradient-to-br from-primary/10 to-accent/30 hidden md:flex flex-col items-center justify-center p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/agricultural-pattern.svg')] opacity-5" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-md z-10"
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient-primary bg-clip-text text-transparent bg-gradient-primary">
            AI-Powered Agricultural Monitoring
          </h2>
          <p className="text-foreground/80 mb-6">
            Revolutionize your farming with real-time crop health analysis, soil condition monitoring, and pest risk detection using advanced hyperspectral imaging technology.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-soft">
              <div className="text-4xl font-bold text-health-excellent mb-1">94%</div>
              <div className="text-sm text-muted-foreground">Accuracy in crop disease detection</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-soft">
              <div className="text-4xl font-bold text-tech-primary mb-1">3-5x</div>
              <div className="text-sm text-muted-foreground">Faster than traditional methods</div>
            </div>
          </div>
        </motion.div>
        
        {/* Animated elements */}
        <motion.div 
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
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
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-tech-primary/10 blur-3xl"
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
    </div>
  );
};

export default Login;
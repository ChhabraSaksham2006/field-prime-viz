import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup - replace with actual registration
    setTimeout(() => {
      login(); // Set authenticated state
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">Enter your information to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-muted/30 border-border/60 focus:border-primary/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-muted/30 border-border/60 focus:border-primary/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-muted/30 border-border/60 focus:border-primary/40"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5 mt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 border border-border/60 rounded bg-muted/30 text-primary focus:ring-primary"
              />
            </div>
            <div className="text-sm">
              <label htmlFor="terms" className="text-muted-foreground">
                I agree to the <Button variant="link" className="p-0 h-auto text-primary">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-primary">Privacy Policy</Button>
              </label>
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="mr-2">Creating account</span>
              <span className="animate-spin">⋯</span>
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/login")}>
          Sign in
        </Button>
      </div>
      
      <div className="border-t border-border/60 pt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-health-excellent" />
          <span>Advanced agricultural monitoring tools</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          <CheckCircle className="h-4 w-4 text-health-excellent" />
          <span>AI-powered crop health analysis</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          <CheckCircle className="h-4 w-4 text-health-excellent" />
          <span>Real-time environmental monitoring</span>
        </div>
      </div>
    </motion.div>
  );
}
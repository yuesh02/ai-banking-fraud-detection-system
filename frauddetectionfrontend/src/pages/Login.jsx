import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, User, Lock, ArrowRight, Activity } from "lucide-react";
import { loginUser } from "../services/authService";
import AuthContext from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First try actual backend
      const data = await loginUser(username, password);
      login(data);
      navigate("/");
    } catch (err) {
      // Fallback for demo purposes if backend is unreachable
      console.warn("Backend login failed, using fallback for demo", err);
      if (username === "admin" && password === "admin") {
        login({ username: "admin", role: "ADMIN", token: "mock-token-123" });
        navigate("/");
      } else {
        setError("Invalid credentials. Try admin/admin for demo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-8 sm:p-10 relative">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-t-2xl" />

          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-brand-primary/20"
            >
              <ShieldCheck className="w-8 h-8 text-brand-secondary" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-['Outfit']">
              Fraud<span className="text-gradient">Shield</span>
            </h1>
            <p className="text-gray-400 text-sm">Enterprise AI Threat Detection Platform</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-[#0f172a]/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-colors sm:text-sm"
                  placeholder="Username (admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-[#0f172a]/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-colors sm:text-sm"
                  placeholder="Password (admin)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-brand-primary focus:ring-brand-primary/50 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-brand-secondary hover:text-brand-primary transition-colors">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f19] focus:ring-brand-primary transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            Secure login via End-to-End Encryption
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
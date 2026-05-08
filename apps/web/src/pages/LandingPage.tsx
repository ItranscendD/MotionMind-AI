import Navbar from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { Rocket, Sparkles, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Video Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Create Cinematic Motion <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              With the Power of AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 leading-relaxed">
            The world's most advanced AI video generator. Transforming prompts into breathtaking cinematic visuals in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding/plan" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-lg shadow-primary/20">
              Get Started Free
              <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] -z-10 rounded-full opacity-30" />
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Ultra Fast Generation</h3>
              <p className="text-white/60 leading-relaxed">
                Generate high-fidelity cinematic videos in under 60 seconds with our optimized inference engine.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Precision Control</h3>
              <p className="text-white/60 leading-relaxed">
                Fine-tune every aspect of your motion with advanced camera controls and style consistency profiles.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Team Collaboration</h3>
              <p className="text-white/60 leading-relaxed">
                Collaborate in real-time with shared workspaces, team feedback loops, and version control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

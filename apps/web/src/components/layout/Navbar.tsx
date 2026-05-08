import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";

export default function Navbar() {
  let auth;
  try {
    auth = useAuth();
  } catch (e) {
    auth = { isSignedIn: false };
  }
  const { isSignedIn } = auth;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white">
          MotionMind <span className="text-primary">AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/generate" className="text-sm font-medium text-white hover:text-primary transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate
                </Link>
                <Link to="/auto-animate" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Animate
                </Link>
                <Link to="/library" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Library
                </Link>
              </div>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link to="/onboarding/plan" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/onboarding/plan" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

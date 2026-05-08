import React, { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { 
  Plus, 
  Library, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Bell, 
  Search,
  Sparkles,
  Play,
  Share2,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const hasSeenTour = localStorage.getItem("motionmind_tour_seen");
      if (!hasSeenTour) {
        const d = driver({
          showProgress: true,
          steps: [
            { element: '#new-project-btn', popover: { title: 'New Project', description: 'Start your journey by creating a new AI motion project.', side: "right", align: 'start' }},
            { element: '#style-library-link', popover: { title: 'Style Library', description: 'Access curated style profiles to keep your videos consistent.', side: "right", align: 'start' }},
            { element: '#recent-projects', popover: { title: 'Recent Projects', description: 'Your latest creations will appear here for quick access.', side: "bottom", align: 'start' }},
            { element: '#suggest-btn', popover: { title: 'AI Suggest', description: 'Need inspiration? Let our AI suggest prompts for you.', side: "top", align: 'start' }},
            { element: '#export-btn', popover: { title: 'Export', description: 'Once finished, export your motion in high fidelity.', side: "left", align: 'start' }},
            { element: '#team-panel', popover: { title: 'Team Panel', description: 'Collaborate with your teammates and manage permissions.', side: "left", align: 'start' }},
          ]
        });
        d.drive();
        localStorage.setItem("motionmind_tour_seen", "true");
      }
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-4 bg-white/[0.01]">
        <div className="text-xl font-bold tracking-tighter mb-12 px-2">
          MotionMind <span className="text-primary">AI</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button id="style-library-link" className="w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
            <Library className="w-4 h-4" />
            Style Library
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
            <Users className="w-4 h-4" />
            Team
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        <div id="team-panel" className="mt-auto p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Your Team</div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                U{i}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 hover:text-white transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* TopBar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96">
            <Search className="w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold">
              MM
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-white/40">Here's what's happening in your workspace.</p>
            </div>
            <div className="flex gap-4">
              <button id="export-btn" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                Export
              </button>
              <button id="new-project-btn" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div id="recent-projects">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Projects
              </h3>
              <button className="text-sm text-primary font-bold hover:underline">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Skeletons
                [1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
                ))
              ) : (
                <>
                  <div className="group relative aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-2 text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 fill-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Click to play</span>
                      </div>
                      <h4 className="font-bold">Futuristic Neon Cityscape</h4>
                      <p className="text-xs text-white/40 mt-1">Edited 2 hours ago</p>
                    </div>
                  </div>
                  <div className="group relative aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <h4 className="font-bold">Abstract Fluid Motion</h4>
                      <p className="text-xs text-white/40 mt-1">Edited 5 hours ago</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-6 h-6 text-white/20 group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-bold text-white/20 group-hover:text-primary">Create New Project</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Suggestion Card */}
          {!loading && (
            <div id="suggest-btn" className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Stuck on inspiration?
                  </h3>
                  <p className="text-white/60 max-w-md">Our AI can suggest trending prompts and styles based on your workspace activity.</p>
                  <button className="mt-6 px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-all">
                    Generate Suggestions
                  </button>
                </div>
                <div className="hidden md:flex gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 rotate-12 group-hover:rotate-6 transition-transform" />
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 -rotate-12 group-hover:-rotate-6 transition-transform mt-8" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  MessageSquare, 
  PenTool, 
  Smile, 
  CheckCircle, 
  Lock,
  ChevronRight,
  Maximize2,
  Settings,
  Share2
} from "lucide-react";

export default function ReviewPlayer() {
  const { token } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // Mock duration
  const [isPlaying, setIsPlaying] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [activeTool, setActiveTool] = useState<"none" | "comment" | "draw" | "emoji">("none");
  const [reviewerName, setReviewerName] = useState("");
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch review data (mock)
    if (isAuthenticated) {
      setComments([
        { id: '1', timestamp: 2.5, content: "Change this logo size.", author: "Alex", type: 'TEXT' }
      ]);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") setIsAuthenticated(true);
    else alert("Wrong password! (Try 1234)");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
           <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 mx-auto">
              <Lock className="w-8 h-8" />
           </div>
           <h1 className="text-2xl font-bold text-center mb-2">Private Review</h1>
           <p className="text-white/40 text-sm text-center mb-8">Enter the project password to access the review player.</p>
           
           <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-all"
              />
              <button type="submit" className="w-full h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                 Unlock Project
                 <ChevronRight className="w-4 h-4" />
              </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F0F11] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-[#161618]">
        <div className="flex items-center gap-6">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
           </div>
           <div>
              <h1 className="text-sm font-bold">MotionMind Demo Video</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Version 1 · Review Mode</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
           </button>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">JD</div>
              <span className="text-[10px] font-medium text-white/60">Creator: John Doe</span>
           </div>
        </div>
      </header>

      {/* Player Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative bg-black/40">
           {/* Canvas Container */}
           <div className="flex-1 flex items-center justify-center relative">
              <div ref={canvasRef} className="aspect-video w-[80%] bg-[#161618] rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                 {/* Mock Content */}
                 <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4 animate-pulse">Design Concept</h2>
                    <p className="text-white/20">Review Frame {Math.floor(currentTime * 30)}</p>
                 </div>

                 {/* Markup Overlay (SVG Mock) */}
                 {activeTool === 'draw' && (
                   <svg className="absolute inset-0 pointer-events-none">
                      <path d="M 100 100 Q 200 150 300 100" stroke="#4F46E5" fill="none" strokeWidth="4" />
                   </svg>
                 )}
              </div>

              {/* Feedback Toolbar (Floating) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-[#161618]/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
                 <button 
                   onClick={() => setActiveTool(activeTool === 'comment' ? 'none' : 'comment')}
                   className={`p-3 rounded-xl transition-all ${activeTool === 'comment' ? "bg-primary text-white shadow-lg" : "hover:bg-white/5 text-white/40"}`}
                 >
                    <MessageSquare className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={() => setActiveTool(activeTool === 'draw' ? 'none' : 'draw')}
                   className={`p-3 rounded-xl transition-all ${activeTool === 'draw' ? "bg-primary text-white shadow-lg" : "hover:bg-white/5 text-white/40"}`}
                 >
                    <PenTool className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={() => setActiveTool(activeTool === 'emoji' ? 'none' : 'emoji')}
                   className={`p-3 rounded-xl transition-all ${activeTool === 'emoji' ? "bg-primary text-white shadow-lg" : "hover:bg-white/5 text-white/40"}`}
                 >
                    <Smile className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* Timeline/Scrub Area */}
           <div className="h-24 bg-[#161618] border-t border-white/5 px-8 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4">
                 <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <SkipBack className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)}
                   className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                 >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                 </button>
                 <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <SkipForward className="w-4 h-4" />
                 </button>
                 
                 <div className="flex-1 relative group py-4">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-100" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                    {/* Comment Pins */}
                    {comments.map(c => (
                      <div 
                        key={c.id} 
                        className="absolute top-1/2 -mt-3 w-6 h-6 bg-[#161618] border border-primary/40 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
                        style={{ left: `${(c.timestamp / duration) * 100}%` }}
                        title={c.content}
                      >
                         <MessageSquare className="w-3 h-3 text-primary" />
                      </div>
                    ))}
                    <input 
                      type="range"
                      min="0"
                      max={duration}
                      step="0.01"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest">{currentTime.toFixed(2)}s / {duration}s</span>
                    <button className="p-2 text-white/40 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                 </div>
              </div>
           </div>
        </div>

        {/* Feedback Sidebar */}
        <div className="w-96 border-l border-white/5 flex flex-col bg-[#161618]">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Feedback ({comments.length})</h3>
              <div className="flex items-center gap-2">
                 <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-white/20"><Settings className="w-4 h-4" /></button>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                   <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{c.author[0]}</div>
                         <span className="text-[10px] font-bold text-white/60">{c.author}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20">{c.timestamp.toFixed(2)}s</span>
                   </div>
                   <p className="text-xs text-white/80 leading-relaxed mb-4">{c.content}</p>
                   <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <button className="hover:text-primary transition-colors">Reply</button>
                      <button className="hover:text-primary transition-colors">Jump to frame</button>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="relative">
                 <textarea 
                   placeholder="Add a comment at 2.50s..."
                   className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-primary/50 transition-all resize-none pr-12"
                 />
                 <button className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

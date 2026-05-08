import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { 
  Palette, 
  Type, 
  Activity, 
  Layout, 
  Sparkles, 
  Scissors, 
  Baseline,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Save,
  Loader2
} from "lucide-react";

import { useParams } from "react-router-dom";

export default function ReviewScreen() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("color");
  const [loading, setLoading] = useState(true);
  const [extraction, setExtraction] = useState<any>(null);
  const [adjustments, setAdjustments] = useState({
    saturation: 50,
    contrast: 50,
    motionIntensity: 50,
    smoothing: 50
  });

  React.useEffect(() => {
    fetch(`http://localhost:3001/api/styles/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setExtraction(data.result.extraction);
          setLoading(false);
        }
      });
  }, [id]);

  const dimensions = [
    { id: "color", name: "Color Palette", icon: Palette },
    { id: "typo", name: "Typography", icon: Type },
    { id: "motion", name: "Motion Language", icon: Activity },
    { id: "layout", name: "Spatial Layout", icon: Layout },
    { id: "vfx", name: "Visual Effects", icon: Sparkles },
    { id: "transition", name: "Transitions", icon: Scissors },
    { id: "text", name: "Text Animation", icon: Baseline },
  ];

  const colors = ["#4F46E5", "#D97706", "#0F0F11", "#FFFFFF", "#1E1E22"];

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-12">
          <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
              Discard
            </button>
            <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Save className="w-5 h-5" />
              Save Style Profile
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Preview Area */}
          <div className="space-y-8">
            <div className="aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
               <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <Play className="w-20 h-20" />
               </div>
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">AI Extraction Review: Job #12345</span>
                  </div>
                  <span className="text-xs text-white/40 font-mono">512-DIM VECTOR ENCODED</span>
               </div>
            </div>

            {/* Dimension Tabs */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {dimensions.map((d) => (
                <button 
                  key={d.id}
                  onClick={() => setActiveTab(d.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                    activeTab === d.id ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  <d.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center">{d.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Dimension Content */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[300px] flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Finalizing Analysis...</p>
                </div>
              ) : (
                <div className="w-full h-full">
                  {activeTab === "color" && (
                    <div className="animate-in fade-in duration-500 w-full">
                      <h3 className="text-xl font-bold mb-6">Extracted Palette</h3>
                      <div className="grid grid-cols-5 gap-4">
                        {(extraction?.color?.palette || colors).map((c: string, i: number) => (
                          <div key={i} className="space-y-3">
                            <div 
                              className="aspect-square rounded-2xl shadow-inner border border-white/10 transition-all" 
                              style={{ 
                                backgroundColor: c,
                                filter: `saturate(${adjustments.saturation}%)`
                              }} 
                            />
                            <div className="text-[10px] font-mono text-center text-white/40 uppercase">{c}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "motion" && (
                    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-12 w-full">
                      <Activity className="w-16 h-16 text-primary mb-6" />
                      <h3 className="text-xl font-bold mb-2">Motion Language</h3>
                      <p className="text-white/40 text-center max-w-md">
                        {extraction?.motion?.opticalFlow || 'Optical flow vectors'} detected. 
                        Easing curve: <span className="text-primary font-mono">{extraction?.motion?.easing}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Adjustment Panel */}
          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="font-bold mb-8 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary" />
                Fine-tune Extraction
              </h3>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-medium text-white/60">Color Saturation</label>
                    <span className="text-xs font-bold text-primary">{adjustments.saturation}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={adjustments.saturation}
                    onChange={(e) => setAdjustments({...adjustments, saturation: parseInt(e.target.value)})}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-medium text-white/60">VFX Intensity</label>
                    <span className="text-xs font-bold text-primary">{adjustments.contrast}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={adjustments.contrast}
                    onChange={(e) => setAdjustments({...adjustments, contrast: parseInt(e.target.value)})}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-medium text-white/60">Motion Velocity</label>
                    <span className="text-xs font-bold text-primary">{adjustments.motionIntensity}%</span>
                  </div>
                  <input 
                    type="range" 
                    value={adjustments.motionIntensity}
                    onChange={(e) => setAdjustments({...adjustments, motionIntensity: parseInt(e.target.value)})}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-[10px] text-primary font-medium leading-relaxed uppercase tracking-wider">
                    Adjustments are blended with the AI extraction model in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/50 transition-all cursor-pointer">
              <History className="w-8 h-8 text-white/10 group-hover:text-primary transition-colors" />
              <div>
                <h4 className="font-bold text-sm">Save as Version</h4>
                <p className="text-[10px] text-white/40 mt-1">Keep the original and save this as v2</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Play(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  )
}

function History(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  )
}

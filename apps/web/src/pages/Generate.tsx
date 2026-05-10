import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { 
  Sparkles, 
  Send, 
  Layout, 
  FileText, 
  Settings2, 
  History, 
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  Zap,
  Clock,
  LayoutGrid
} from "lucide-react";
import { useGenerationProgress } from "@/hooks/useGenerationProgress";
import { API_BASE_URL } from "@/config/api";
import VariantComparison from "@/components/generate/VariantComparison";
import TraceabilityPanel from "@/components/generate/TraceabilityPanel";

export default function Generate() {
  const [activeTab, setActiveTab] = useState<"free" | "structured" | "template">("free");
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  
  const { progress, status, result } = useGenerationProgress(jobId);

  const templates = [
    { name: "Logo Reveal", prompt: "A cinematic logo reveal with liquid chrome textures and dramatic lighting." },
    { name: "Social Ad", prompt: "High-energy social media advertisement with fast cuts and neon accents." },
    { name: "Explainer Opener", prompt: "Clean, minimalist 2D animation with smooth transitions and soft shadows." },
    { name: "Intro Sting", prompt: "Short, punchy brand sting with glitch effects and metallic reflections." }
  ];

  const handleGenerate = async () => {
    const res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt, 
        params: { resolution: "4K", fps: 30, variants: 3 },
        userId: "user_123",
        workspaceId: "ws_123"
      })
    });
    const data = await res.json();
    setJobId(data.jobId);
    setSelectedVariant(null);
  };

  const handleTemplateSelect = (p: string) => {
    setPrompt(p);
    setActiveTab("free");
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Left Sidebar: History */}
        <aside className="w-72 border-r border-white/5 flex flex-col p-6 bg-white/[0.01] hidden xl:flex">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
            <History className="w-4 h-4" />
            Prompt History
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                <p className="text-xs text-white/60 line-clamp-2 mb-2 italic">"Cinematic logo reveal with liquid chrome..."</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/20">2h ago</span>
                  <RotateCcw className="w-3 h-3 text-white/0 group-hover:text-primary transition-all" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col overflow-y-auto p-8 lg:p-12">
          <div className="max-w-5xl mx-auto w-full space-y-12">
            
            {/* Generation Area */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Generate Motion</h1>
                  <p className="text-white/40 text-sm">Transform your vision into high-fidelity cinematic motion.</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setActiveTab("free")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "free" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Free-form
                  </button>
                  <button 
                    onClick={() => setActiveTab("structured")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "structured" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Structured
                  </button>
                  <button 
                    onClick={() => setActiveTab("template")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "template" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Templates
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 relative overflow-hidden group">
                {activeTab === "free" && (
                  <div className="animate-in fade-in duration-500">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                      placeholder="Describe the motion you want to create... (e.g. A futuristic neon cityscape with fluid camera movements)"
                      className="w-full bg-transparent text-xl font-medium outline-none min-h-[120px] resize-none placeholder:text-white/10"
                    />
                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{prompt.length} / 500 chars</span>
                        <div className="h-4 w-px bg-white/10" />
                        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Clear</button>
                      </div>
                      <button 
                        onClick={handleGenerate}
                        disabled={!prompt || status === "processing"}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {status === "processing" ? (
                          <><Zap className="w-5 h-5 animate-pulse" /> Generating...</>
                        ) : (
                          <><Send className="w-5 h-5" /> Generate</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "template" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    {templates.map((t) => (
                      <button 
                        key={t.name}
                        onClick={() => handleTemplateSelect(t.prompt)}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-left transition-all group/card"
                      >
                        <div className="aspect-video rounded-xl bg-white/5 mb-3 group-hover/card:bg-primary/10 transition-colors" />
                        <h4 className="text-xs font-bold mb-1">{t.name}</h4>
                        <p className="text-[10px] text-white/40 line-clamp-1">{t.prompt}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Progress Overlay */}
                {status !== "idle" && status !== "completed" && status !== "failed" && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-12 z-20">
                    <div className="w-full max-w-md space-y-6">
                       <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold flex items-center gap-3">
                           <Zap className="w-6 h-6 text-primary animate-pulse" />
                           {status === "queued" ? "Queuing Job..." : "Generating Variants..."}
                         </h3>
                         <span className="text-primary font-bold">{progress}%</span>
                       </div>
                       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>Est. Remaining: 12s</span>
                         </div>
                         <button onClick={() => setJobId(null)} className="hover:text-white transition-colors">Cancel</button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Results Area */}
            {status === "completed" && result && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <LayoutGrid className="w-6 h-6 text-primary" />
                      Generation Result
                    </h2>
                    <div className="flex gap-2">
                       <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-primary transition-colors">
                          <RotateCcw className="w-4 h-4" />
                       </button>
                       <div className="h-8 w-px bg-white/10 mx-2" />
                       <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
                          Use Selected Variant
                       </button>
                    </div>
                  </div>

                  <VariantComparison 
                    variants={result.variants} 
                    selectedId={selectedVariant}
                    onSelect={setSelectedVariant}
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <TraceabilityPanel traceability={result.variants.find((v: any) => v.id === selectedVariant)?.traceability || []} />
                  
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      What If?
                    </h3>
                    <p className="text-white/40 text-sm">AI-suggested creative directions based on this generation.</p>
                    <div className="flex flex-col gap-3">
                      {result.suggestions.map((s: string, i: number) => (
                        <button 
                          key={i} 
                          onClick={() => setPrompt(s)}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left text-xs font-medium hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between group"
                        >
                          {s}
                          <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Right Sidebar: Params */}
        <aside className="w-80 border-l border-white/5 flex flex-col p-8 bg-white/[0.01] hidden lg:flex">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Generation Params
          </h3>
          
          <div className="space-y-8 flex-1 overflow-y-auto pr-2">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Resolution</label>
              <div className="grid grid-cols-2 gap-2">
                 <button className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold">4K Cinema</button>
                 <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/40">1080p HD</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Variant Count</label>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                 <button className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors">-</button>
                 <span className="font-bold">3</span>
                 <button className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors">+</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Color Constraint</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none">
                <option>Free Flow</option>
                <option>Brand Palette Lock</option>
                <option>Monochrome</option>
              </select>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
             <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
                <Zap className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[10px] text-primary font-medium leading-relaxed">
                  PRO Plan: You have unlimited 4K generations this month.
                </p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

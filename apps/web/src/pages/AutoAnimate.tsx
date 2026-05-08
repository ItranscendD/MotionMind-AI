import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { 
  Upload, 
  Sparkles, 
  Layers, 
  Play, 
  ChevronRight,
  Zap,
  Clock,
  ArrowRight,
  X,
  FileImage,
  Layout,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import { useGenerationProgress } from "@/hooks/useGenerationProgress";

export default function AutoAnimate() {
  const [step, setStep] = useState<"upload" | "processing" | "review" | "blend">("upload");
  const [jobId, setJobId] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [blendValue, setBlendValue] = useState(50);
  
  const { progress, status, result } = useGenerationProgress(jobId);

  const handleUpload = async () => {
    setStep("processing");
    const res = await fetch("http://localhost:3001/api/auto-animate/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user_123", workspaceId: "ws_123" })
    });
    const data = await res.json();
    setJobId(data.jobId);
  };

  React.useEffect(() => {
    if (status === "completed") {
      setStep("review");
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center justify-center pt-24">
        <div className="max-w-4xl w-full">
          
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              AI Auto-Animate
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Animate Static Designs <br/> <span className="text-primary">in Seconds.</span></h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Upload a flat image or Figma frame. Our AI will decompose it into layers and propose cinematic motion concepts.</p>
          </div>

          {/* Steps */}
          {step === "upload" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div 
                onClick={handleUpload}
                className="group relative h-96 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-12 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
              >
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Upload className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Drop Design File</h3>
                 <p className="text-white/40 text-sm text-center mb-8">PNG, JPEG, PSD, or PDF (Max 50MB)</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">Photoshop</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">Illustrator</span>
                 </div>
              </div>

              <div className="flex flex-col gap-8">
                 <button className="flex-1 rounded-3xl bg-[#161618] border border-white/10 p-12 flex flex-col items-center justify-center hover:border-primary/50 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Layout className="w-16 h-16 text-[#F24E1E] mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">Import from Figma</h3>
                    <p className="text-white/40 text-sm text-center">Sync frames directly from your Figma project.</p>
                 </button>
                 <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Zap className="w-6 h-6 text-primary" />
                       <div>
                          <h4 className="text-sm font-bold">Quick Start</h4>
                          <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Try with a sample design</p>
                       </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                       <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
               <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Layers className="w-10 h-10 animate-pulse" />
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-bold mb-2">Decomposing Design</h3>
                  <p className="text-white/40 text-sm">Identifying semantic layers and bounding boxes...</p>
               </div>
               <div className="max-w-xs mx-auto space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                     <span>Progress</span>
                     <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
               </div>
            </div>
          )}

          {step === "review" && result && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                     <Layers className="w-6 h-6 text-primary" />
                     Layer Decomposition
                  </h2>
                  <button onClick={() => setStep("blend")} className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                     Next: Concepts
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 aspect-video rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
                     {/* Mocked Decomposition Overlays */}
                     {result.layers.map((l: any) => (
                       <div 
                         key={l.id}
                         className="absolute border-2 border-primary/40 bg-primary/10 group cursor-help transition-all hover:bg-primary/20"
                         style={{ 
                            left: `${(l.bounds.x / 1920) * 100}%`, 
                            top: `${(l.bounds.y / 1080) * 100}%`,
                            width: `${(l.bounds.w / 1920) * 100}%`,
                            height: `${(l.bounds.h / 1080) * 100}%`
                         }}
                       >
                          <div className="absolute -top-6 left-0 px-2 py-0.5 bg-primary text-white text-[8px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {l.name}
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Semantic Layers ({result.layers.length})</h4>
                     {result.layers.map((l: any) => (
                       <div key={l.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                {l.type === 'text' ? <FileImage className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                             </div>
                             <span className="text-xs font-bold">{l.name}</span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {step === "blend" && result && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                     <Zap className="w-6 h-6 text-primary" />
                     Animation Concepts
                  </h2>
                  <div className="flex gap-4">
                    <button onClick={() => setStep("review")} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                       Back
                    </button>
                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                       Load into Editor
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.concepts.map((c: any) => (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedConcept(c.id)}
                      className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedConcept === c.id ? "border-primary scale-[1.02] shadow-xl shadow-primary/20" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                       <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/20 group-hover:text-white transition-colors" />
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <h4 className="text-sm font-bold mb-1">{c.name}</h4>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{c.style} style</p>
                       </div>
                       {selectedConcept === c.id && (
                         <div className="absolute top-4 right-4 p-1.5 bg-primary text-white rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               {/* Blend Slider */}
               <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        Concept Blender
                     </h3>
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Interpolation: {blendValue}%</span>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-xs font-bold text-white/40 uppercase tracking-widest w-32">Concept A</div>
                     <div className="flex-1 relative group">
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={blendValue}
                          onChange={(e) => setBlendValue(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="absolute top-1/2 -mt-3 pointer-events-none transition-all duration-300" style={{ left: `${blendValue}%` }}>
                           <div className="w-6 h-6 bg-primary rounded-full border-4 border-[#0F0F11] shadow-lg flex items-center justify-center">
                              <Zap className="w-3 h-3 text-white" />
                           </div>
                        </div>
                     </div>
                     <div className="text-xs font-bold text-white/40 uppercase tracking-widest w-32 text-right">Concept B</div>
                  </div>
                  <p className="text-[10px] text-white/20 leading-relaxed text-center italic">
                     "Blending 'Cinematic Reveal' and 'Kinetic Energy' will interpolate motion paths and timing values."
                  </p>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

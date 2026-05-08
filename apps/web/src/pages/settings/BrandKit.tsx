import React, { useState } from "react";
import { 
  Sparkles, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
  Info
} from "lucide-react";

export default function BrandKitSettings() {
  const [isLocked, setIsLocked] = useState(false);
  
  return (
    <div className="flex-1 flex flex-col bg-[#0F0F11] overflow-y-auto">
      <header className="p-12 pb-8 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
               <Sparkles className="w-8 h-8" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">Brand Kit</h1>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-lg border border-primary/20">Admin Only</span>
               </div>
               <p className="text-white/40 text-sm">Define your brand identity and enforce consistency across all projects.</p>
            </div>
         </div>

         {/* Brand Lock Toggle */}
         <div className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${isLocked ? "bg-primary/5 border-primary shadow-2xl shadow-primary/10" : "bg-white/5 border-white/5"}`}>
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isLocked ? "bg-primary text-white" : "bg-white/5 text-white/20"}`}>
                  <Lock className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-xs font-bold">Brand Lock</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Global Enforcement</p>
               </div>
            </div>
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`w-14 h-8 rounded-full p-1 transition-all ${isLocked ? "bg-primary" : "bg-white/10"}`}
            >
               <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-lg ${isLocked ? "translate-x-6" : "translate-x-0"}`} />
            </button>
         </div>
      </header>

      {/* Info Banner */}
      {isLocked && (
        <div className="mx-12 mb-12 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-4 text-primary animate-in slide-in-from-top-4 duration-500">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <p className="text-xs font-medium">Brand Lock is active. The AI generator and editor are now restricted to only use colors and fonts defined below.</p>
        </div>
      )}

      <div className="px-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* 1. Brand Colours */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Brand Colours</h3>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                  <Plus className="w-3.5 h-3.5" />
                  Add Colour
               </button>
            </div>
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/5 grid grid-cols-4 gap-6">
               {[
                 { label: "Primary", hex: "#4F46E5", contrast: "4.5:1 (AA)" },
                 { label: "Secondary", hex: "#D97706", contrast: "7.2:1 (AAA)" },
                 { label: "Accent", hex: "#0F0F11", contrast: "12:1 (AAA)" },
                 { label: "Surface", hex: "#FFFFFF", contrast: "15:1 (AAA)" }
               ].map((c) => (
                 <div key={c.label} className="space-y-4 group">
                    <div className="aspect-square rounded-2xl border border-white/10 shadow-2xl relative flex flex-col items-center justify-center cursor-pointer overflow-hidden" style={{ backgroundColor: c.hex }}>
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="w-5 h-5 text-white" />
                       </div>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{c.label}</h4>
                       <p className="text-xs font-bold mt-1 uppercase">{c.hex}</p>
                       <div className="flex items-center gap-1.5 mt-2 text-[8px] font-bold text-emerald-500 uppercase">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {c.contrast}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* 2. Brand Fonts */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">Brand Fonts</h3>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">
                  <Plus className="w-3.5 h-3.5" />
                  Upload Font
               </button>
            </div>
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/5 space-y-6">
               {[
                 { label: "Heading (H1)", font: "Inter Bold", size: "64px", example: "The Future of Motion" },
                 { label: "Body Text", font: "Roboto Regular", size: "16px", example: "Creating dynamic scenes in seconds." }
               ].map((f) => (
                 <div key={f.label} className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between group">
                    <div>
                       <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">{f.label}: {f.font}</h4>
                       <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter' }}>{f.example}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-xl transition-all">
                       <Trash2 className="w-4 h-4 text-white/20 hover:text-red-500" />
                    </button>
                 </div>
               ))}
            </div>
         </section>

         {/* 3. Logos & Marks */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold">Logos & Marks</h3>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:underline">
                  <Plus className="w-3.5 h-3.5" />
                  Add Variant
               </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
               {["Full Logo", "Icon Only", "Wordmark"].map(l => (
                 <div key={l} className="p-6 rounded-3xl bg-[#161618] border border-white/5 flex flex-col items-center gap-4 group">
                    <div className="w-full aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                       <ImageIcon className="w-10 h-10 text-white/5 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{l}</span>
                 </div>
               ))}
            </div>
         </section>

         {/* 4. Motion Presets */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold">Motion Presets</h3>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:underline">
                  <Plus className="w-3.5 h-3.5" />
                  Save Preset
               </button>
            </div>
            <div className="p-8 rounded-3xl bg-[#161618] border border-white/5 space-y-3">
               {["Acme Glide (0.4s Ease)", "Bounce Entrance", "Flicker In"].map(p => (
                 <div key={p} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-amber-500/40 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Zap className="w-4 h-4" />
                       </div>
                       <span className="text-sm font-medium">{p}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Eye className="w-4 h-4 text-white/40 hover:text-white" />
                       <Trash2 className="w-4 h-4 text-white/10 hover:text-red-500" />
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>
    </div>
  );
}

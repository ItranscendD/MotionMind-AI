import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight,
  Layers,
  Save,
  Info
} from "lucide-react";

export default function BlendUI() {
  const [blend, setBlend] = useState(50);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-12">
          <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
          <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" />
            Save Blended Style
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Style Blender</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Combine the cinematic DNA of two different style profiles to create a unique hybrid look.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,auto,1fr] items-center gap-8 mb-16">
          {/* Profile A */}
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center gap-6 group hover:border-primary/50 transition-all cursor-pointer">
            <div className="aspect-square w-32 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold">Select Style A</h3>
              <p className="text-xs text-white/40 mt-1">Source DNA</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Layers className="w-6 h-6 text-white" />
             </div>
             <div className="h-32 w-px bg-gradient-to-b from-primary to-accent" />
          </div>

          {/* Profile B */}
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center gap-6 group hover:border-accent/50 transition-all cursor-pointer">
            <div className="aspect-square w-32 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold">Select Style B</h3>
              <p className="text-xs text-white/40 mt-1">Target DNA</p>
            </div>
          </div>
        </div>

        {/* Blend Slider */}
        <div className="max-w-2xl mx-auto p-12 bg-white/5 border border-white/10 rounded-[40px]">
          <div className="flex justify-between mb-8">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Style A</span>
              <span className="text-2xl font-bold">{100 - blend}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Style B</span>
              <span className="text-2xl font-bold">{blend}%</span>
            </div>
          </div>

          <input 
            type="range" 
            value={blend}
            onChange={(e) => setBlend(parseInt(e.target.value))}
            className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary mb-12"
          />

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-4">
            <Info className="w-5 h-5 text-white/20 shrink-0" />
            <p className="text-xs text-white/40 leading-relaxed italic">
              Blending interpolates between the 512-dimension vector embeddings of both styles, creating a mathematically accurate visual hybrid.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

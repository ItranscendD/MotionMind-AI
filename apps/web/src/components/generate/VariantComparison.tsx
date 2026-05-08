import React from "react";
import { Play, Maximize2, Download, CheckCircle2 } from "lucide-react";

interface Variant {
  id: string;
  url: string;
  watermark: boolean;
  traceability: string[];
}

interface VariantComparisonProps {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function VariantComparison({ variants, selectedId, onSelect }: VariantComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {variants.map((v) => (
        <div 
          key={v.id}
          onClick={() => onSelect(v.id)}
          className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
            selectedId === v.id ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]" : "border-white/10 hover:border-white/30"
          }`}
        >
          {/* Mock Video Thumbnail */}
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
             <Play className="w-12 h-12 text-white/20 group-hover:text-white transition-colors" />
          </div>

          {/* Watermark Overlay */}
          {v.watermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <span className="text-4xl font-bold uppercase tracking-[1em] -rotate-12 select-none">MotionMind</span>
            </div>
          )}

          {/* Selected Badge */}
          {selectedId === v.id && (
            <div className="absolute top-4 right-4 p-1.5 bg-primary text-white rounded-full shadow-lg animate-in zoom-in-50">
               <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-primary transition-colors border border-white/10">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-primary transition-colors border border-white/10">
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4">
             <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] font-bold text-white/60 border border-white/10 uppercase tracking-widest">
                Variant {v.id.toUpperCase()}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

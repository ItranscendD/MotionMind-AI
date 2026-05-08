import React from "react";
import { Info, Target } from "lucide-react";

interface TraceabilityPanelProps {
  traceability: string[];
}

export default function TraceabilityPanel({ traceability }: TraceabilityPanelProps) {
  const colors = [
    "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
    "bg-amber-500/20 border-amber-500/40 text-amber-300",
    "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    "bg-rose-500/20 border-rose-500/40 text-rose-300",
    "bg-sky-500/20 border-sky-500/40 text-sky-300"
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Prompt Traceability
        </h3>
        <button className="p-2 text-white/20 hover:text-white transition-colors">
          <Info className="w-4 h-4" />
        </button>
      </div>

      <p className="text-white/40 text-sm leading-relaxed">
        Hover over highlighted phrases to see which visual elements they influenced in this variant.
      </p>

      <div className="flex flex-wrap gap-3">
        {traceability.length === 0 ? (
          <div className="w-full py-8 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/10 text-xs font-bold uppercase tracking-widest">
            Select a variant to view traceability
          </div>
        ) : (
          traceability.map((word, i) => (
            <div 
              key={i} 
              className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all cursor-help hover:scale-105 ${colors[i % colors.length]}`}
            >
              {word}
            </div>
          ))
        )}
      </div>

      {traceability.length > 0 && (
        <div className="pt-6 border-t border-white/5 mt-6">
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>High Correlation Detected</span>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Sparkles, Zap, ShieldCheck, X, Check } from "lucide-react";

interface Suggestion {
  id: string;
  type: 'EASE' | 'BRAND' | 'PROMPT';
  title: string;
  desc: string;
}

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  onApply: (s: Suggestion) => void;
  onDismiss: (id: string) => void;
}

export default function SuggestionPanel({ suggestions, onApply, onDismiss }: SuggestionPanelProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 p-6 bg-[#161618] border-t border-white/5 animate-in slide-in-from-bottom duration-500 z-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
           </div>
           <div>
              <h3 className="text-sm font-bold">Proactive AI Suggestions</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Based on your recent edit</p>
           </div>
        </div>
        <button 
          onClick={() => suggestions.forEach(s => onDismiss(s.id))}
          className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((s) => (
          <div 
            key={s.id}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4 hover:border-primary/30 transition-all group"
          >
            <div className={`p-2.5 rounded-xl ${
              s.type === 'EASE' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              {s.type === 'EASE' ? <Zap className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            
            <div className="flex-1">
               <h4 className="text-xs font-bold mb-1">{s.title}</h4>
               <p className="text-[10px] text-white/40 leading-relaxed">{s.desc}</p>
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => onApply(s)}
                 className="p-1.5 bg-primary text-white rounded-lg hover:scale-110 transition-transform shadow-lg"
               >
                  <Check className="w-3.5 h-3.5" />
               </button>
               <button 
                 onClick={() => onDismiss(s.id)}
                 className="p-1.5 bg-white/5 text-white/40 rounded-lg hover:text-white transition-colors"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

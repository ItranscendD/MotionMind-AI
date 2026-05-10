import React, { useState } from "react";
import { 
  Zap, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  History, 
  ChevronDown, 
  X,
  Eye,
  RefreshCcw,
  Target
} from "lucide-react";
import { useEditor } from "@/store/EditorContext";
import { API_BASE_URL } from "@/config/api";

export default function AISuggestionPanel() {
  const { state, dispatch } = useEditor();
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleApply = (id: string) => {
    dispatch({ type: 'APPLY_FIX', suggestionId: id });
    // Trigger re-scan
    triggerScan();
  };

  const handlePreview = (id: string | null) => {
    dispatch({ type: 'PREVIEW_FIX', suggestionId: id });
  };

  const triggerScan = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sceneState: state,
          styleProfile: { palette: ['#4F46E5', '#D97706', '#0F0F11'] } // Mocked
        })
      });
      const data = await res.json();
      dispatch({ type: 'SET_SUGGESTIONS', suggestions: data.suggestions });
    } catch (err) {
      console.error("Scan failed:", err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#161618] border-l border-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Suggestions</h3>
          {state.suggestions.length > 0 && (
            <span className="px-1.5 py-0.5 bg-primary text-white text-[8px] font-bold rounded-full animate-pulse">
              {state.suggestions.length}
            </span>
          )}
        </div>
        <button onClick={triggerScan} className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors">
          <RefreshCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.suggestions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-emerald-500">All Systems Clear</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">No critical issues detected</p>
             </div>
          </div>
        ) : (
          state.suggestions.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
               {/* Severity Badge */}
               <div className="flex items-center justify-between mb-3">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    s.severity === 'WARNING' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  }`}>
                     {s.severity === 'WARNING' ? <AlertTriangle className="w-2.5 h-2.5" /> : <Lightbulb className="w-2.5 h-2.5" />}
                     {s.severity}
                  </div>
                  <button className="text-white/10 hover:text-white transition-colors">
                     <X className="w-3 h-3" />
                  </button>
               </div>

               <h4 className="text-xs font-bold mb-1">{s.title}</h4>
               <p className="text-[10px] text-white/40 leading-relaxed mb-4">{s.desc}</p>

               <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-bold text-white/60 truncate">Target: {s.layerName}</span>
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onMouseEnter={() => handlePreview(s.id)}
                    onMouseLeave={() => handlePreview(null)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60 hover:text-white transition-all"
                  >
                     <Eye className="w-3 h-3" />
                     Preview
                  </button>
                  <button 
                    onClick={() => handleApply(s.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                     Apply Fix
                  </button>
               </div>
            </div>
          ))
        )}

        {/* Suggestion History Log */}
        <div className="pt-8 mt-8 border-t border-white/5">
           <button 
             onClick={() => setHistoryOpen(!historyOpen)}
             className="w-full flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors mb-4"
           >
              <div className="flex items-center gap-2">
                 <History className="w-3 h-3" />
                 History Log
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
           </button>
           
           {historyOpen && (
             <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                {state.suggestionHistory.length === 0 ? (
                  <p className="text-[10px] text-white/10 italic text-center py-4">No history yet</p>
                ) : (
                  state.suggestionHistory.map((h: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <div>
                             <p className="text-[9px] font-bold text-white/60">{h.title}</p>
                             <p className="text-[8px] text-white/20">{h.appliedAt}</p>
                          </div>
                       </div>
                       <button className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-primary uppercase tracking-widest hover:underline">Revert</button>
                    </div>
                  ))
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

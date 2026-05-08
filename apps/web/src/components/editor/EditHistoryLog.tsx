import React from "react";
import { History, RotateCcw, Zap, Terminal } from "lucide-react";

interface EditEntry {
  id: string;
  time: string;
  instruction: string;
  opsCount: number;
}

interface EditHistoryLogProps {
  history: EditEntry[];
}

export default function EditHistoryLog({ history }: EditHistoryLogProps) {
  return (
    <div className="flex flex-col h-full bg-[#161618]">
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
        <Terminal className="w-3.5 h-3.5 text-primary" />
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Edit History</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-20">
             <History className="w-12 h-12 mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest">No AI edits yet</p>
          </div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{entry.time}</span>
                 </div>
                 <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors" title="Undo this batch">
                    <RotateCcw className="w-3 h-3" />
                 </button>
              </div>
              <p className="text-xs text-white/60 mb-3 italic">"{entry.instruction}"</p>
              <div className="flex items-center justify-between">
                 <span className="text-[8px] font-bold text-primary/60 uppercase tracking-widest px-1.5 py-0.5 bg-primary/10 rounded">
                    {entry.opsCount} Operations Applied
                 </span>
                 <button className="text-[8px] font-bold text-white/20 uppercase tracking-widest hover:text-primary transition-colors">Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

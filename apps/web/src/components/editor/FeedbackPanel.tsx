import React from "react";
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  User,
  ArrowRight,
  Filter
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  isResolved: boolean;
  type: 'TEXT' | 'MARKUP' | 'EMOJI';
}

interface FeedbackPanelProps {
  comments: Comment[];
  onJumpToFrame: (time: number) => void;
  onResolve: (id: string) => void;
}

export default function FeedbackPanel({ comments, onJumpToFrame, onResolve }: FeedbackPanelProps) {
  return (
    <div className="h-full flex flex-col bg-[#161618]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Review Feedback</h3>
        </div>
        <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors">
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest">No feedback yet</p>
          </div>
        ) : (
          comments.map((c) => (
            <div 
              key={c.id} 
              className={`p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all group ${c.isResolved ? "opacity-40 grayscale" : "hover:border-primary/30"}`}
            >
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {c.author[0]}
                     </div>
                     <span className="text-[10px] font-bold text-white/60">{c.author}</span>
                  </div>
                  <button 
                    onClick={() => onJumpToFrame(c.timestamp)}
                    className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/40 hover:text-white transition-colors"
                  >
                     <Clock className="w-2.5 h-2.5" />
                     {c.timestamp.toFixed(2)}s
                  </button>
               </div>

               <p className="text-xs text-white/80 leading-relaxed mb-4">{c.content}</p>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-primary transition-colors">Reply</button>
                     <button 
                       onClick={() => onResolve(c.id)}
                       className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${c.isResolved ? "text-emerald-500" : "text-white/20 hover:text-emerald-500"}`}
                     >
                        {c.isResolved ? "Resolved" : "Resolve"}
                     </button>
                  </div>
                  <button 
                    onClick={() => onJumpToFrame(c.timestamp)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-primary/10 text-primary rounded-lg transition-all"
                  >
                     <ArrowRight className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Approval Status Overlay */}
      <div className="p-4 border-t border-white/5 bg-primary/5">
         <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Approval Status</h4>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase rounded">Pending</span>
         </div>
         <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#161618] bg-white/10 flex items-center justify-center text-[10px] font-bold grayscale" title="Reviewer 1">R1</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#161618] bg-white/10 flex items-center justify-center text-[10px] font-bold grayscale" title="Reviewer 2">R2</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#161618] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white" title="Approved by Stakeholder">SH</div>
         </div>
         <p className="text-[9px] text-white/20 mt-4 leading-relaxed">Export is locked until all required approvers sign off.</p>
      </div>
    </div>
  );
}

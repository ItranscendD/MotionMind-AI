import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { useEditor } from "@/store/EditorContext";
import { API_BASE_URL } from "@/config/api";

interface EditBarProps {
  onOpsApplied: (ops: any[], suggestions: any[]) => void;
}

export default function EditBar({ onOpsApplied }: EditBarProps) {
  const { state, dispatch } = useEditor();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clarification, setClarification] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setClarification(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          instruction: input,
          projectId: "current",
          sceneState: state
        })
      });
      const data = await res.json();

      if (data.clarify) {
        setClarification(data.question);
        setIsProcessing(false);
        return;
      }

      // Apply ops sequentially with 50ms delay
      for (const op of data.ops) {
        await applyOp(op);
        await new Promise(r => setTimeout(r, 50));
      }

      onOpsApplied(data.ops, data.suggestions || []);
      setInput("");
    } catch (err) {
      console.error("AI Edit failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyOp = async (op: any) => {
    // Visual feedback: Flash layer
    if (op.layerId !== 'all') {
      dispatch({ type: 'FLASH_LAYER', id: op.layerId });
      setTimeout(() => dispatch({ type: 'FLASH_LAYER', id: null }), 300);
    }

    switch (op.op) {
      case 'SET_PROPERTY': {
        const [prop, field] = op.property.split('.');
        if (field) {
           // Handle nested style properties
           const layer = state.layers.find(l => l.id === op.layerId);
           if (layer) {
             const newStyle = { ...layer.style, [field]: op.value };
             dispatch({ type: 'UPDATE_LAYER', id: op.layerId, updates: { style: newStyle } });
           }
        } else {
           dispatch({ type: 'UPDATE_LAYER', id: op.layerId, updates: { [op.property]: op.value } });
        }
        break;
      }
      case 'DELETE_LAYER':
        dispatch({ type: 'DELETE_LAYER', id: op.layerId });
        break;
      case 'MOVE_KEYFRAME':
        // Simplified move logic
        break;
      case 'SET_EASE':
        // Simplified ease logic
        break;
    }
  };

  return (
    <div className="relative w-full">
      {/* Clarification Bubble */}
      {clarification && (
        <div className="absolute bottom-full left-6 mb-4 animate-in slide-in-from-bottom-2 duration-300">
           <div className="bg-primary p-4 rounded-2xl rounded-bl-none shadow-xl border border-white/20 max-w-sm relative">
              <div className="flex gap-3">
                 <HelpCircle className="w-5 h-5 text-white/60 shrink-0" />
                 <p className="text-xs font-medium text-white leading-relaxed">{clarification}</p>
              </div>
              <div className="absolute top-full left-0 w-4 h-4 bg-primary [clip-path:polygon(0_0,0_100%,100%_0)]" />
           </div>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className={`h-12 px-6 flex items-center gap-4 transition-all ${
          isProcessing ? "bg-primary/10" : "bg-primary/5"
        }`}
      >
        <MessageSquare className={`w-4 h-4 ${isProcessing ? "text-primary animate-pulse" : "text-primary"}`} />
        <input 
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "AI is thinking..." : "Tell me what to change... (e.g. Make everything white)"}
          className="bg-transparent text-xs outline-none w-full placeholder:text-primary/40 text-primary font-medium"
          disabled={isProcessing}
        />
        <div className="flex items-center gap-4">
           {input && !isProcessing && (
             <button type="submit" className="p-1.5 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Send className="w-3.5 h-3.5" />
             </button>
           )}
           <div className="h-4 w-px bg-primary/20" />
           <div className="flex items-center gap-2 shrink-0">
              <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest px-1.5 py-0.5 border border-primary/20 rounded">AI ASSISTANT</span>
           </div>
        </div>
      </form>
    </div>
  );
}

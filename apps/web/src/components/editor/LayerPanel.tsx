import React from "react";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Type, 
  Square, 
  Image as ImageIcon,
  MoreVertical,
  Plus,
  ChevronDown,
  Grab
} from "lucide-react";
import { useEditor } from "@/store/EditorContext";
import type { Layer } from "@/store/EditorContext";

export default function LayerPanel() {
  const { state, dispatch } = useEditor();

  const toggleVisibility = (id: string, visible: boolean) => {
    dispatch({ type: 'UPDATE_LAYER', id, updates: { visible: !visible } });
  };

  const toggleLock = (id: string, locked: boolean) => {
    dispatch({ type: 'UPDATE_LAYER', id, updates: { locked: !locked } });
  };

  return (
    <div className="h-full flex flex-col bg-[#161618] border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
          <ChevronDown className="w-3 h-3" />
          Layers ({state.layers.length})
        </h3>
        <button className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {state.layers.map((layer) => (
          <div 
            key={layer.id}
            onClick={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
            className={`group flex items-center gap-3 px-4 py-2 cursor-pointer transition-all ${
              state.selectedLayerId === layer.id ? "bg-primary/20" : "hover:bg-white/5"
            } ${state.flashLayerId === layer.id ? "animate-flash-indigo" : ""}`}
          >
            <Grab className="w-3 h-3 text-white/10 group-hover:text-white/40 cursor-grab" />
            
            <button 
              onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id, layer.visible); }}
              className={`p-1 rounded transition-colors ${layer.visible ? "text-white/60 hover:text-white" : "text-white/10 hover:text-white/40"}`}
            >
              {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); toggleLock(layer.id, layer.locked); }}
              className={`p-1 rounded transition-colors ${layer.locked ? "text-primary" : "text-white/10 hover:text-white/40"}`}
            >
              {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            <div className="w-px h-4 bg-white/5 mx-1" />

            <div className={`p-1.5 rounded-lg ${
              layer.type === 'text' ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"
            }`}>
              {layer.type === 'text' ? <Type className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            </div>

            <span className={`text-[11px] font-medium truncate flex-1 ${
              state.selectedLayerId === layer.id ? "text-white" : "text-white/60"
            }`}>
              {layer.name}
            </span>

            <button className="p-1 opacity-0 group-hover:opacity-100 text-white/20 hover:text-white transition-all">
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
         <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <span>Blend Mode</span>
            <span className="text-white/40">Normal</span>
         </div>
      </div>
    </div>
  );
}

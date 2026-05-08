import React from "react";
import { 
  Settings2, 
  Maximize, 
  Type, 
  Palette, 
  Sparkles, 
  Plus,
  ChevronDown,
  Info
} from "lucide-react";
import { useEditor } from "@/store/EditorContext";

export default function PropertyInspector() {
  const { state, dispatch } = useEditor();
  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);

  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#161618]">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 mb-4">
          <Settings2 className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">No Layer Selected</h4>
        <p className="text-[10px] text-white/20 leading-relaxed">
          Select a layer from the timeline or layer panel to edit its properties.
        </p>
      </div>
    );
  }

  const updateProp = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_LAYER', id: selectedLayer.id, updates: { [prop]: value } });
  };

  return (
    <div className="h-full flex flex-col bg-[#161618] border-l border-white/5 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
          <Settings2 className="w-3 h-3 text-primary" />
          Properties: {selectedLayer.name}
        </h3>
        <Info className="w-3 h-3 text-white/20" />
      </div>

      {/* Transform Section */}
      <section className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <Maximize className="w-3.5 h-3.5 text-white/40" />
          <h4 className="text-xs font-bold text-white/60">Transform</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase">Position X</label>
            <input 
              type="number" 
              value={selectedLayer.x}
              onChange={(e) => updateProp('x', parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase">Position Y</label>
            <input 
              type="number" 
              value={selectedLayer.y}
              onChange={(e) => updateProp('y', parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase">Rotation</label>
            <input 
              type="number" 
              value={selectedLayer.rotation}
              onChange={(e) => updateProp('rotation', parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase">Scale</label>
            <input 
              type="number" 
              step="0.1"
              value={selectedLayer.scale}
              onChange={(e) => updateProp('scale', parseFloat(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Style Section */}
      {selectedLayer.type === 'text' && (
        <section className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Type className="w-3.5 h-3.5 text-white/40" />
            <h4 className="text-xs font-bold text-white/60">Text Style</h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase">Content</label>
              <textarea 
                value={selectedLayer.content}
                onChange={(e) => updateProp('content', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-primary/50 min-h-[80px] resize-none"
              />
            </div>
          </div>
        </section>
      )}

      {/* Effects Section */}
      <section className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white/40" />
            <h4 className="text-xs font-bold text-white/60">Effects</h4>
          </div>
          <button className="p-1 hover:bg-white/5 rounded text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
           <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
                 <span className="text-[11px] font-medium">Gaussian Blur</span>
              </div>
              <ChevronDown className="w-3 h-3 text-white/10 group-hover:text-white/40 transition-all" />
           </div>
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 text-center">
           <Sparkles className="w-5 h-5 text-primary/40" />
           <p className="text-[9px] text-primary/40 font-bold uppercase tracking-widest">Add AI-driven Effect</p>
        </div>
      </section>
    </div>
  );
}

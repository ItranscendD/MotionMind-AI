import React, { useRef, useEffect } from "react";
import { 
  Clock, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  Play
} from "lucide-react";
import { useEditor } from "@/store/EditorContext";

export default function Timeline() {
  const { state, dispatch } = useEditor();
  const [showGraph, setShowGraph] = React.useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 100; // Zoom factor
  const totalWidth = state.duration * pixelsPerSecond;

  const handleScrub = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const time = x / pixelsPerSecond;
    dispatch({ type: 'SET_TIME', time });
  };

  return (
    <div className="h-full flex flex-col bg-[#161618]">
      {/* Timeline Header */}
      <div className="h-10 border-b border-white/5 flex items-center bg-[#1c1c1e]">
        <div className="w-60 border-r border-white/5 px-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Timeline
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowGraph(!showGraph)}
              className={`p-1 rounded transition-colors ${showGraph ? "bg-primary text-white" : "text-white/20 hover:text-white"}`}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <ZoomOut className="w-3 h-3 text-white/20 hover:text-white cursor-pointer" />
            <ZoomIn className="w-3 h-3 text-white/20 hover:text-white cursor-pointer" />
          </div>
        </div>
        
        <div 
          ref={timelineRef}
          className="flex-1 relative overflow-hidden h-full cursor-pointer group"
          onMouseDown={handleScrub}
        >
          {/* Ruler */}
          <div className="absolute inset-0 flex" style={{ width: totalWidth }}>
            {Array.from({ length: state.duration + 1 }).map((_, i) => (
              <div 
                key={i} 
                className="h-full border-l border-white/5 relative"
                style={{ width: pixelsPerSecond }}
              >
                <span className="absolute top-1 left-1 text-[8px] font-mono text-white/20">{i}s</span>
                <div className="absolute bottom-0 left-0 w-px h-2 bg-white/5" />
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-primary z-10 pointer-events-none"
            style={{ left: state.currentTime * pixelsPerSecond }}
          >
            <div className="w-3 h-3 bg-primary rounded-sm -ml-1.5 mt-0 flex items-center justify-center">
               <div className="w-0.5 h-1.5 bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto">
        {state.layers.map((layer) => (
          <div key={layer.id} className="flex h-8 border-b border-white/5 group">
            <div className={`w-60 border-r border-white/5 px-8 flex items-center gap-2 transition-colors ${
              state.selectedLayerId === layer.id ? "bg-primary/5" : ""
            }`}>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <span className={`text-[10px] font-medium truncate ${
                state.selectedLayerId === layer.id ? "text-primary" : "text-white/40"
              }`}>
                {layer.name}
              </span>
            </div>
            
            <div className="flex-1 relative bg-black/10 overflow-hidden" style={{ width: totalWidth }}>
              {/* Track Content */}
              <div className="absolute inset-0 flex items-center px-4">
                 <div className="h-1 w-full bg-white/5 rounded-full" />
              </div>

              {/* Mock Keyframes */}
              {Object.entries(layer.keyframes).map(([prop, kfs]) => (
                 kfs.map(kf => (
                   <div 
                     key={kf.id}
                     className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-primary rotate-45 border border-white/20 cursor-pointer hover:scale-125 transition-transform shadow-lg"
                     style={{ left: kf.time * pixelsPerSecond }}
                     title={`${prop}: ${kf.value}`}
                   />
                 ))
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Graph Editor Placeholder */}
      {showGraph && (
        <div className="h-32 border-t border-white/5 bg-black/40 relative overflow-hidden animate-in slide-in-from-bottom duration-300">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                    <Maximize2 className="w-4 h-4" />
                 </div>
                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Bezier Graph Editor Active</span>
              </div>
           </div>
           <svg className="w-full h-full opacity-20">
              <path d="M 0 128 C 200 128, 400 0, 800 0" stroke="currentColor" fill="none" strokeWidth="2" className="text-primary" />
           </svg>
        </div>
      )}
      
      {/* Bottom Status */}
      <div className="h-6 px-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <span className="text-[8px] font-mono text-white/20">30 FPS</span>
           <span className="text-[8px] font-mono text-white/20">1080P</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Auto-saved 2s ago</span>
         </div>
      </div>
    </div>
  );
}

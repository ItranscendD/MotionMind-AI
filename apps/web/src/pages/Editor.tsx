import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Panel, 
  Group, 
  Separator 
} from "react-resizable-panels";
import { 
  Layers, 
  Settings2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Plus,
  Type,
  Square,
  Sparkles,
  Share2,
  Download,
  Save,
  MessageSquare,
  Zap
} from "lucide-react";
import { EditorProvider, useEditor } from "@/store/EditorContext";
import Canvas from "@/components/editor/Canvas";
import LayerPanel from "@/components/editor/LayerPanel";
import Timeline from "@/components/editor/Timeline";
import PropertyInspector from "@/components/editor/PropertyInspector";
import EditBar from "@/components/editor/EditBar";
import SuggestionPanel from "@/components/editor/SuggestionPanel";
import EditHistoryLog from "@/components/editor/EditHistoryLog";
import AISuggestionPanel from "@/components/editor/AISuggestionPanel";
import FeedbackPanel from "@/components/editor/FeedbackPanel";
import ReviewLinkModal from "@/components/editor/ReviewLinkModal";
import ExportModal from "@/components/editor/ExportModal";
import DeliveryPanel from "@/components/editor/DeliveryPanel";
import UpsellModal from "@/components/common/UpsellModal";

function EditorContent() {
  const { state, dispatch } = useEditor();
  const [rightTab, setRightTab] = useState<"props" | "history" | "suggestions" | "feedback">("props");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeliveryPanel, setShowDeliveryPanel] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState<string | null>(null);
  
  const [projectStatus, setProjectStatus] = useState<"DRAFT" | "IN_REVIEW" | "APPROVED">("APPROVED"); // Mocked for demo
  const [exportJob, setExportJob] = useState<{ id: string; progress: number; status: string; assets: any[] } | null>(null);
  
  const [aiHistory, setAiHistory] = useState<any[]>([]);
  const [reviewComments, setReviewComments] = useState<any[]>([
    { id: '1', authorName: 'Alex', content: 'Timing is slightly off here.', timestamp: 2500, isResolved: false, type: 'TEXT' }
  ]);

  const idleTimerRef = useRef<any>(null);

  const handleExportStart = async (formats: string[], resolution: string) => {
    setShowExportModal(false);
    
    // API Call (mock plan check)
    if (resolution === '4K') {
      setShowUpsellModal("4K Export");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: "proj_123", formats, resolution, plan: "FREE" })
      });
      const data = await res.json();
      setExportJob({ id: data.jobId, progress: 0, status: 'queued', assets: [] });
      
      // Start polling for progress (simulated SSE)
      const poll = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:3001/api/export/${data.jobId}/status`);
        const statusData = await statusRes.json();
        
        setExportJob(prev => prev ? { ...prev, progress: statusData.progress, status: statusData.state } : null);
        
        if (statusData.state === 'completed') {
          clearInterval(poll);
          setExportJob(prev => prev ? { ...prev, assets: statusData.result.assets } : null);
          setShowDeliveryPanel(true);
        }
      }, 1000);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const triggerScan = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sceneState: state,
          styleProfile: { palette: ['#4F46E5', '#D97706', '#0F0F11'] }
        })
      });
      const data = await res.json();
      dispatch({ type: 'SET_SUGGESTIONS', suggestions: data.suggestions });
      if (data.suggestions.length > 0) setRightTab("suggestions");
    } catch (err) {
      console.error("Idle scan failed:", err);
    }
  }, [state, dispatch]);

  useEffect(() => {
    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(triggerScan, 300000); // 5 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [triggerScan]);

  const handleOpsApplied = (ops: any[], newSuggestions: any[]) => {
    dispatch({ type: 'SET_SUGGESTIONS', suggestions: newSuggestions });
    const entry = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instruction: "Applied AI Instruction",
      opsCount: ops.length
    };
    setAiHistory([entry, ...aiHistory]);
  };

  return (
    <div className="h-screen bg-[#0F0F11] text-white flex flex-col overflow-hidden">
      {/* ... header ... */}
      <header className="h-14 border-b border-white/5 px-4 flex items-center justify-between bg-[#161618]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <input 
              defaultValue="Untitled Motion Project" 
              className="bg-transparent font-bold text-sm outline-none hover:bg-white/5 px-2 py-1 rounded transition-all focus:bg-white/10"
            />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white" title="Text Tool">
              <Type className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white" title="Shape Tool">
              <Square className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary hover:bg-primary/20 transition-all">
               <Zap className="w-3 h-3" />
               Auto-Animate
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#161618] bg-primary flex items-center justify-center text-[10px] font-bold">JD</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#161618] bg-accent flex items-center justify-center text-[10px] font-bold text-black">AI</div>
          </div>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button 
            disabled={projectStatus !== 'APPROVED'}
            onClick={() => setShowExportModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              projectStatus === 'APPROVED' 
              ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
              : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed shadow-none"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showShareModal && (
        <ReviewLinkModal 
          onClose={() => setShowShareModal(false)}
          projectId="proj_123"
        />
      )}

      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)}
          onExportStart={handleExportStart}
        />
      )}

      {showDeliveryPanel && exportJob && (
        <DeliveryPanel 
          assets={exportJob.assets}
          onClose={() => {
            setShowDeliveryPanel(false);
            setExportJob(null);
          }}
        />
      )}

      {showUpsellModal && (
        <UpsellModal 
          feature={showUpsellModal}
          onClose={() => setShowUpsellModal(null)}
        />
      )}

      {/* Floating Export Progress */}
      {exportJob && !showDeliveryPanel && (
        <div className="fixed bottom-32 right-8 z-[130] w-72 bg-[#161618] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-right duration-500">
           <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Download className="w-3.5 h-3.5 animate-bounce" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Rendering Scene...</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-primary">{exportJob.progress}%</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${exportJob.progress}%` }} />
           </div>
        </div>
      )}

      {/* Main Workspace */}
      <Group orientation="vertical" className="flex-1">
        <Panel defaultSize={70}>
          <Group orientation="horizontal">
            {/* Left: Layer Panel */}
            <Panel defaultSize={15} minSize={10} collapsible={true}>
              <LayerPanel />
            </Panel>
            
            <Separator className="w-px bg-white/5 hover:bg-primary/50 transition-colors" />
            
            {/* Centre: Canvas */}
            <Panel defaultSize={65}>
              <div className="h-full flex flex-col bg-black/20">
                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                  <Canvas />
                </div>
                {/* Transport Controls */}
                <div className="h-12 border-t border-white/5 bg-[#161618] flex items-center justify-center gap-4">
                  <button onClick={() => dispatch({ type: 'SET_TIME', time: 0 })} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}
                    className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                  >
                    {state.isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </button>
                  <button onClick={() => dispatch({ type: 'SET_TIME', time: state.duration })} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest">
                    {state.currentTime.toFixed(2)}s / {state.duration.toFixed(2)}s
                  </span>
                </div>
              </div>
            </Panel>
            
            <Separator className="w-px bg-white/5 hover:bg-primary/50 transition-colors" />
            
            {/* Right: Property Inspector / AI History / Suggestions */}
            <Panel defaultSize={20} minSize={15} collapsible={true}>
              <div className="h-full flex flex-col bg-[#161618] border-l border-white/5">
                <div className="flex bg-black/40 p-1 mx-4 mt-4 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setRightTab("props")}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${rightTab === "props" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Props
                  </button>
                  <button 
                    onClick={() => setRightTab("history")}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${rightTab === "history" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                  >
                    History
                  </button>
                  <button 
                    onClick={() => setRightTab("suggestions")}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all relative ${rightTab === "suggestions" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                  >
                    AI
                    {state.suggestions.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#161618]" />
                    )}
                  </button>
                  <button 
                    onClick={() => setRightTab("feedback")}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all relative ${rightTab === "feedback" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Review
                    {reviewComments.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161618]" />
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {rightTab === "props" && <PropertyInspector />}
                  {rightTab === "history" && <EditHistoryLog history={aiHistory} />}
                  {rightTab === "suggestions" && <AISuggestionPanel />}
                  {rightTab === "feedback" && (
                    <FeedbackPanel 
                      comments={reviewComments} 
                      onJumpToFrame={(time) => dispatch({ type: 'SET_TIME', time })}
                      onResolve={(id) => setReviewComments(reviewComments.map(c => c.id === id ? { ...c, isResolved: true } : c))}
                    />
                  )}
                </div>
              </div>
            </Panel>
          </Group>
        </Panel>

        <Separator className="h-px bg-white/5 hover:bg-primary/50 transition-colors" />

        {/* Bottom: Timeline */}
        <Panel defaultSize={30} minSize={20} collapsible={true}>
          <div className="h-full flex flex-col bg-[#161618] relative">
            <SuggestionPanel 
              suggestions={state.suggestions}
              onApply={(s) => {
                dispatch({ type: 'APPLY_FIX', suggestionId: s.id });
              }}
              onDismiss={(id) => dispatch({ type: 'SET_SUGGESTIONS', suggestions: state.suggestions.filter(x => x.id !== id) })}
            />
            <EditBar onOpsApplied={handleOpsApplied} />
            <div className="flex-1 overflow-hidden">
               <Timeline />
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}

export default function Editor() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}

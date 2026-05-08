import React, { useState } from "react";
import { 
  X, 
  Download, 
  Zap, 
  Settings, 
  Check, 
  Lock, 
  Plus,
  Play,
  Monitor,
  Smartphone,
  Code,
  HardDrive,
  Cloud
} from "lucide-react";

interface ExportModalProps {
  onClose: () => void;
  onExportStart: (formats: string[], resolution: string) => void;
}

export default function ExportModal({ onClose, onExportStart }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<"web" | "pro" | "dev">("web");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["MP4"]);
  const [resolution, setResolution] = useState("1080p");
  const [fps, setFps] = useState("30");

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const tabs = [
    { id: "web", label: "Web & Social", icon: <Smartphone className="w-4 h-4" /> },
    { id: "pro", label: "Professional", icon: <Monitor className="w-4 h-4" /> },
    { id: "dev", label: "Developer", icon: <Code className="w-4 h-4" /> }
  ];

  const formats = {
    web: [
      { id: "MP4", label: "MP4 (H.264)", plan: "Free", desc: "Best for sharing" },
      { id: "GIF", label: "Animated GIF", plan: "Free", desc: "Looping reactions" },
      { id: "WebM", label: "WebM", plan: "Pro", desc: "Transparent video" }
    ],
    pro: [
      { id: "PRORES", label: "Apple ProRes", plan: "Pro", desc: "Lossless quality" },
      { id: "PNG_SEQ", label: "PNG Sequence", plan: "Pro", desc: "VFX pipeline" },
      { id: "AEP", label: "AE Project", plan: "Enterprise", desc: "Source project" }
    ],
    dev: [
      { id: "LOTTIE", label: "Lottie JSON", plan: "Pro", desc: "Web & App motion" },
      { id: "SVG", label: "SVG + CSS", plan: "Free", desc: "Lightweight vector" }
    ]
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
      <div className="max-w-4xl w-full bg-[#161618] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex">
        
        {/* Left: Settings Sidebar */}
        <div className="w-72 border-r border-white/5 bg-black/20 p-8 space-y-8">
           <div className="flex items-center gap-3 text-white/40 mb-2">
              <Settings className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Global Settings</h3>
           </div>
           
           <div className="space-y-4">
              <div>
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Resolution</label>
                 <select 
                   value={resolution}
                   onChange={(e) => setResolution(e.target.value)}
                   className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs outline-none focus:border-primary/50"
                 >
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="4K">4K (Ultra HD)</option>
                 </select>
              </div>
              <div>
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-2">Frame Rate</label>
                 <select 
                   value={fps}
                   onChange={(e) => setFps(e.target.value)}
                   className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs outline-none focus:border-primary/50"
                 >
                    <option value="24">24 fps (Film)</option>
                    <option value="30">30 fps (Web)</option>
                    <option value="60">60 fps (Smooth)</option>
                 </select>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Presets</h4>
                 <Plus className="w-3 h-3 text-primary cursor-pointer hover:scale-125 transition-transform" />
              </div>
              <div className="space-y-2">
                 {["Instagram Story", "YouTube 4K", "Lottie Web"].map(p => (
                   <div key={p} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-medium text-white/60 hover:border-primary/40 cursor-pointer transition-all">
                      {p}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Format Selection */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
             <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
                    }`}
                  >
                     {tab.icon}
                     {tab.label}
                  </button>
                ))}
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
             {formats[activeTab].map(f => (
               <div 
                 key={f.id}
                 onClick={() => toggleFormat(f.id)}
                 className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                   selectedFormats.includes(f.id) ? "bg-primary/5 border-primary shadow-lg shadow-primary/10" : "bg-white/5 border-white/10 hover:border-white/30"
                 }`}
               >
                  <div className="flex items-center justify-between mb-2">
                     <h4 className="text-sm font-bold">{f.label}</h4>
                     {f.plan !== "Free" && (
                       <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-bold uppercase">
                          <Lock className="w-2.5 h-2.5" />
                          {f.plan}
                       </div>
                     )}
                  </div>
                  <p className="text-[10px] text-white/40">{f.desc}</p>
                  {selectedFormats.includes(f.id) && (
                    <div className="absolute top-4 right-4 text-primary">
                       <Check className="w-4 h-4" />
                    </div>
                  )}
               </div>
             ))}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 bg-black/20 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                   Selected: {selectedFormats.length} formats
                </div>
                {selectedFormats.length > 0 && (
                   <div className="flex -space-x-2">
                      {selectedFormats.map(f => (
                        <div key={f} className="px-2 py-1 bg-primary text-white text-[8px] font-bold rounded-lg border-2 border-[#161618]">
                           {f}
                        </div>
                      ))}
                   </div>
                )}
             </div>
             <button 
               onClick={() => onExportStart(selectedFormats, resolution)}
               className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
             >
                <Zap className="w-5 h-5" />
                Start Render Queue
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { 
  Library as LibraryIcon, 
  Search, 
  Filter, 
  Upload, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Zap, 
  Download, 
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Shield,
  Clock
} from "lucide-react";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"logos" | "fonts" | "colors" | "presets" | "exports">("logos");
  
  const tabs = [
    { id: "logos", label: "Logos", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "fonts", label: "Fonts", icon: <Type className="w-4 h-4" /> },
    { id: "colors", label: "Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "presets", label: "Presets", icon: <Zap className="w-4 h-4" /> },
    { id: "exports", label: "Exports", icon: <Download className="w-4 h-4" /> }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F11]">
      {/* Header */}
      <header className="p-8 pb-0">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                  <LibraryIcon className="w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-2xl font-bold">Shared Asset Library</h1>
                  <p className="text-white/40 text-sm">Centralized resources for your organization.</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    placeholder="Search assets..." 
                    className="w-64 h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-xs outline-none focus:border-primary/50 transition-all"
                  />
               </div>
               <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <Upload className="w-4 h-4" />
                  Upload Asset
               </button>
            </div>
         </div>

         {/* Tabs */}
         <div className="flex gap-8 border-b border-white/5">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 text-xs font-bold transition-all relative ${
                  activeTab === tab.id ? "text-primary" : "text-white/40 hover:text-white"
                }`}
              >
                 {tab.icon}
                 {tab.label}
                 {activeTab === tab.id && (
                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                 )}
              </button>
            ))}
         </div>
      </header>

      {/* Grid Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60 hover:text-white transition-all">
                  <Filter className="w-3.5 h-3.5" />
                  Filter: All Teams
               </button>
               <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Showing 24 Assets</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* New Asset Card */}
            <div className="aspect-square rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/[0.02] cursor-pointer transition-all group">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Plus className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-white/20 group-hover:text-white transition-all">Add New {activeTab.slice(0, -1)}</span>
            </div>

            {/* Mock Assets */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-3xl bg-[#161618] border border-white/5 overflow-hidden flex flex-col group hover:border-primary/40 transition-all">
                 <div className="flex-1 bg-black/40 flex items-center justify-center relative p-6">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-center">
                       {activeTab === 'logos' && <ImageIcon className="w-10 h-10 text-white/10" />}
                       {activeTab === 'fonts' && <span className="text-4xl font-serif text-white/20">Aa</span>}
                       {activeTab === 'colors' && <div className="w-16 h-16 rounded-full bg-primary shadow-xl" />}
                       {activeTab === 'presets' && <Zap className="w-10 h-10 text-primary animate-pulse" />}
                       {activeTab === 'exports' && <Play className="w-10 h-10 text-emerald-500" />}
                    </div>
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                       <button className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5" />
                       </button>
                       <button className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                          <Download className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
                 <div className="p-4 bg-black/20">
                    <div className="flex items-center justify-between mb-1">
                       <h4 className="text-xs font-bold truncate">Asset Name {i}</h4>
                       <MoreHorizontal className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white" />
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                       <Shield className="w-2.5 h-2.5" />
                       Workspace
                       <div className="w-1 h-1 rounded-full bg-white/10" />
                       <Clock className="w-2.5 h-2.5" />
                       2d ago
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function Play(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

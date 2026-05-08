import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Library, 
  Settings, 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Plus, 
  Hash, 
  Sparkles,
  Search,
  MoreVertical
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function WorkspaceSidebar() {
  const location = useLocation();
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [activeTeam, setActiveTeam] = useState("t1");

  const teams = [
    { id: "t1", name: "Creative Team", projects: 12 },
    { id: "t2", name: "Marketing", projects: 8 },
    { id: "t3", name: "Social Media", projects: 5 }
  ];

  const mainNav = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: "/dashboard" },
    { label: "Asset Library", icon: <Library className="w-4 h-4" />, path: "/library" },
    { label: "Brand Kit", icon: <Sparkles className="w-4 h-4" />, path: "/settings/brand" },
    { label: "Admin Panel", icon: <Shield className="w-4 h-4" />, path: "/settings/admin" }
  ];

  return (
    <aside className="w-64 h-screen bg-[#161618] border-r border-white/5 flex flex-col overflow-hidden">
      {/* Org Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
               <Sparkles className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-sm font-bold">Acme Corp</h2>
               <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Workspace</p>
            </div>
         </div>
         <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
         {/* Main Navigation */}
         <nav className="space-y-1">
            {mainNav.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === item.path ? "bg-primary/10 text-primary" : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                 <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                 </div>
              </Link>
            ))}
         </nav>

         {/* Teams Section */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
               <button 
                 onClick={() => setTeamsOpen(!teamsOpen)}
                 className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors"
               >
                  {teamsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  Teams
               </button>
               <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors">
                  <Plus className="w-3 h-3" />
               </button>
            </div>

            {teamsOpen && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                 {teams.map((team) => (
                   <button 
                     key={team.id}
                     onClick={() => setActiveTeam(team.id)}
                     className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs transition-all ${
                       activeTeam === team.id ? "bg-white/5 text-white font-bold" : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                     }`}
                   >
                      <div className="flex items-center gap-3">
                         <Hash className={`w-3.5 h-3.5 ${activeTeam === team.id ? "text-primary" : "text-white/10"}`} />
                         {team.name}
                      </div>
                      <span className="text-[10px] font-mono text-white/10">{team.projects}</span>
                   </button>
                 ))}
              </div>
            )}
         </div>

         {/* Projects Quick Access */}
         <div className="space-y-4">
            <h3 className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Recent Projects</h3>
            <div className="space-y-1">
               {["Hype Launch", "Acme Brand Intro", "Q4 Explainer"].map(p => (
                 <div key={p} className="flex items-center justify-between px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       {p}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Workspace Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20">
         <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-black">JD</div>
               <div>
                  <h4 className="text-[11px] font-bold">John Doe</h4>
                  <p className="text-[9px] text-white/20">Admin Role</p>
               </div>
            </div>
            <MoreVertical className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
         </div>
      </div>
    </aside>
  );
}

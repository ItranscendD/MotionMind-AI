import React, { useState } from "react";
import { 
  Shield, 
  BarChart3, 
  CreditCard, 
  FileText, 
  HardDrive, 
  Key, 
  CheckCircle2, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  RefreshCcw,
  Search,
  MoreVertical,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"sso" | "analytics" | "billing" | "audit" | "storage" | "api">("analytics");

  const analyticsData = [
    { name: 'Mon', gen: 400, exp: 240 },
    { name: 'Tue', gen: 300, exp: 139 },
    { name: 'Wed', gen: 200, exp: 980 },
    { name: 'Thu', gen: 278, exp: 390 },
    { name: 'Fri', gen: 189, exp: 480 },
    { name: 'Sat', gen: 239, exp: 380 },
    { name: 'Sun', gen: 349, exp: 430 },
  ];

  const storageData = [
    { name: 'Videos', value: 40, color: '#4F46E5' },
    { name: 'Assets', value: 30, color: '#D97706' },
    { name: 'Exports', value: 20, color: '#10B981' },
    { name: 'Free', value: 10, color: '#1F1F23' },
  ];

  const tabs = [
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "sso", label: "SSO / SAML", icon: <Shield className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
    { id: "audit", label: "Audit Log", icon: <FileText className="w-4 h-4" /> },
    { id: "storage", label: "Storage", icon: <HardDrive className="w-4 h-4" /> },
    { id: "api", label: "API Keys", icon: <Key className="w-4 h-4" /> }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F11] overflow-hidden">
      <header className="p-12 pb-0">
         <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-2xl">
               <Shield className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-3xl font-bold">Admin Console</h1>
               <p className="text-white/40 text-sm">Organizational oversight and security controls.</p>
            </div>
         </div>

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

      <div className="flex-1 p-12 overflow-y-auto">
         {activeTab === 'analytics' && (
           <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: "Total Generations", value: "12,482", delta: "+14%" },
                   { label: "Active Seats", value: "48 / 50", delta: "2 empty" },
                   { label: "Monthly Exports", value: "2,103", delta: "+8%" },
                   { label: "Avg Render Time", value: "42s", delta: "-5s" }
                 ].map(stat => (
                   <div key={stat.label} className="p-8 rounded-3xl bg-[#161618] border border-white/5 shadow-2xl">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="flex items-end justify-between">
                         <h3 className="text-2xl font-bold">{stat.value}</h3>
                         <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded-lg">{stat.delta}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-10 rounded-[3rem] bg-[#161618] border border-white/5 shadow-2xl">
                 <div className="flex items-center justify-between mb-12">
                    <div>
                       <h3 className="text-lg font-bold">Generation vs Export Velocity</h3>
                       <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Last 7 Days Activity</p>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                       Full Report
                       <ArrowUpRight className="w-3 h-3" />
                    </button>
                 </div>
                 <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 10}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 10}} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#1F1F23', border: '1px solid #ffffff10', borderRadius: '16px'}}
                            itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                          />
                          <Line type="monotone" dataKey="gen" stroke="#4F46E5" strokeWidth={4} dot={false} activeDot={{r: 8}} />
                          <Line type="monotone" dataKey="exp" stroke="#D97706" strokeWidth={4} dot={false} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'sso' && (
           <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 flex gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold mb-2">Enable Single Sign-On (SSO)</h3>
                    <p className="text-xs text-white/40 leading-relaxed mb-4">SSO allows your team to log in using your company Identity Provider (e.g., Okta, Azure AD, Google Workspace). Enterprise plan required.</p>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all">Configure SAML</button>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Configuration</h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">SSO Provider Name</label>
                       <input placeholder="e.g. Okta" className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs outline-none focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">IDP Metadata URL</label>
                       <input placeholder="https://..." className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs outline-none focus:border-primary/50" />
                    </div>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'api' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-bold">API Management</h3>
                    <p className="text-white/40 text-sm">Generate keys for external integrations and automations.</p>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all shadow-xl">
                    <Plus className="w-4 h-4" />
                    Generate New Key
                 </button>
              </div>

              <div className="p-8 rounded-[2rem] bg-[#161618] border border-white/5 space-y-6">
                 {[
                   { name: "Production Zapier", key: "mm_live_827...x92", status: "Active", created: "Oct 12, 2026" },
                   { name: "Dev Testing", key: "mm_test_123...k81", status: "Active", created: "Nov 02, 2026" }
                 ].map(k => (
                   <div key={k.name} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                            <Key className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-xs font-bold">{k.name}</h4>
                            <p className="text-[10px] font-mono text-white/20 mt-1">{k.key}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{k.status}</p>
                            <p className="text-[9px] text-white/20 mt-1">{k.created}</p>
                         </div>
                         <MoreVertical className="w-4 h-4 text-white/20 cursor-pointer hover:text-white" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'storage' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-10 rounded-[3rem] bg-[#161618] border border-white/5 shadow-2xl">
                 <h3 className="text-lg font-bold mb-12">Storage Utilization</h3>
                 <div className="flex gap-4 mb-8">
                    {storageData.map(d => (
                      <div key={d.name} className="h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white/60" style={{ width: `${d.value}%`, backgroundColor: d.color }}>
                         {d.value}%
                      </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {storageData.map(d => (
                      <div key={d.name} className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                         <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{d.name}</p>
                            <p className="text-sm font-bold">{(d.value * 0.45).toFixed(1)} GB</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-3xl border-2 border-red-500/20 bg-red-500/[0.02] flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                       <RefreshCcw className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-white">Purge Old Exports</h3>
                       <p className="text-[11px] text-white/40 mt-1">Delete all rendered exports older than 90 days to free up storage space.</p>
                    </div>
                 </div>
                 <button className="px-8 py-3 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Purge Data</button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}

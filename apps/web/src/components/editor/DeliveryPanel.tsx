import React, { useState } from "react";
import { 
  Download, 
  Cloud, 
  HardDrive, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  X,
  ExternalLink,
  Smartphone,
  Share2 as Facebook
} from "lucide-react";

interface Asset {
  format: string;
  url: string;
  size: string;
}

interface DeliveryPanelProps {
  assets: Asset[];
  onClose: () => void;
}

export default function DeliveryPanel({ assets, onClose }: DeliveryPanelProps) {
  const [deliveredTo, setDeliveredTo] = useState<string[]>([]);

  const handleDeliver = (dest: string) => {
    // Mock delivery
    setTimeout(() => {
      setDeliveredTo([...deliveredTo, dest]);
    }, 1500);
  };

  const integrations = [
    { id: "drive", label: "Google Drive", icon: <Cloud className="w-5 h-5 text-blue-500" />, desc: "Sync to your workspace" },
    { id: "dropbox", label: "Dropbox", icon: <HardDrive className="w-5 h-5 text-blue-400" />, desc: "Save for team review" },
    { id: "meta", label: "Meta Ads", icon: <Facebook className="w-5 h-5 text-blue-600" />, desc: "Push to Ad Manager" },
    { id: "mobile", label: "Send to Phone", icon: <Smartphone className="w-5 h-5 text-emerald-500" />, desc: "QR code delivery" }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
      <div className="max-w-3xl w-full bg-[#161618] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-12 text-center border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
           <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-8 shadow-xl shadow-primary/10">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-3xl font-bold mb-2">Render Complete!</h2>
           <p className="text-white/40 text-sm">Your assets are processed and ready for delivery.</p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
           {/* Downloads */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Available Downloads</h3>
              <div className="space-y-3">
                 {assets.map((asset, i) => (
                   <a 
                     key={i}
                     href={asset.url}
                     target="_blank"
                     rel="noreferrer"
                     className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Download className="w-5 h-5" />
                         </div>
                         <div className="text-left">
                            <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{asset.format} Output</h4>
                            <p className="text-[10px] text-white/40">{asset.size}</p>
                         </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                   </a>
                 ))}
              </div>
           </div>

           {/* Cloud Integrations */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Cloud Delivery</h3>
              <div className="grid grid-cols-1 gap-3">
                 {integrations.map((it) => (
                   <button 
                     key={it.id}
                     onClick={() => handleDeliver(it.id)}
                     disabled={deliveredTo.includes(it.id)}
                     className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                       deliveredTo.includes(it.id) 
                       ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                       : "bg-white/5 border-white/10 hover:border-white/30 text-white/60 hover:text-white"
                     }`}
                   >
                      <div className="flex items-center gap-4 text-left">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveredTo.includes(it.id) ? "bg-emerald-500/10" : "bg-black/20"}`}>
                            {deliveredTo.includes(it.id) ? <CheckCircle2 className="w-5 h-5" /> : it.icon}
                         </div>
                         <div>
                            <h4 className="text-xs font-bold">{it.label}</h4>
                            <p className="text-[10px] opacity-40">{deliveredTo.includes(it.id) ? "Successfully Delivered" : it.desc}</p>
                         </div>
                      </div>
                      {!deliveredTo.includes(it.id) && <ArrowRight className="w-4 h-4 opacity-20 group-hover:opacity-100" />}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-between">
           <button className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Public Review Link
           </button>
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all"
           >
              Back to Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}

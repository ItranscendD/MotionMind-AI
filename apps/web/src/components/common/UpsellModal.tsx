import React from "react";
import { X, Zap, Crown, CheckCircle2, ArrowRight } from "lucide-react";

interface UpsellModalProps {
  onClose: () => void;
  feature: string;
}

export default function UpsellModal({ onClose, feature }: UpsellModalProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
      <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative h-48 bg-primary/20 flex items-center justify-center overflow-hidden">
           {/* Decorative Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20" />
           <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-40 animate-pulse" />
           <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-accent rounded-full blur-[80px] opacity-40 animate-pulse" />
           
           <div className="relative w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl">
              <Crown className="w-10 h-10" />
           </div>
        </div>

        <div className="p-8 text-center space-y-8">
           <div>
              <h3 className="text-2xl font-bold mb-2">Unlock {feature}</h3>
              <p className="text-white/40 text-sm">Professional formats and 4K rendering are available on our <span className="text-primary font-bold">Pro</span> and <span className="text-accent font-bold">Enterprise</span> plans.</p>
           </div>

           <div className="space-y-3 text-left">
              {[
                "Unlimited 4K GPU Exports",
                "Professional Codecs (ProRes, PNG Seq)",
                "Team Collaboration & Approval Gates",
                "Priority Render Queue Access"
              ].map(f => (
                <div key={f} className="flex items-center gap-3 text-xs font-medium text-white/60">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   {f}
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 gap-3">
              <button className="w-full h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl">
                 Upgrade to Pro
                 <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="w-full h-12 bg-white/5 text-white/40 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
              >
                 Maybe Later
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

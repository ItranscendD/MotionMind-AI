import React, { useState } from "react";
import { 
  X, 
  Share2, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  Download, 
  Copy, 
  ExternalLink,
  Check,
  Zap
} from "lucide-react";

interface ReviewLinkModalProps {
  onClose: () => void;
  projectId: string;
}

export default function ReviewLinkModal({ onClose, projectId }: ReviewLinkModalProps) {
  const [step, setStep] = useState<"config" | "result">("config");
  const [expiry, setExpiry] = useState("7d");
  const [password, setPassword] = useState("");
  const [canApprove, setCanApprove] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    // API call (mock)
    setGeneratedLink(`http://localhost:5173/review/tk_${Math.random().toString(36).substring(7)}`);
    setStep("result");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
      <div className="max-w-md w-full bg-[#161618] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Share2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold">Share for Review</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors">
              <X className="w-4 h-4" />
           </button>
        </div>

        {step === 'config' ? (
          <div className="p-8 space-y-8">
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">
                   <Calendar className="w-3 h-3" />
                   Link Expiry
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {["7d", "30d", "Never"].map(opt => (
                     <button 
                       key={opt}
                       onClick={() => setExpiry(opt)}
                       className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                         expiry === opt ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                       }`}
                     >
                        {opt}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">
                   <Lock className="w-3 h-3" />
                   Optional Password
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a password for this link..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-all"
                />
             </div>

             <div className="space-y-4 pt-4">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="text-xs font-bold">Allow Approvals</h4>
                         <p className="text-[10px] text-white/40 mt-0.5">Reviewer can officially sign off on this version.</p>
                      </div>
                   </div>
                   <input 
                     type="checkbox"
                     checked={canApprove}
                     onChange={(e) => setCanApprove(e.target.checked)}
                     className="w-5 h-5 accent-primary bg-transparent border-white/10"
                   />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                         <Download className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="text-xs font-bold">Allow Downloads</h4>
                         <p className="text-[10px] text-white/40 mt-0.5">Reviewer can download the source file.</p>
                      </div>
                   </div>
                   <input 
                     type="checkbox"
                     checked={canDownload}
                     onChange={(e) => setCanDownload(e.target.checked)}
                     className="w-5 h-5 accent-primary bg-transparent border-white/10"
                   />
                </label>
             </div>

             <button 
               onClick={handleGenerate}
               className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
             >
                <Zap className="w-5 h-5" />
                Generate Review Link
             </button>
          </div>
        ) : (
          <div className="p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto">
                <Check className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-xl font-bold mb-2">Review Link Ready!</h3>
                <p className="text-white/40 text-sm">Anyone with this link can now view and comment on your project.</p>
             </div>
             
             <div className="relative">
                <input 
                  readOnly
                  value={generatedLink}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-12 text-[10px] font-mono text-white/60 outline-none"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:scale-110 transition-transform"
                >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setStep("config")} className="h-12 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                   Manage Links
                </button>
                <a 
                  href={generatedLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="h-12 bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                >
                   <ExternalLink className="w-4 h-4" />
                   Open Link
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

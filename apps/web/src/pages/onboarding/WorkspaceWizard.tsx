import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload, Building2, UserCircle, Briefcase } from "lucide-react";

export default function WorkspaceWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    type: "create", // create | join
    role: "",
    useCase: ""
  });
  const navigate = useNavigate();

  const roles = ["Designer", "Marketer", "Director", "Developer", "Other"];
  const useCases = ["Social Media", "Broadcast", "Brand Identity", "Explainers", "Other"];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      console.log("Wizard complete:", formData);
      navigate("/onboarding/checklist");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-white/10"
              }`} 
            />
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Name your workspace</h2>
              <p className="text-white/60 mb-8">This is where your team will collaborate on projects.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-white/40 mb-2 block">Workspace Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acme Studio"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/40 mb-2 block">Workspace Logo (Optional)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer group">
                    <Upload className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-white/40">Click to upload or drag and drop</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold mb-4">Join or Create?</h2>
              <p className="text-white/60 mb-8">Choose how you want to start.</p>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setFormData({ ...formData, type: "create" })}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    formData.type === "create" ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
                  }`}
                >
                  <h4 className="font-bold mb-1">Create a new workspace</h4>
                  <p className="text-sm text-white/60">Start fresh and invite your team later.</p>
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, type: "join" })}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    formData.type === "join" ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
                  }`}
                >
                  <h4 className="font-bold mb-1">Join an existing workspace</h4>
                  <p className="text-sm text-white/60">Use an invite token from your team.</p>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8">
                <UserCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">What's your role?</h2>
              <p className="text-white/60 mb-8">We'll tailor your experience based on your role.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button 
                    key={r}
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                      formData.role === r ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Main use case?</h2>
              <p className="text-white/60 mb-8">What will you be creating most with MotionMind AI?</p>
              
              <div className="grid grid-cols-1 gap-3">
                {useCases.map((u) => (
                  <button 
                    key={u}
                    onClick={() => setFormData({ ...formData, useCase: u })}
                    className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                      formData.useCase === u ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
            <button 
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={step === 1 && !formData.name}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {step === 4 ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight, Image as ImageIcon, Send, UserPlus, Link2 } from "lucide-react";

export default function OnboardingChecklist() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Upload style sample", icon: ImageIcon, description: "Add a reference image to help AI understand your style." },
    { id: 2, title: "Try first prompt", icon: Send, description: "Generate your first AI motion clip from a text prompt." },
    { id: 3, title: "Invite teammate", icon: UserPlus, description: "Collaboration is better. Add your first team member." },
    { id: 4, title: "Connect integration", icon: Link2, description: "Sync with Figma or Google Drive to import assets." },
  ];

  const handleComplete = (id: number) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Almost there!</h1>
          <p className="text-white/60">Complete these steps to get the most out of MotionMind AI.</p>
        </div>

        <div className="space-y-4 mb-12">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <div 
                key={step.id}
                className={`p-6 rounded-2xl border transition-all flex items-start gap-6 ${
                  isCompleted ? "bg-primary/5 border-primary/30" : "bg-white/5 border-white/10"
                }`}
              >
                <div className={`mt-1 ${isCompleted ? "text-primary" : "text-white/20"}`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${isCompleted ? "text-white" : "text-white/80"}`}>{step.title}</h3>
                  <p className="text-sm text-white/40 mb-4">{step.description}</p>
                  {!isCompleted && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleComplete(step.id)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all"
                      >
                        Complete Step
                      </button>
                      <button 
                        onClick={() => handleComplete(step.id)}
                        className="px-4 py-1.5 text-white/40 hover:text-white text-xs font-bold transition-all"
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${isCompleted ? "bg-primary/10 text-primary" : "bg-white/5 text-white/20"}`}>
                  <step.icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6">
          <div>
            <div className="text-sm font-medium text-white/40 mb-1">Onboarding Progress</div>
            <div className="text-xl font-bold">{Math.round((completedSteps.length / steps.length) * 100)}% Complete</div>
          </div>
          <button 
            onClick={handleFinish}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import PlanCard from "@/components/onboarding/PlanCard";
import { useNavigate } from "react-router-dom";

export default function PlanSelection() {
  const navigate = useNavigate();

  const handleSelect = (plan: string) => {
    console.log("Selected plan:", plan);
    // In a real app, this would redirect to Stripe for Pro/Team
    navigate("/onboarding/workspace");
  };

  return (
    <div className="min-h-screen bg-background text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-white/60">Select the best plan for your motion needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PlanCard
            name="Free"
            price="Free"
            description="Perfect for individuals exploring AI motion."
            features={[
              "5 Generations / month",
              "Standard resolution",
              "Community support",
              "Basic style library"
            ]}
            onSelect={() => handleSelect("free")}
          />

          <PlanCard
            name="Pro"
            price="$49"
            description="For professional creators needing more power."
            features={[
              "Unlimited Generations",
              "4K Resolution",
              "Priority rendering",
              "Advanced style profiles",
              "No watermark"
            ]}
            recommended
            onSelect={() => handleSelect("pro")}
          />

          <PlanCard
            name="Team"
            price="$199"
            description="Built for studios and marketing teams."
            features={[
              "Everything in Pro",
              "10 Team members",
              "Shared workspace",
              "Collaborative editing",
              "API access",
              "Custom style models"
            ]}
            onSelect={() => handleSelect("team")}
          />
        </div>
      </div>
    </div>
  );
}

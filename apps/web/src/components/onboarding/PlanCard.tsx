import { Check } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}

export default function PlanCard({ name, price, description, features, recommended, onSelect }: PlanCardProps) {
  return (
    <div className={`p-8 rounded-2xl border transition-all ${
      recommended 
        ? "bg-primary/5 border-primary shadow-xl shadow-primary/10 relative overflow-hidden" 
        : "bg-white/5 border-white/10 hover:border-white/20"
    }`}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
          Most Popular
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-white/60 text-sm">{description}</p>
      </div>

      <div className="mb-8">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-white/60 text-sm ml-2">/month</span>}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/80">
            <Check className="w-4 h-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          recommended 
            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" 
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {name === "Free" ? "Get Started" : "Upgrade to " + name}
      </button>
    </div>
  );
}

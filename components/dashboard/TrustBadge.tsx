import { Badge } from "@/components/ui/badge";
import { Shield, Award, Star, CheckCircle } from "lucide-react";

interface TrustBadgeProps {
  score: number;
  level: string;
  size?: "sm" | "md" | "lg";
}

export function TrustBadge({ score, level, size = "md" }: TrustBadgeProps) {
  const getBadgeStyle = () => {
    if (score >= 90) return {
      icon: Award,
      className: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      label: "Elite"
    };
    if (score >= 75) return {
      icon: Star,
      className: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      label: "High"
    };
    if (score >= 50) return {
      icon: Shield,
      className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      label: "Verified"
    };
    return {
      icon: CheckCircle,
      className: "bg-slate-500/10 border-slate-500/30 text-slate-400",
      label: "Basic"
    };
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <Badge 
      variant="outline" 
      className={`${style.className} ${sizeClasses[size]} flex items-center gap-1.5 font-medium`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"} />
      <span>{style.label}</span>
      <span className="opacity-60">({score})</span>
    </Badge>
  );
}

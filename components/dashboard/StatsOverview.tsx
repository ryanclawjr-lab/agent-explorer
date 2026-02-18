import { Card } from "@/components/ui/card";
import { Users, Shield, Star, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  totalAgents: number;
  avgTrustScore: number;
  featuredCount: number;
}

export function StatsOverview({ totalAgents, avgTrustScore, featuredCount }: StatsOverviewProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-slate-900/50 border-slate-800/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Agents</p>
            <p className="text-2xl font-bold text-white">{totalAgents}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Avg Trust Score</p>
            <p className="text-2xl font-bold text-emerald-400">{avgTrustScore}/100</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Featured</p>
            <p className="text-2xl font-bold text-white">{featuredCount}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Network</p>
            <p className="text-2xl font-bold text-white">Base</p>
          </div>
        </div>
      </Card>
    </section>
  );
}

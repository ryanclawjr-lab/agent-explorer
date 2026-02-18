import { Agent } from "@/lib/types/agent";
import { Card } from "@/components/ui/card";
import { TrustBadge } from "./TrustBadge";
import { Star, ExternalLink, Zap } from "lucide-react";

interface FeaturedAgentsProps {
  agents: Agent[];
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Featured Agents</h2>
          <p className="text-slate-400 text-sm">Top-rated agents with exceptional trust scores</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.agentId} 
            className="group bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 overflow-hidden backdrop-blur-sm"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-xl font-bold text-white">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                    <p className="text-slate-500 text-sm">ID: #{agent.agentId}</p>
                  </div>
                </div>
                <TrustBadge score={agent.trustScore} level={agent.trustLevel} />
              </div>

              <p className="text-slate-400 mb-4 line-clamp-2">{agent.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <span 
                    key={cap} 
                    className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{agent.pricing.perCall || agent.pricing.perQuery}</span>
                </div>
                <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Agent } from "@/types/agent";
import { Card } from "@/components/ui/card";
import { TrustBadge } from "./TrustBadge";
import { Globe, Zap } from "lucide-react";

interface AgentGridProps {
  agents: Pick<Agent, "agentId" | "name" | "trustScore" | "trustLevel" | "featured">[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card 
          key={agent.agentId}
          className="group bg-slate-900/30 border-slate-800/30 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-200 p-5 backdrop-blur-sm cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg font-semibold text-slate-300">
                {agent.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-white">{agent.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe className="w-3 h-3" />
                  <span>#{agent.agentId}</span>
                </div>
              </div>
            </div>
            
            <TrustBadge score={agent.trustScore} level={agent.trustLevel} size="sm" />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-slate-400">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Trust Score: {agent.trustScore}/100</span>
            </div>
            
            {agent.featured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                Featured
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { AgentCard } from './AgentCard';
import { Agent } from '@/lib/types/agent';
import { cn } from '@/lib/utils';

interface AgentGridProps {
  agents: Agent[];
  onCompare?: (agentId: string) => void;
  comparingIds?: string[];
  className?: string;
}

export function AgentGrid({ agents, onCompare, comparingIds = [], className }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No agents found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4', className)}>
      {agents.map((agent, index) => (
        <div
          key={agent.agentId}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <AgentCard
            agent={agent}
            onCompare={onCompare}
            isComparing={comparingIds.includes(agent.agentId)}
          />
        </div>
      ))}
    </div>
  );
}

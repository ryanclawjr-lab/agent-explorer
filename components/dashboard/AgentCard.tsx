'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrustScoreRing } from './TrustScoreRing';
import { Agent } from '@/lib/types/agent';
import { cn } from '@/lib/utils';
import { CheckCircle2, ExternalLink, GitCompare, Sparkles } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onCompare?: (agentId: string) => void;
  isComparing?: boolean;
  className?: string;
}

export function AgentCard({ agent, onCompare, isComparing, className }: AgentCardProps) {
  const getPricingDisplay = () => {
    if (agent.pricing.perCall) return `${agent.pricing.perCall} ETH/call`;
    if (agent.pricing.perQuery) return `${agent.pricing.perQuery} ETH/query`;
    if (agent.pricing.perTransaction) return `${agent.pricing.perTransaction} ETH/tx`;
    return 'Free';
  };
  
  const getNetworkColor = (network: string) => {
    if (network.includes('mainnet')) return 'text-emerald-400 bg-emerald-500/10';
    if (network.includes('sepolia')) return 'text-amber-400 bg-amber-500/10';
    return 'text-blue-400 bg-blue-500/10';
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden card-hover',
      isComparing && 'ring-2 ring-primary',
      className
    )}>
      {/* Featured badge */}
      {agent.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
      
      <div className="p-5">
        {/* Header with trust score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-lg">
              {agent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                {agent.trustScore >= 90 && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <Badge variant="secondary" className={cn('text-xs', getNetworkColor(agent.network))}>
                {agent.network}
              </Badge>
            </div>
          </div>
          
          <TrustScoreRing score={agent.trustScore} size="sm" showLabel={false} />
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {agent.description}
        </p>
        
        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <Badge key={cap} variant="outline" className="text-xs">
              {cap}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Footer with pricing and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-sm">
            <span className="text-muted-foreground">Price: </span>
            <span className="font-medium">{getPricingDisplay()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {onCompare && (
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-8 w-8', isComparing && 'bg-primary/20')}
                onClick={() => onCompare(agent.agentId)}
                title="Compare"
              >
                <GitCompare className="h-4 w-4" />
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/agents/${agent.agentId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button size="sm" asChild>
              <Link href={`/agents/${agent.agentId}`}>
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
}

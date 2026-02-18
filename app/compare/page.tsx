'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrustScoreRing } from '@/components/dashboard/TrustScoreRing';
import { Agent } from '@/lib/types/agent';
import { 
  Shield, 
  Zap, 
  Globe, 
  Network,
  MessageSquare,
  ArrowRight,
  X
} from 'lucide-react';

export default function ComparePage({ 
  params 
}: { 
  params: Promise<{ ids?: string }> 
}) {
  const { ids } = use(params);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      if (!ids) {
        setLoading(false);
        return;
      }
      
      try {
        const agentIds = ids.split(',').filter(Boolean);
        const promises = agentIds.map(id => 
          fetch(`/api/agents/${id}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        setAgents(results.filter(a => !a.error));
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, [ids]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Agents Selected</h1>
        <p className="text-muted-foreground mb-6">
          Select agents from the explorer to compare them.
        </p>
        <Button asChild>
          <Link href="/">Go to Explorer</Link>
        </Button>
      </div>
    );
  }

  const comparisonFields = [
    { label: 'Trust Score', key: 'trustScore', type: 'score' as const },
    { label: 'Trust Level', key: 'trustLevel', type: 'text' as const },
    { label: 'Feedback Count', key: 'feedbackCount', type: 'number' as const },
    { label: 'x402 Support', key: 'x402Support', type: 'boolean' as const },
    { label: 'Networks', key: 'networks', type: 'array' as const },
    { label: 'Capabilities', key: 'capabilities', type: 'capabilities' as const },
  ];

  const getWinner = (key: string) => {
    if (key === 'trustScore' || key === 'feedbackCount') {
      const scores = agents.map(a => a[key] || 0);
      const max = Math.max(...scores);
      return agents.findIndex(a => (a[key] || 0) === max);
    }
    if (key === 'x402Support') {
      const trueCount = agents.filter(a => a.x402Support).length;
      if (trueCount === 1) return agents.findIndex(a => a.x402Support);
    }
    return -1;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2">
        ← Back to Explorer
      </Link>

      <h1 className="text-3xl font-bold mb-8">Agent Comparison</h1>

      {/* Agent Headers */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="col-span-1"></div>
        {agents.map((agent, idx) => (
          <Card key={agent.agentId} className="text-center p-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-xl mb-2">
              {agent.name.charAt(0)}
            </div>
            <h3 className="font-bold">{agent.name}</h3>
            <Badge variant="secondary" className="mt-1">
              ID: {agent.agentId}
            </Badge>
            {idx > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-red-400"
                asChild
              >
                <Link href={`/agents/${agent.agentId}`}>
                  View Details →
                </Link>
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="space-y-4">
        {comparisonFields.map((field) => {
          const winnerIdx = getWinner(field.key);
          
          return (
            <div 
              key={field.key}
              className={`grid grid-cols-4 gap-4 p-4 rounded-lg ${
                winnerIdx >= 0 ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-muted/30'
              }`}
            >
              <div className="font-medium flex items-center">
                {field.label}
                {winnerIdx >= 0 && (
                  <Badge variant="outline" className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Winner
                  </Badge>
                )}
              </div>
              
              {agents.map((agent, idx) => {
                const value = agent[field.key as keyof Agent];
                const isWinner = idx === winnerIdx;
                
                return (
                  <div 
                    key={agent.agentId} 
                    className={`text-center p-2 rounded ${
                      isWinner ? 'bg-emerald-500/10 font-semibold' : ''
                    }`}
                  >
                    {field.type === 'score' && (
                      <div className="flex justify-center">
                        <TrustScoreRing score={value as number} size="sm" showLabel={false} />
                        <span className="ml-2 text-lg font-bold">{value as number}</span>
                      </div>
                    )}
                    {field.type === 'text' && (
                      <span className="capitalize">{String(value)}</span>
                    )}
                    {field.type === 'number' && (
                      <span>{String(value || 0)}</span>
                    )}
                    {field.type === 'boolean' && (
                      <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Yes' : 'No'}
                      </Badge>
                    )}
                    {field.type === 'array' && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {(value as string[])?.slice(0, 2).map((v) => (
                          <Badge key={v} variant="outline" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                        {(value as string[])?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(value as string[]).length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    {field.type === 'capabilities' && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {(value as string[])?.slice(0, 3).map((v) => (
                          <Badge key={v} variant="secondary" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                        {(value as string[])?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(value as string[]).length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-center gap-4">
        {agents.map((agent) => (
          <Button key={agent.agentId} variant="outline" asChild>
            <Link href={`/agents/${agent.agentId}`}>
              View {agent.name} Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

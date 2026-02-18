'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TrustScoreRing } from '@/components/dashboard/TrustScoreRing';
import { Agent } from '@/lib/types/agent';
import { 
  Shield, 
  Zap, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  Star,
  MessageSquare,
  Clock,
  Network,
  Wallet
} from 'lucide-react';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(`/api/agents/${id}`);
        if (!res.ok) throw new Error('Agent not found');
        const data = await res.json();
        setAgent(data);
      } catch (err) {
        setError('Failed to load agent');
      } finally {
        setLoading(false);
      }
    }
    fetchAgent();
  }, [id]);

  const copyEndpoint = () => {
    if (agent?.endpoint) {
      navigator.clipboard.writeText(agent.endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Agent Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || 'The requested agent could not be found.'}</p>
        <Button asChild>
          <Link href="/">Back to Explorer</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/" className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2">
        ← Back to Explorer
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Agent Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            {agent.trustScore >= 90 && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Elite
              </Badge>
            )}
            {agent.x402Support && (
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                <Zap className="w-3 h-3 mr-1" />
                x402
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-lg mb-4">{agent.description}</p>

          {/* Networks */}
          <div className="flex flex-wrap gap-2 mb-4">
            {agent.networks?.map((network) => (
              <Badge key={network} variant="secondary">
                <Network className="w-3 h-3 mr-1" />
                {network}
              </Badge>
            ))}
          </div>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-2">
            {agent.capabilities?.map((cap) => (
              <Badge key={cap} variant="outline">
                {cap}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trust Score */}
        <div className="flex-shrink-0">
          <Card className="p-6 text-center">
            <TrustScoreRing score={agent.trustScore} size="xl" />
            <p className="text-sm text-muted-foreground mt-2">Trust Score</p>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="reputation">Reputation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Agent Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Feedback Count</p>
                  <p className="text-2xl font-bold">{agent.feedbackCount || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Trust Level</p>
                  <p className="text-2xl font-bold capitalize">{agent.trustLevel}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">x402 Support</p>
                  <p className="text-2xl font-bold">{agent.x402Support ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Networks</p>
                  <p className="text-2xl font-bold">{agent.networks?.length || 0}</p>
                </div>
              </div>

              {/* Hire CTA */}
              <div className="pt-4 border-t">
                <Button size="lg" className="w-full md:w-auto">
                  <Zap className="w-4 h-4 mr-2" />
                  Hire This Agent
                </Button>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Copy the endpoint and use with any x402-compatible wallet
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>Connection Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agent.endpoint && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      HTTPS Endpoint
                    </p>
                    <p className="text-sm text-muted-foreground">{agent.endpoint}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyEndpoint}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={agent.endpoint} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {agent.wallet && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Agent Wallet
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">{agent.wallet}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(agent.wallet || '')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!agent.endpoint && !agent.wallet && (
                <p className="text-center text-muted-foreground py-8">
                  No endpoints available for this agent.
                </p>
              )}

              {/* 8004scan link */}
              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full" asChild>
                  <a href={`https://8004scan.io/agent/${id}`} target="_blank" rel="noopener noreferrer">
                    View on 8004scan.io
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reputation">
          <Card>
            <CardHeader>
              <CardTitle>Reputation & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="w-12 h-12 mx-auto text-amber-400 mb-4" />
                <p className="text-muted-foreground">
                  {agent.feedbackCount || 0} reviews on-chain
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Reputation data powered by ERC-8004 ReputationRegistry
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { AgentGrid } from '@/components/dashboard/AgentGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgents, useFeaturedAgents, useComparison } from '@/lib/hooks/useAgents';
import { FilterState, Agent } from '@/lib/types/agent';
import { fallbackAgents } from '@/lib/api';
import { GitCompare, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    trustScoreRange: [0, 100],
    networks: [],
    capabilities: [],
    featuredOnly: false,
    activityLevel: 'all'
  });

  const { agents, loading, error, refetch } = useAgents(filters);
  const { agents: featuredAgents, loading: featuredLoading } = useFeaturedAgents();
  const { selectedIds, toggleAgent, clearSelection, canCompare } = useComparison();

  // Filter agents client-side as fallback
  const displayAgents = agents.length > 0 ? agents : fallbackAgents.filter(agent => {
    if (filters.search && !agent.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !agent.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (agent.trustScore < filters.trustScoreRange[0] || agent.trustScore > filters.trustScoreRange[1]) {
      return false;
    }
    if (filters.featuredOnly && !agent.featured) {
      return false;
    }
    if (filters.networks.length > 0 && !filters.networks.some(n => agent.network.includes(n))) {
      return false;
    }
    if (filters.capabilities.length > 0 && !filters.capabilities.some(c => agent.capabilities.includes(c))) {
      return false;
    }
    return true;
  });

  const avgTrustScore = displayAgents.length > 0
    ? Math.round(displayAgents.reduce((acc, a) => acc + a.trustScore, 0) / displayAgents.length)
    : 0;

  const eliteCount = displayAgents.filter(a => a.trustScore >= 90).length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection
        totalAgents={displayAgents.length}
        avgTrustScore={avgTrustScore}
        featuredCount={featuredAgents.length || fallbackAgents.filter(a => a.featured).length}
        eliteCount={eliteCount}
      />

      {/* Comparison Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-40 glass rounded-xl p-4 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {selectedIds.length} agent{selectedIds.length !== 1 && 's'} selected
              </span>
            </div>
            <div className="flex gap-2">
              {selectedIds.map(id => {
                const agent = displayAgents.find(a => a.agentId === id);
                return agent ? (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {agent.name}
                    <button
                      onClick={() => toggleAgent(id)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button size="sm" disabled={!canCompare} asChild>
              <Link href={`/compare?agents=${selectedIds.join(',')}`}>
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Now
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Featured Section */}
      {!featuredLoading && featuredAgents.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Featured Agents</h2>
          </div>
          <AgentGrid
            agents={featuredAgents.slice(0, 3)}
            onCompare={toggleAgent}
            comparingIds={selectedIds}
          />
        </section>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
          />
        </aside>

        {/* Agents Grid */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">All Agents</h2>
              <Badge variant="secondary">{displayAgents.length}</Badge>
            </div>
            
            <Button variant="ghost" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <AgentGrid
              agents={displayAgents}
              onCompare={toggleAgent}
              comparingIds={selectedIds}
            />
          )}
        </section>
      </div>
    </div>
  );
}

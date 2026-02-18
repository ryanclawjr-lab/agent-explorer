'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { AgentGrid } from '@/components/dashboard/AgentGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgents, useFeaturedAgents, useComparison } from '@/lib/hooks/useAgents';
import { useSearch } from '@/lib/hooks/useSearch';
import { FilterState } from '@/lib/types/agent';
import { fallbackAgents } from '@/lib/api';
import { GitCompare, Sparkles, RefreshCw, Search } from 'lucide-react';
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

  const { agents, loading, error, source, refetch } = useAgents();
  const { agents: featuredAgents, loading: featuredLoading } = useFeaturedAgents();
  const { selectedIds, toggleAgent, clearSelection, canCompare } = useComparison();
  const { query, setQuery, loading: searchLoading } = useSearch();

  // Use search results when query exists, otherwise use all agents
  const displayAgents = query || Object.keys(filters).length > 1 
    ? (loading ? [] : agents)
    : (agents.length > 0 ? agents : fallbackAgents);

  // Apply local filters on top of API results
  const filteredAgents = displayAgents.filter(agent => {
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
    return true;
  });

  const avgTrustScore = filteredAgents.length > 0
    ? Math.round(filteredAgents.reduce((acc, a) => acc + a.trustScore, 0) / filteredAgents.length)
    : 0;

  const eliteCount = filteredAgents.filter(a => a.trustScore >= 90).length;

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection
        totalAgents={filteredAgents.length}
        avgTrustScore={avgTrustScore}
        featuredCount={featuredAgents.length}
        eliteCount={eliteCount}
      />

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search agents by name, capability, or description..."
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary text-lg"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

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
              <Link href={`/compare?ids=${selectedIds.join(',')}`}>
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Now
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Featured Section */}
      {!query && (
        featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : featuredAgents.length > 0 ? (
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
        ) : null
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
          />
        </aside>

        {/* Agents Grid */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">All Agents</h2>
              <Badge variant="secondary">{filteredAgents.length}</Badge>
              {source && (
                <Badge variant="outline" className="text-xs">
                  {source}
                </Badge>
              )}
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
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <AgentGrid
              agents={filteredAgents}
              onCompare={toggleAgent}
              comparingIds={selectedIds}
            />
          )}
        </section>
      </div>
    </div>
  );
}

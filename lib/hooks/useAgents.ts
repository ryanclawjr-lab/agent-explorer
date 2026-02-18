'use client';

import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentsResponse, AgentDetailResponse, FilterState } from '@/lib/types/agent';
import { getAgents, getFeaturedAgents, getAgentDetail, searchAgents, fallbackAgents } from '@/lib/api';

export function useAgents(initialFilters?: FilterState) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState | undefined>(initialFilters);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgents(filters);
      setAgents(data.agents as Agent[]);
    } catch (err) {
      console.warn('Using fallback agents data');
      setAgents(fallbackAgents);
      setError('Using cached data - API temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, error, filters, setFilters, refetch: fetchAgents };
}

export function useFeaturedAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFeaturedAgents();
        setAgents(data.agents as Agent[]);
      } catch (err) {
        setAgents(fallbackAgents.filter(a => a.featured));
        setError('Using cached data');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { agents, loading, error };
}

export function useAgentDetail(agentId: string) {
  const [data, setData] = useState<AgentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const result = await getAgentDetail(agentId);
        setData(result);
      } catch (err) {
        const fallback = fallbackAgents.find(a => a.agentId === agentId);
        if (fallback) {
          setData({
            agent: fallback,
            trustHistory: [],
            feedback: [],
            stats: {
              totalTransactions: fallback.totalTransactions || 0,
              successfulTransactions: fallback.successfulTransactions || 0,
              failedTransactions: 0,
              uptimePercentage: 99.9,
              averageResponseTime: fallback.averageResponseTime || 0,
              uniqueUsers: 100
            }
          });
        }
        setError('Using cached data');
      } finally {
        setLoading(false);
      }
    }
    if (agentId) fetch();
  }, [agentId]);

  return { data, loading, error };
}

export function useSearch() {
  const [results, setResults] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const data = await searchAgents(query);
          setResults(data.agents as Agent[]);
        } catch {
          const filtered = fallbackAgents.filter(a => 
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase()) ||
            a.capabilities.some(c => c.toLowerCase().includes(query.toLowerCase()))
          );
          setResults(filtered);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, results, loading };
}

export function useComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAgent = useCallback((agentId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), agentId];
      }
      return [...prev, agentId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return { selectedIds, toggleAgent, clearSelection, canCompare: selectedIds.length >= 2 };
}

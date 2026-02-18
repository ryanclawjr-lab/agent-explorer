'use client';

import { useState, useEffect, useCallback } from 'react';
import { Agent } from '@/lib/types/agent';
import { getAgents, getFeaturedAgents, fallbackAgents } from '@/lib/api';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | undefined>();

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgents();
      setAgents(data.agents || []);
      setSource(data.source);
    } catch (err) {
      console.warn('Using fallback agents data:', err);
      setAgents(fallbackAgents);
      setError('Using cached data - API temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, error, source, refetch: fetchAgents };
}

export function useFeaturedAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFeaturedAgents();
        setAgents(data);
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
  const [data, setData] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        // For now, use fallback data since we don't have detail API
        const agent = fallbackAgents.find(a => a.agentId === agentId);
        setData(agent || null);
      } catch (err) {
        setError('Failed to fetch agent details');
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
          const data = await getAgents();
          const filtered = (data.agents || []).filter(a => 
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase()) ||
            a.capabilities.some(c => c.toLowerCase().includes(query.toLowerCase()))
          );
          setResults(filtered);
        } catch {
          setResults([]);
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Agent } from '@/lib/types/agent';

interface SearchFilters {
  capabilities?: string[];
  minTrust?: number;
  maxTrust?: number;
  x402Only?: boolean;
  network?: string;
  featured?: boolean;
  sort?: 'trust-desc' | 'trust-asc' | 'name-asc' | 'name-desc' | 'feedback-desc';
}

export function useSearch() {
  const [results, setResults] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const search = useCallback(async (searchQuery: string, searchFilters: SearchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('q', searchQuery);
      if (searchFilters.capabilities?.length) params.set('capabilities', searchFilters.capabilities.join(','));
      if (searchFilters.minTrust) params.set('minTrust', String(searchFilters.minTrust));
      if (searchFilters.maxTrust) params.set('maxTrust', String(searchFilters.maxTrust));
      if (searchFilters.x402Only) params.set('x402', 'true');
      if (searchFilters.network) params.set('network', searchFilters.network);
      if (searchFilters.featured) params.set('featured', 'true');
      if (searchFilters.sort) params.set('sort', searchFilters.sort);

      const res = await fetch(`/api/agents/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.agents || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search on query change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length >= 1 || Object.keys(filters).length > 0) {
        search(query, filters);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, filters, search]);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    filters,
    updateFilters,
    clearFilters,
    search
  };
}

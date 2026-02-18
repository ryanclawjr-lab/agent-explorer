import { Agent, AgentsResponse, AgentDetailResponse, FilterState } from '@/lib/types/agent';

const API_BASE = 'https://dataoracle-xutu.onrender.com/api/v1';

export async function getAgents(filters?: FilterState): Promise<AgentsResponse> {
  const params = new URLSearchParams();
  
  if (filters?.search) params.set('q', filters.search);
  if (filters?.trustScoreRange) {
    params.set('minTrust', filters.trustScoreRange[0].toString());
    params.set('maxTrust', filters.trustScoreRange[1].toString());
  }
  if (filters?.networks?.length) params.set('networks', filters.networks.join(','));
  if (filters?.capabilities?.length) params.set('capabilities', filters.capabilities.join(','));
  if (filters?.featuredOnly) params.set('featured', 'true');
  if (filters?.activityLevel && filters.activityLevel !== 'all') {
    params.set('activity', filters.activityLevel);
  }
  
  const url = `${API_BASE}/discovery/agents${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function searchAgents(query: string): Promise<AgentsResponse> {
  const res = await fetch(`${API_BASE}/discovery/agents/search?q=${encodeURIComponent(query)}`, {
    next: { revalidate: 30 }
  });
  if (!res.ok) throw new Error('Failed to search agents');
  return res.json();
}

export async function getFeaturedAgents(): Promise<AgentsResponse> {
  const res = await fetch(`${API_BASE}/discovery/featured`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch featured agents');
  return res.json();
}

export async function getAgentDetail(agentId: string): Promise<AgentDetailResponse> {
  const res = await fetch(`${API_BASE}/discovery/agents/${agentId}`, {
    next: { revalidate: 30 }
  });
  if (!res.ok) throw new Error('Failed to fetch agent details');
  return res.json();
}

export async function compareAgents(agentIds: string[]): Promise<Agent[]> {
  const params = new URLSearchParams();
  agentIds.forEach(id => params.append('ids', id));
  
  const res = await fetch(`${API_BASE}/discovery/compare?${params.toString()}`, {
    next: { revalidate: 30 }
  });
  if (!res.ok) throw new Error('Failed to compare agents');
  return res.json();
}

export async function getRecommendedAgents(userContext?: string): Promise<AgentsResponse> {
  const params = userContext ? `?context=${encodeURIComponent(userContext)}` : '';
  const res = await fetch(`${API_BASE}/discovery/recommended${params}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch recommended agents');
  return res.json();
}

// Fallback data for when API is unavailable
export const fallbackAgents: Agent[] = [
  {
    agentId: "17899",
    name: "DataOracle",
    description: "Multi-source data oracle providing real-time crypto prices, gas estimates, and market data with institutional-grade reliability.",
    trustScore: 95,
    trustLevel: "elite",
    capabilities: ["price-feeds", "gas-oracle", "market-data", "analytics"],
    pricing: { perCall: "0.001" },
    network: "base-sepolia",
    endpoint: "https://dataoracle-xutu.onrender.com",
    featured: true,
    registered: "2026-02-17",
    lastActive: "2026-02-17T22:00:00Z",
    totalTransactions: 15420,
    successfulTransactions: 15389,
    feedbackCount: 234,
    averageResponseTime: 120
  },
  {
    agentId: "17900", 
    name: "RyanClaw",
    description: "General-purpose AI agent with research, analysis, and coding capabilities. Specialized in blockchain development and DeFi protocols.",
    trustScore: 92,
    trustLevel: "elite",
    capabilities: ["research", "analysis", "coding", "defi"],
    pricing: { perQuery: "0.005" },
    network: "base-sepolia",
    featured: true,
    registered: "2026-02-17",
    lastActive: "2026-02-17T21:45:00Z",
    totalTransactions: 8932,
    successfulTransactions: 8876,
    feedbackCount: 189,
    averageResponseTime: 850
  },
  {
    agentId: "17908",
    name: "AgentTrust",
    description: "Reputation and verification service for ERC-8004 agents. Provides trust scoring, verification badges, and reputation analytics.",
    trustScore: 98,
    trustLevel: "elite",
    capabilities: ["verification", "reputation", "analytics", "scoring"],
    pricing: { perCall: "0.0005" },
    network: "base-sepolia",
    featured: true,
    registered: "2026-02-17",
    lastActive: "2026-02-17T22:00:00Z",
    totalTransactions: 25678,
    successfulTransactions: 25612,
    feedbackCount: 412,
    averageResponseTime: 85
  }
];

import { Agent } from '@/lib/types/agent';

const API_BASE = '/api';

export async function getAgents(): Promise<{ agents: Agent[]; source?: string }> {
  const res = await fetch(`${API_BASE}/agents?chain=base-sepolia`, { 
    next: { revalidate: 60 } 
  });
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function searchAgents(query: string): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents?chain=base-sepolia&q=${encodeURIComponent(query)}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to search agents');
  const data = await res.json();
  return data.agents || [];
}

export async function getFeaturedAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents?chain=base-sepolia&featured=true`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch featured agents');
  const data = await res.json();
  // Return top 6 by trust score
  return (data.agents || []).slice(0, 6);
}

export async function getAgentDetail(agentId: string): Promise<Agent | null> {
  const res = await fetch(`${API_BASE}/agents/${agentId}`, {
    next: { revalidate: 30 }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function compareAgents(agentIds: string[]): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents/compare?ids=${agentIds.join(',')}`, {
    next: { revalidate: 30 }
  });
  if (!res.ok) throw new Error('Failed to compare agents');
  return res.json();
}

// Fallback sample data (only used if API completely fails)
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

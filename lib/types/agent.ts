export interface Agent {
  agentId: string;
  name: string;
  description: string;
  trustScore: number;
  trustLevel: 'elite' | 'verified' | 'standard' | 'unverified';
  capabilities: string[];
  pricing: {
    perCall?: string;
    perQuery?: string;
    perTransaction?: string;
  };
  network: string;
  endpoint?: string;
  featured: boolean;
  registered: string;
  lastActive?: string;
  totalTransactions?: number;
  successfulTransactions?: number;
  feedbackCount?: number;
  averageResponseTime?: number;
}

export interface AgentSummary {
  agentId: string;
  name: string;
  trustScore: number;
  trustLevel: 'elite' | 'verified' | 'standard' | 'unverified';
  featured: boolean;
  capabilities: string[];
}

export interface AgentsResponse {
  count: number;
  agents: AgentSummary[];
}

export interface AgentDetailResponse {
  agent: Agent;
  trustHistory: TrustHistoryPoint[];
  feedback: Feedback[];
  stats: AgentStats;
}

export interface TrustHistoryPoint {
  date: string;
  score: number;
  event?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: string;
  verified: boolean;
}

export interface AgentStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  uptimePercentage: number;
  averageResponseTime: number;
  uniqueUsers: number;
}

export interface FilterState {
  search: string;
  trustScoreRange: [number, number];
  networks: string[];
  capabilities: string[];
  featuredOnly: boolean;
  activityLevel: 'all' | 'high' | 'medium' | 'low';
}

export interface ComparisonAgent {
  agent: Agent;
  stats: AgentStats;
}

export type SortOption = 'trust-desc' | 'trust-asc' | 'name-asc' | 'name-desc' | 'newest' | 'oldest';

export interface Agent {
  agentId: string
  name: string
  description: string
  trustScore: number
  trustLevel: 'low' | 'medium' | 'high' | 'elite'
  capabilities: string[]
  pricing: {
    perCall?: string
    perQuery?: string
  }
  network: string
  endpoint?: string
  featured: boolean
  registered: string
}

export interface AgentsResponse {
  count: number
  agents: Pick<Agent, 'agentId' | 'name' | 'trustScore' | 'trustLevel' | 'featured'>[]
}

export interface FeaturedResponse {
  count: number
  agents: Agent[]
}

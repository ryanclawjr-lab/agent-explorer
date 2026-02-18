const API_BASE = 'https://dataoracle-xutu.onrender.com/api/v1'

export async function getAgents() {
  const res = await fetch(`${API_BASE}/discovery/agents`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch agents')
  return res.json()
}

export async function getFeaturedAgents() {
  const res = await fetch(`${API_BASE}/discovery/featured`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch featured agents')
  return res.json()
}

export async function searchAgents(query: string) {
  const res = await fetch(`${API_BASE}/discovery/agents/search?q=${encodeURIComponent(query)}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to search agents')
  return res.json()
}

export async function getAgent(agentId: string) {
  const res = await fetch(`${API_BASE}/discovery/agents/${agentId}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch agent')
  return res.json()
}

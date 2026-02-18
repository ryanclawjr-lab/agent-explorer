import { getAgents, getFeaturedAgents } from '@/lib/api'
import { FeaturedAgents } from '@/components/FeaturedAgents'
import { AgentList } from '@/components/AgentList'

export default async function Home() {
  const [agentsData, featuredData] = await Promise.all([
    getAgents(),
    getFeaturedAgents()
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">ERC-8004 Agent Explorer</h1>
      <p className="text-gray-600 mb-8">Discover AI agents with reputation scores and capabilities</p>
      
      <FeaturedAgents agents={featuredData.agents} />
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">All Agents</h2>
        <AgentList agents={agentsData.agents} />
      </div>
    </main>
  )
}

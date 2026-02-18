import { Agent } from '@/types/agent'
import { Star } from 'lucide-react'

interface FeaturedAgentsProps {
  agents: Agent[]
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500" />
        Featured Agents
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.agentId} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{agent.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                #{agent.agentId}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{agent.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">Trust:</span>
                <span className={`${
                  agent.trustScore >= 90 ? 'text-green-600' : 'text-blue-600'
                } font-semibold`}>
                  {agent.trustScore}/100
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Level:</span>
                <span className="capitalize">{agent.trustLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

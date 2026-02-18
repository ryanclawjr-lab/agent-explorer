import { Agent } from '@/lib/types/agent'
import { Shield, Zap, Globe } from 'lucide-react'

interface AgentListProps {
  agents: Pick<Agent, 'agentId' | 'name' | 'trustScore' | 'trustLevel' | 'featured'>[]
}

export function AgentList({ agents }: AgentListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">Agent</th>
            <th className="text-left py-3 px-4 font-semibold">Trust Score</th>
            <th className="text-left py-3 px-4 font-semibold">Level</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.agentId} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-gray-400 text-sm">#{agent.agentId}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className={`font-semibold ${
                    agent.trustScore >= 90 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {agent.trustScore}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded text-sm">
                  {agent.trustLevel}
                </span>
              </td>
              <td className="py-3 px-4">
                {agent.featured ? (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Zap className="w-4 h-4" />
                    Featured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <Globe className="w-4 h-4" />
                    Active
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

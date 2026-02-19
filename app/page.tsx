'use client';

import { useAgents, useFeaturedAgents } from '@/lib/hooks/useAgents';
import { fallbackAgents } from '@/lib/api';

export default function HomePage() {
  const { agents, loading, error } = useAgents();
  const { agents: featured } = useFeaturedAgents();
  
  const displayAgents = agents.length > 0 ? agents : fallbackAgents;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fff', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Agent Explorer
        </h1>
        <p style={{ color: '#888' }}>Trust & Reputation Hub for ERC-8004 Agents</p>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {displayAgents.length}
            </div>
            <div style={{ color: '#888' }}>Total Agents</div>
          </div>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {displayAgents.length > 0 
                ? Math.round(displayAgents.reduce((a, b) => a + b.trustScore, 0) / displayAgents.length)
                : 0}
            </div>
            <div style={{ color: '#888' }}>Avg Trust Score</div>
          </div>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {displayAgents.filter(a => a.trustScore >= 90).length}
            </div>
            <div style={{ color: '#888' }}>Elite Agents</div>
          </div>
        </div>

        {/* Agent List */}
        <div style={{ background: '#1a1a1a', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Agent</th>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Trust</th>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Level</th>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayAgents.map((agent: any) => (
                <tr key={agent.agentId} style={{ borderBottom: '1px solid #262626' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{agent.name}</div>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>#{agent.agentId}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: agent.trustScore >= 90 ? '#22c55e' : '#3b82f6' }}>
                      {agent.trustScore}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: '#262626', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}>
                      {agent.trustLevel || 'standard'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {agent.featured ? '⭐ Featured' : '✓ Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

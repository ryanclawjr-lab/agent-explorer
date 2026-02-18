'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FeaturedAgents } from "@/components/dashboard/FeaturedAgents";
import { AgentGrid } from "@/components/dashboard/AgentGrid";
import { SearchFilters } from "@/components/filters/SearchFilters";
import { Agent } from "@/lib/types/agent";

const fallbackAgents: Agent[] = [
  {
    agentId: "17899",
    name: "DataOracle",
    description: "Multi-source data oracle providing real-time crypto prices, gas estimates, and market data.",
    trustScore: 95,
    trustLevel: "elite",
    capabilities: ["price-feeds", "gas-oracle", "market-data"],
    pricing: { perCall: "0.001" },
    network: "base-sepolia",
    endpoint: "https://dataoracle-xutu.onrender.com",
    featured: true,
    registered: "2026-02-17"
  },
  {
    agentId: "17900", 
    name: "RyanClaw",
    description: "General-purpose AI agent with research and analysis capabilities.",
    trustScore: 92,
    trustLevel: "elite",
    capabilities: ["research", "analysis", "coding"],
    pricing: { perQuery: "0.005" },
    network: "base-sepolia",
    featured: true,
    registered: "2026-02-17"
  },
  {
    agentId: "17908",
    name: "AgentTrust",
    description: "Reputation and verification service for ERC-8004 agents.",
    trustScore: 98,
    trustLevel: "elite",
    capabilities: ["verification", "reputation", "analytics"],
    pricing: { perCall: "0.0005" },
    network: "base-sepolia",
    featured: true,
    registered: "2026-02-17"
  }
]

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(fallbackAgents)
  const [featured, setFeatured] = useState<Agent[]>(fallbackAgents)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, featuredRes] = await Promise.all([
          fetch('https://dataoracle-xutu.onrender.com/api/v1/discovery/agents'),
          fetch('https://dataoracle-xutu.onrender.com/api/v1/discovery/featured')
        ])
        
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json()
          if (agentsData.agents?.length > 0) {
            setAgents(agentsData.agents)
          }
        }
        
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json()
          if (featuredData.agents?.length > 0) {
            setFeatured(featuredData.agents)
          }
        }
      } catch (err) {
        console.log('Using fallback data due to API error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const avgTrustScore = Math.round(
    agents.reduce((acc, a) => acc + a.trustScore, 0) / agents.length
  )

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ERC-8004 Agent Explorer
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover verified AI agents with trust scores, reputation badges, and real-time insights
          </p>
        </section>

        {loading && (
          <div className="text-center py-4 text-slate-400">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mr-2" />
            Loading agents...
          </div>
        )}

        {/* Stats Overview */}
        <StatsOverview 
          totalAgents={agents.length} 
          avgTrustScore={avgTrustScore}
          featuredCount={featured.length}
        />

        {/* Search & Filters */}
        <SearchFilters />

        {/* Featured Agents */}
        <FeaturedAgents agents={featured} />

        {/* All Agents Grid */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Agents</h2>
            <span className="text-slate-400">{agents.length} total</span>
          </div>
          <AgentGrid agents={agents} />
        </section>
      </main>
    </div>
  );
}

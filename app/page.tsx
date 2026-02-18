import { getAgents, getFeaturedAgents } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FeaturedAgents } from "@/components/dashboard/FeaturedAgents";
import { AgentGrid } from "@/components/dashboard/AgentGrid";
import { SearchFilters } from "@/components/filters/SearchFilters";

export default async function Home() {
  const [agentsData, featuredData] = await Promise.all([
    getAgents(),
    getFeaturedAgents(),
  ]);

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

        {/* Stats Overview */}
        <StatsOverview 
          totalAgents={agentsData.count} 
          avgTrustScore={Math.round(
            agentsData.agents.reduce((acc, a) => acc + a.trustScore, 0) / agentsData.count
          )}
          featuredCount={featuredData.count}
        />

        {/* Search & Filters */}
        <SearchFilters />

        {/* Featured Agents */}
        <FeaturedAgents agents={featuredData.agents} />

        {/* All Agents Grid */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Agents</h2>
            <span className="text-slate-400">{agentsData.count} total</span>
          </div>
          <AgentGrid agents={agentsData.agents} />
        </section>
      </main>
    </div>
  );
}

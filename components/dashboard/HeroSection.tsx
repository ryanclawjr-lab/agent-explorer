'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
  tooltip?: string;
}

function StatCard({ label, value, subtext, icon, color, tooltip }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="relative overflow-hidden group card-hover">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                  {icon}
                </div>
                {tooltip && (
                  㲺dge variant="secondary" className="text-xs">
                    <Info className="w-3 h-3" />
                  </Badge>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                {subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
                )}
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface HeroSectionProps {
  totalAgents: number;
  avgTrustScore: number;
  featuredCount: number;
  eliteCount?: number;
}

export function HeroSection({ totalAgents, avgTrustScore, featuredCount, eliteCount = 3 }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
      
      <div className="relative px-6 py-12 md:py-16">
        {/* Hero Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover
            <span className="text-gradient"> Trusted</span>
            <br />
            ERC-8004 Agents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The premier trust and reputation hub for AI agents. 
            Verify, compare, and connect with confidence.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Real-time Trust Scores
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              Verified Reputation
            </Badge>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Agent Comparison
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <StatCard
            label="Total Agents"
            value={totalAgents}
            subtext="Registered on-chain"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            }
            color="blue"
            tooltip="Total number of ERC-8004 registered agents"
          />
          
          <StatCard
            label="Avg Trust Score"
            value={`${avgTrustScore}/100`}
            subtext={avgTrustScore >= 90 ? 'Elite tier' : avgTrustScore >= 70 ? 'Verified tier' : 'Standard tier'}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            }
            color="emerald"
            tooltip="Average trust score across all registered agents"
          />
          
          <StatCard
            label="Featured"
            value={featuredCount}
            subtext="Curated agents"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            }
            color="amber"
            tooltip="Premium agents selected for quality and reliability"
          />
          
          <StatCard
            label="Elite Agents"
            value={eliteCount}
            subtext="Trust score 90+"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            }
            color="purple"
            tooltip="Agents with exceptional trust scores (90-100)"
          />
        </div>
      </div>
    </section>
  );
}

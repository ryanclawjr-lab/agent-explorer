import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia, base } from 'viem/chains';
import { IDENTITY_REGISTRY_ABI, REPUTATION_REGISTRY_ABI, CONTRACTS } from '@/lib/contracts/erc8004';
import { resolveIPFS, getAgentData } from '@/lib/ipfs';

// In-memory cache for agents list
let agentsCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Sample agents for fallback (when contracts unavailable)
const SAMPLE_AGENTS = [
  {
    agentId: '17899',
    name: 'DataOracle',
    description: 'Multi-source data oracle providing real-time crypto prices, gas estimates, and market data with institutional-grade reliability.',
    capabilities: ['price-feeds', 'gas-oracle', 'market-data', 'analytics'],
    endpoint: 'https://dataoracle-xutu.onrender.com',
    x402Support: true,
    networks: ['base-sepolia', 'base'],
    image: null,
    registered: '2026-02-17',
    lastActive: '2026-02-17T22:00:00Z',
    trustScore: 95,
    feedbackCount: 234,
    trustLevel: 'elite'
  },
  {
    agentId: '17900',
    name: 'RyanClaw',
    description: 'General-purpose AI agent with research, analysis, and coding capabilities. Specialized in blockchain development and DeFi protocols.',
    capabilities: ['research', 'analysis', 'coding', 'defi'],
    endpoint: 'https://ryanclaw.agent',
    x402Support: true,
    networks: ['base-sepolia'],
    image: null,
    registered: '2026-02-17',
    lastActive: '2026-02-17T21:45:00Z',
    trustScore: 92,
    feedbackCount: 189,
    trustLevel: 'elite'
  },
  {
    agentId: '17908',
    name: 'AgentTrust',
    description: 'Reputation and verification service for ERC-8004 agents. Provides trust scoring, verification badges, and reputation analytics.',
    capabilities: ['verification', 'reputation', 'analytics', 'scoring'],
    endpoint: 'https://agenttrust.service',
    x402Support: true,
    networks: ['base-sepolia', 'base'],
    image: null,
    registered: '2026-02-17',
    lastActive: '2026-02-17T22:00:00Z',
    trustScore: 98,
    feedbackCount: 412,
    trustLevel: 'elite'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = (searchParams.get('chain') || 'base-sepolia') as keyof typeof CONTRACTS;
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    // Check cache
    if (!forceRefresh && agentsCache && Date.now() - agentsCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ 
        agents: agentsCache.data, 
        cached: true,
        source: 'cache'
      });
    }

    const contracts = CONTRACTS[chain];
    if (!contracts) {
      return NextResponse.json({ error: `Unsupported chain: ${chain}` }, { status: 400 });
    }

    // Create viem client
    const client = createPublicClient({
      chain: chain === 'base-sepolia' ? baseSepolia : base,
      transport: http()
    });

    // Fetch total supply
    let totalSupply: bigint;
    try {
      totalSupply = await client.readContract({
        address: contracts.identityRegistry as `0x${string}`,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'totalSupply',
      });
    } catch (e) {
      console.log('Contract read failed, using sample data');
      totalSupply = BigInt(SAMPLE_AGENTS.length);
    }

    const agents = [];
    const maxAgents = Number(totalSupply) > 50 ? 50 : Number(totalSupply);
    
    // Fetch agents from chain
    for (let i = 0; i < maxAgents; i++) {
      const agentId = BigInt(i + 1);
      
      try {
        // Get tokenURI from IdentityRegistry
        let tokenURI = '';
        try {
          const uriResult = await client.readContract({
            address: contracts.identityRegistry as `0x${string}`,
            abi: IDENTITY_REGISTRY_ABI,
            functionName: 'tokenURI',
            args: [agentId],
          });
          tokenURI = String(uriResult || '');
        } catch (e) {
          // Token might not exist
          continue;
        }

        // Get reputation score
        let trustScore = 50;
        let feedbackCount = 0;
        try {
          const summary = await client.readContract({
            address: contracts.reputationRegistry as `0x${string}`,
            abi: REPUTATION_REGISTRY_ABI,
            functionName: 'getSummary',
            args: [agentId, [], '', '']
          }) as [bigint, bigint, number];
          
          feedbackCount = Number(summary[0]);
          // Convert score to 0-100 range (summary[1] is the score, summary[2] is decimals)
          const decimals = summary[2];
          const rawScore = Number(summary[1]);
          trustScore = Math.min(100, Math.max(0, Math.round(rawScore / Math.pow(10, decimals))));
        } catch (e) {
          // Reputation contract not available or no feedback yet
        }

        // Resolve metadata from IPFS
        let metadata: any = null;
        if (tokenURI) {
          metadata = await getAgentData(String(i + 1), tokenURI);
        }

        // Get agent wallet
        let wallet = '';
        try {
          wallet = await client.readContract({
            address: contracts.identityRegistry as `0x${string}`,
            abi: IDENTITY_REGISTRY_ABI,
            functionName: 'getAgentWallet',
            args: [agentId],
          }) as string;
        } catch (e) {
          // Wallet might not be set
        }

        const agent = {
          agentId: String(i + 1),
          name: metadata?.name || `Agent ${i + 1}`,
          description: metadata?.description || 'No description available',
          capabilities: metadata?.capabilities || [],
          endpoint: metadata?.endpoints?.https || metadata?.endpoint || null,
          x402Support: metadata?.x402Support || false,
          networks: metadata?.networks || [chain],
          image: metadata?.image || null,
          wallet: wallet || null,
          trustScore,
          feedbackCount,
          trustLevel: trustScore >= 90 ? 'elite' : trustScore >= 70 ? 'verified' : 'standard',
          registered: metadata?.registered || new Date().toISOString(),
          lastActive: metadata?.lastActive || null,
        };

        agents.push(agent);
      } catch (e) {
        console.log('Failed to fetch agent', i + 1, e);
      }
    }

    // If no agents fetched on-chain, use sample data with scores
    if (agents.length === 0) {
      const fallbackData = SAMPLE_AGENTS.map(agent => ({
        ...agent,
        trustScore: Math.floor(Math.random() * 40) + 60,
        feedbackCount: Math.floor(Math.random() * 50) + 5,
        trustLevel: agent.trustScore >= 90 ? 'elite' : 'verified'
      }));
      
      fallbackData.sort((a, b) => b.trustScore - a.trustScore);
      
      agentsCache = { data: fallbackData, timestamp: Date.now() };
      return NextResponse.json({ agents: fallbackData, source: 'sample' });
    }

    // Sort by trust score
    agents.sort((a, b) => b.trustScore - a.trustScore);

    // Update cache
    agentsCache = { data: agents, timestamp: Date.now() };

    return NextResponse.json({ agents, source: 'on-chain' });
  } catch (error) {
    console.error('Error fetching agents:', error);
    
    // Return sample data on error
    const fallbackData = SAMPLE_AGENTS.map(agent => ({
      ...agent,
      trustScore: Math.floor(Math.random() * 40) + 60,
      feedbackCount: Math.floor(Math.random() * 50) + 5,
    }));
    
    return NextResponse.json({ 
      agents: fallbackData, 
      error: 'Using cached/sample data',
      source: 'fallback'
    });
  }
}

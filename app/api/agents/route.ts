import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ERC8004_IDENTITY_REGISTRY_ABI, REPUTATION_REGISTRY_ABI } from '@/lib/contracts/erc8004';
import { ERC8004_CONTRACTS } from '@/lib/contracts/addresses';

// In-memory cache
let agentsCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Sample agent metadata for development (since we can't fetch from IPFS yet)
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
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') || 'base-sepolia';
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    // Check cache
    if (!forceRefresh && agentsCache && Date.now() - agentsCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ agents: agentsCache.data, cached: true });
    }

    const contracts = ERC8004_CONTRACTS[chain as keyof typeof ERC8004_CONTRACTS];
    if (!contracts) {
      return NextResponse.json({ error: `Unsupported chain: ${chain}` }, { status: 400 });
    }

    // Create viem client
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    // Fetch total supply
    let totalSupply: bigint;
    try {
      totalSupply = await client.readContract({
        address: contracts.identityRegistry as `0x${string}`,
        abi: ERC8004_IDENTITY_REGISTRY_ABI,
        functionName: 'totalSupply',
      });
    } catch (e) {
      console.log('Contract read failed, using sample data');
      totalSupply = BigInt(SAMPLE_AGENTS.length);
    }

    // Fetch agent data (limit to first 100 for performance)
    const agents = [];
    const maxAgents = Number(totalSupply) > 100 ? 100 : Number(totalSupply);
    
    for (let i = 0; i < maxAgents; i++) {
      const agentId = BigInt(i + 1);
      
      try {
        // Get tokenURI
        const tokenURI = await client.readContract({
          address: contracts.identityRegistry as `0x${string}`,
          abi: ERC8004_IDENTITY_REGISTRY_ABI,
          functionName: 'tokenURI',
          args: [agentId],
        });

        // Get reputation score
        let score = 50;
        let feedbackCount = 0;
        try {
          score = Number(await client.readContract({
            address: contracts.reputationRegistry as `0x${string}`,
            abi: REPUTATION_REGISTRY_ABI,
            functionName: 'getScore',
            args: [agentId],
          }));
          
          feedbackCount = Number(await client.readContract({
            address: contracts.reputationRegistry as `0x${string}`,
            abi: REPUTATION_REGISTRY_ABI,
            functionName: 'getFeedbackCount',
            args: [agentId],
          }));
        } catch (e) {
          // Reputation contract not available
        }

        // Parse tokenURI (could be IPFS or HTTPS)
        let metadata: Record<string, any> = {};
        if (tokenURI && typeof tokenURI === 'string') {
          try {
            if (tokenURI.startsWith('ipfs://')) {
              const ipfsHash = tokenURI.replace('ipfs://', '');
              const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
              metadata = await response.json();
            } else if (tokenURI.startsWith('https://')) {
              const response = await fetch(tokenURI);
              metadata = await response.json();
            }
          } catch (e) {
            console.log('Failed to fetch metadata for agent', i + 1);
          }
        }

        agents.push({
          agentId: String(i + 1),
          name: metadata.name || `Agent ${i + 1}`,
          description: metadata.description || 'No description available',
          capabilities: metadata.capabilities || [],
          endpoint: metadata.endpoint || null,
          x402Support: metadata.x402Support || false,
          networks: metadata.networks || [chain],
          image: metadata.image || null,
          trustScore: score > 0 ? score : 50,
          feedbackCount,
          registered: metadata.registered || new Date().toISOString(),
          lastActive: metadata.lastActive || null,
        });
      } catch (e) {
        // Skip failed agents
        console.log('Failed to fetch agent', i + 1);
      }
    }

    // If no agents fetched on-chain, use sample data with scores
    if (agents.length === 0) {
      const agentsWithScores = SAMPLE_AGENTS.map(agent => ({
        ...agent,
        trustScore: Math.floor(Math.random() * 40) + 60, // 60-100
        feedbackCount: Math.floor(Math.random() * 50) + 5,
      }));
      
      // Sort by trust score
      agentsWithScores.sort((a, b) => b.trustScore - a.trustScore);
      
      agentsCache = { data: agentsWithScores, timestamp: Date.now() };
      return NextResponse.json({ agents: agentsWithScores, source: 'sample' });
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

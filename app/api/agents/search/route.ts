import { NextResponse } from 'next/server';
import { getAgents } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const capabilities = searchParams.get('capabilities')?.split(',').filter(Boolean) || [];
  const minTrust = parseInt(searchParams.get('minTrust') || '0');
  const maxTrust = parseInt(searchParams.get('maxTrust') || '100');
  const x402Only = searchParams.get('x402') === 'true';
  const network = searchParams.get('network') || '';
  const featured = searchParams.get('featured') === 'true';
  const sort = searchParams.get('sort') || 'trust-desc';

  try {
    const { agents } = await getAgents();
    
    let results = [...agents];

    // Text search
    if (query) {
      results = results.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.capabilities.some(c => c.toLowerCase().includes(query))
      );
    }

    // Capabilities filter
    if (capabilities.length > 0) {
      results = results.filter(agent =>
        capabilities.some(cap => 
          agent.capabilities.some(agentCap => 
            agentCap.toLowerCase().includes(cap.toLowerCase())
          )
        )
      );
    }

    // Trust score range
    results = results.filter(agent => 
      agent.trustScore >= minTrust && agent.trustScore <= maxTrust
    );

    // x402 support filter
    if (x402Only) {
      results = results.filter(agent => agent.x402Support === true);
    }

    // Network filter
    if (network) {
      results = results.filter(agent => 
        agent.networks?.some(n => n.toLowerCase().includes(network.toLowerCase()))
      );
    }

    // Featured filter
    if (featured) {
      results = results.filter(agent => agent.featured === true);
    }

    // Sorting
    switch (sort) {
      case 'trust-asc':
        results.sort((a, b) => a.trustScore - b.trustScore);
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'feedback-desc':
        results.sort((a, b) => (b.feedbackCount || 0) - (a.feedbackCount || 0));
        break;
      case 'trust-desc':
      default:
        results.sort((a, b) => b.trustScore - a.trustScore);
    }

    return NextResponse.json({
      query,
      count: results.length,
      agents: results
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Search failed',
      agents: [],
      count: 0
    }, { status: 500 });
  }
}

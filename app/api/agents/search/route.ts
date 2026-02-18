import { NextResponse } from 'next/server';
import { getAgents } from '@/lib/api';

// Input sanitization helpers
function sanitizeString(str: string): string {
  // Remove any potential injection characters, limit length
  return str.replace(/[<>\"'%;()&+]/g, '').slice(0, 100);
}

function sanitizeNumber(value: string, min: number, max: number, defaultVal: number): number {
  const num = parseInt(value, 10);
  if (isNaN(num)) return defaultVal;
  return Math.min(max, Math.max(min, num));
}

function sanitizeArray(arr: string[]): string[] {
  return arr.map(sanitizeString).filter(Boolean).slice(0, 10);
}

const ALLOWED_SORTS = ['trust-desc', 'trust-asc', 'name-asc', 'name-desc', 'feedback-desc'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Sanitize all inputs
  const query = sanitizeString(searchParams.get('q') || '');
  const capabilities = sanitizeArray(searchParams.get('capabilities')?.split(',') || []);
  const minTrust = sanitizeNumber(searchParams.get('minTrust') || '0', 0, 100, 0);
  const maxTrust = sanitizeNumber(searchParams.get('maxTrust') || '100', 0, 100, 100);
  const x402Only = searchParams.get('x402') === 'true';
  const network = sanitizeString(searchParams.get('network') || '');
  const featured = searchParams.get('featured') === 'true';
  const sort = ALLOWED_SORTS.includes(searchParams.get('sort') || '') 
    ? searchParams.get('sort') as typeof ALLOWED_SORTS[number]
    : 'trust-desc';

  // Validate range
  if (minTrust > maxTrust) {
    return NextResponse.json({ error: 'Invalid trust range', agents: [], count: 0 }, { status: 400 });
  }

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

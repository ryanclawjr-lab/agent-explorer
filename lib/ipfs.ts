// IPFS Resolution Utility
// Server-side only - never client-side
// Uses automatic fallback with multiple public gateways

const IPFS_GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://w3s.link/ipfs/',
  'https://ipfs.io/ipfs/'
];

const IPFS_TIMEOUT = 5000; // 5 seconds
const CACHE_TTL = 3600; // 1 hour in seconds

// Simple in-memory cache for serverless environment
// Note: In production, use Vercel KV for persistent caching
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface CachedAgentData {
  agentId: string;
  name: string;
  description: string;
  capabilities?: string[];
  endpoints?: {
    a2a?: string;
    mcp?: string;
    https?: string;
  };
  x402Support?: boolean;
  networks?: string[];
  image?: string;
  [key: string]: any;
}

/**
 * Resolve IPFS URI to JSON data with automatic gateway fallback
 * Server-side only - use in Vercel Edge Functions / API routes
 */
export async function resolveIPFS(uri: string): Promise<any> {
  if (!uri) return null;
  
  // Handle HTTPS URIs directly
  if (uri.startsWith('https://')) {
    try {
      const res = await fetch(uri, { signal: AbortSignal.timeout(IPFS_TIMEOUT) });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  }
  
  // Handle IPFS URIs
  if (!uri.startsWith('ipfs://')) {
    console.warn('Unknown URI format:', uri);
    return null;
  }
  
  const cid = uri.replace('ipfs://', '');
  
  // Try each gateway in priority order
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const res = await fetch(gateway + cid, { 
        signal: AbortSignal.timeout(IPFS_TIMEOUT) 
      });
      
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.log(`Gateway ${gateway} failed for ${cid}, trying next...`);
      continue;
    }
  }
  
  // All gateways failed
  throw new Error(`All IPFS gateways failed for: ${cid}`);
}

/**
 * Get cached agent data or resolve from IPFS
 * Always returns cached data if available (even stale)
 * Never throws to user - always returns something
 */
export async function getAgentData(agentId: string, tokenURI?: string): Promise<CachedAgentData | null> {
  const cacheKey = `agent:${agentId}`;
  
  // Check memory cache first
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return cached.data as CachedAgentData;
  }
  
  // If no tokenURI provided, return null
  if (!tokenURI) {
    return null;
  }
  
  try {
    // Resolve from IPFS
    const data = await resolveIPFS(tokenURI);
    
    if (data) {
      // Cache the resolved data
      memoryCache.set(cacheKey, {
        data: {
          ...data,
          agentId
        },
        timestamp: Date.now()
      });
      
      return {
        ...data,
        agentId
      } as CachedAgentData;
    }
  } catch (error) {
    console.error('Failed to resolve agent data:', error);
  }
  
  // Return null if everything failed
  return null;
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearCache(agentId?: string): void {
  if (agentId) {
    memoryCache.delete(`agent:${agentId}`);
  } else {
    memoryCache.clear();
  }
}

/**
 * Get cache stats (useful for debugging)
 */
export function getCacheStats(): { size: number; agents: string[] } {
  return {
    size: memoryCache.size,
    agents: Array.from(memoryCache.keys()).map(k => k.replace('agent:', ''))
  };
}

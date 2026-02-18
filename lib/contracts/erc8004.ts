// ERC-8004 Identity Registry Contract Interface
// Contract Address: 0x...
// Chain: Base mainnet (chainId: 8453)

export const ERC8004_IDENTITY_REGISTRY_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Reputation Registry - gets trust scores
export const REPUTATION_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    name: 'getScore',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    name: 'getFeedbackCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }, { internalType: 'uint256', name: 'offset', type: 'uint256' }, { internalType: 'uint256', name: 'limit', type: 'uint256' }],
    name: 'getFeedback',
    outputs: [{ components: [{ internalType: 'address', name: 'reviewer', type: 'address' }, { internalType: 'int256', name: 'score', type: 'int256' }, { internalType: 'string', name: 'comment', type: 'string' }, { internalType: 'uint256', name: 'timestamp', type: 'uint256' }], internalType: 'struct ReputationRegistry.Feedback[]', name: '', type: 'tuple[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Chain configurations
export const CHAINS = {
  base: {
    id: 8453,
    name: 'Base',
    rpc: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    contracts: {
      identityRegistry: '0x0000000000000000000000000000000000000800', // Example - needs real address
      reputationRegistry: '0x0000000000000000000000000000000000000801'
    }
  },
  sepolia: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    rpc: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/demo',
    contracts: {
      identityRegistry: '0x0000000000000000000000000000000000000800',
      reputationRegistry: '0x0000000000000000000000000000000000000801'
    }
  }
} as const;

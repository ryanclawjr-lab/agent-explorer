// ERC-8004 Contract Addresses by Chain
// Source: https://github.com/erc-8004/erc-8004-contracts

export const ERC8004_CONTRACTS = {
  // Base Mainnet
  base: {
    identityRegistry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    reputationRegistry: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
  },
  // Base Sepolia (Testnet)
  'base-sepolia': {
    identityRegistry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    reputationRegistry: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
  },
  // Ethereum Mainnet
  ethereum: {
    identityRegistry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    reputationRegistry: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
  },
  // Ethereum Sepolia
  sepolia: {
    identityRegistry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    reputationRegistry: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
  }
} as const;

export const CHAIN_CONFIG = {
  base: {
    id: 8453,
    name: 'Base',
    rpc: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  },
  'base-sepolia': {
    id: 84532,
    name: 'Base Sepolia',
    rpc: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
  },
  sepolia: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    rpc: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/demo',
  }
} as const;

// Default to Base Sepolia for development
export const DEFAULT_CHAIN = 'base-sepolia';

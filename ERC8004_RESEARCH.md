# ERC-8004 Contract Research (Tali)

## Contract Addresses (from erc-8004-contracts repo)

### Base Mainnet
- **IdentityRegistry:** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **ReputationRegistry:** `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`

### Base Sepolia (Testnet)
- **IdentityRegistry:** `0x8004A818BFB912233c491871b3d84c89A494BD9e`
- **ReputationRegistry:** `0x8004B663056A597Dffe9eCcC1965A193B7388713`

---

## Key Read Functions

### IdentityRegistry (ERC-721 based)

| Function | Returns | Description |
|----------|---------|-------------|
| `totalSupply()` | uint256 | Total registered agents |
| `ownerOf(uint256 tokenId)` | address | Owner of agent NFT |
| `tokenURI(uint256 tokenId)` | string | IPFS/HTTPS URI to JSON metadata |
| `balanceOf(address owner)` | uint256 | Number of agents owned |
| `getAgentWallet(uint256 agentId)` | address | Agent's designated wallet |
| `getMetadata(uint256 agentId, string metadataKey)` | bytes | Get specific metadata field |
| `name()` | string | "ERC8004" |
| `symbol()` | string | "AGN" |

### ReputationRegistry

| Function | Returns | Description |
|----------|---------|-------------|
| `getSummary(uint256 agentId, address[] clientAddresses, string tag1, string tag2)` | (count, summaryValue, decimals) | Get aggregated score |
| `readFeedback(uint256 agentId, address client, uint64 index)` | (value, decimals, tag1, tag2, revoked) | Read single feedback |
| `readAllFeedback(uint256 agentId, address[] clients, string tag1, string tag2, bool includeRevoked)` | Full feedback data | Read all feedback |
| `getClients(uint256 agentId)` | address[] | List of clients who gave feedback |
| `getLastIndex(uint256 agentId, address client)` | uint64 | Latest feedback index |
| `getIdentityRegistry()` | address | Linked IdentityRegistry |

---

## Agent JSON Metadata Schema

From 8004scan.io best practices:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My Agent",
  "description": "What my agent does",
  "image": "https://example.com/logo.png",
  "capabilities": ["coding", "research"],
  "endpoints": {
    "a2a": "a2a://agent-address",
    "mcp": "https://mcp-server.com",
    "https": "https://api.agent.com"
  },
  "x402Support": true,
  "networks": ["base", "ethereum"]
}
```

---

## IPFS Resolution

### How 8004scan.io handles IPFS:
- Accepts both `ipfs://` and `https://` URIs
- Uses IPFS gateway: `https://ipfs.io/ipfs/{hash}`
- Also supports HTTPS URIs directly
- Supports mutable metadata via HTTP (IPFS is immutable)

### Recommended Gateways (in order of preference):
1. **Cloudflare:** `https://cloudflare-ipfs.com/ipfs/{hash}`
2. **W3S.Link:** `https://w3s.link/ipfs/{hash}`
3. **IPFS.io (public):** `https://ipfs.io/ipfs/{hash}`

---

## Test Agents to Verify Pipeline

Since direct Base mainnet queries are complex, we'll test with:
1. Sample data with randomized trust scores (60-100)
2. Agent IDs: 17899, 17900, 17908 (our registered agents)

The data pipeline will:
1. Fetch `totalSupply()` from IdentityRegistry
2. Loop through agent IDs 1 to totalSupply
3. Call `tokenURI(agentId)` for each
4. Fetch JSON from IPFS/HTTPS
5. Call `getSummary()` from ReputationRegistry
6. Cache results for 5 minutes

---

## Next Steps (Mordin)

1. Update `/app/api/agents/route.ts` with correct ABIs
2. Use viem to call `totalSupply()` and `tokenURI()`
3. Handle IPFS resolution with Cloudflare gateway
4. Test with Base Sepolia testnet first
5. Then switch to Base mainnet

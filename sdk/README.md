# Canix SDK

TypeScript SDK for Canix - Programmatically explore DeFi yield opportunities on Algorand.

## Installation

```bash
npm install @canix/sdk
```

## Quick Start

```typescript
import { CanixClient } from '@canix/sdk';

const canix = new CanixClient();

// Get all yield opportunities
const yields = await canix.getYields();

console.log(`Found ${yields.length} yield opportunities`);
yields.forEach(y => {
  console.log(`${y.asset} on ${y.platform}: ${y.apyFormatted} APY`);
});
```

## Features

- 🔍 **Search & Filter** - Search by asset name or filter by multiple criteria
- 📊 **Rich Data** - Get APY, TVL, rewards, and categorized asset types
- 🎯 **Type Safe** - Full TypeScript support with comprehensive types
- ⚡ **Fast** - Efficient filtering and data transformation
- 🛠️ **Flexible** - Supports multiple filter combinations

## Usage

### Basic Usage

```typescript
import { CanixClient } from '@canix/sdk';

const canix = new CanixClient();

// Get all yields
const allYields = await canix.getYields();
```

### Search

Search across asset names, platforms, and rewards:

```typescript
// Find all opportunities related to ALGO
const algoYields = await canix.getYields({ 
  search: 'ALGO' 
});

// Find USDC opportunities
const usdcYields = await canix.getYields({ 
  search: 'USDC' 
});
```

### Filter by Platform

```typescript
// Single platform
const tinymanYields = await canix.getYields({ 
  platform: 'Tinyman' 
});

// Multiple platforms
const yields = await canix.getYields({ 
  platform: ['Tinyman', 'CompX', 'Folks Finance'] 
});
```

Available platforms:
- `Tinyman`
- `CompX`
- `Folks Finance`
- `Pact`
- `Orbital Lending`

### Filter by Asset Type

```typescript
// Single asset type
const stablecoins = await canix.getYields({ 
  assetType: 'Stablecoin' 
});

// Multiple asset types
const yields = await canix.getYields({ 
  assetType: ['Stablecoin', 'Yield bearing'] 
});
```

Available asset types:
- `Standard Asset`
- `Liquidity Token`
- `Stablecoin`
- `Governance`
- `Yield bearing`
- `RWA` (Real World Assets)

### Filter by Yield Type

```typescript
// Single yield type
const lpYields = await canix.getYields({ 
  yieldType: 'Liquidity Pool' 
});

// Multiple yield types
const yields = await canix.getYields({ 
  yieldType: ['Lending', 'Staking'] 
});
```

Available yield types:
- `Liquidity Pool`
- `Lending`
- `Staking`
- `Farming`

### Filter by APY Range

```typescript
// Minimum APY of 10%
const highYields = await canix.getYields({ 
  minApy: 10 
});

// APY between 5% and 20%
const moderateYields = await canix.getYields({ 
  minApy: 5,
  maxApy: 20 
});
```

### Filter by TVL Range

```typescript
// Minimum TVL of $1M
const largePools = await canix.getYields({ 
  minTvl: 1000000 
});

// TVL between $100K and $10M
const mediumPools = await canix.getYields({ 
  minTvl: 100000,
  maxTvl: 10000000 
});
```

### Combine Multiple Filters

```typescript
// Find high-yield stablecoin lending opportunities
const filtered = await canix.getYields({
  search: 'USDC',
  assetType: 'Stablecoin',
  yieldType: 'Lending',
  minApy: 5,
  minTvl: 100000,
  platform: ['Folks Finance', 'Orbital Lending']
});
```

## Response Format

Each yield opportunity includes:

```typescript
interface YieldOpportunity {
  platform: string;          // e.g., "Tinyman"
  asset: string;             // e.g., "ALGO-USDC"
  assetType: AssetType;      // e.g., "Liquidity Token"
  yieldType: YieldType;      // e.g., "Liquidity Pool"
  apy: number;               // e.g., 12.5
  apyFormatted: string;      // e.g., "12.50%"
  tvl: number;               // e.g., 1500000
  tvlFormatted: string;      // e.g., "1.50M"
  rewards: string[];         // e.g., ["ALGO", "TINY"]
  rewardsFormatted: string;  // e.g., "ALGO, TINY"
}
```

## Configuration

You can customize the SDK configuration:

```typescript
const canix = new CanixClient({
  apiBaseUrl: 'https://api-general.compx.io', // Custom API URL
  timeout: 15000,                               // Request timeout (ms)
  headers: {                                    // Custom headers
    'Authorization': 'Bearer token'
  }
});
```

## Examples

### Find Best Stablecoin Yields

```typescript
const bestStableYields = await canix.getYields({
  assetType: 'Stablecoin',
  minApy: 5,
  minTvl: 50000
});

// Sort by APY
bestStableYields.sort((a, b) => b.apy - a.apy);

console.log('Top 5 Stablecoin Yields:');
bestStableYields.slice(0, 5).forEach((y, i) => {
  console.log(`${i + 1}. ${y.asset} on ${y.platform}: ${y.apyFormatted}`);
});
```

### Compare Platforms

```typescript
const platforms = ['Tinyman', 'CompX', 'Folks Finance'];
const comparison = await Promise.all(
  platforms.map(async (platform) => {
    const yields = await canix.getYields({ platform });
    const avgApy = yields.reduce((sum, y) => sum + y.apy, 0) / yields.length;
    return { platform, avgApy, count: yields.length };
  })
);

console.log('Platform Comparison:');
comparison.forEach(({ platform, avgApy, count }) => {
  console.log(`${platform}: ${count} opportunities, ${avgApy.toFixed(2)}% avg APY`);
});
```

### Monitor High-Yield Opportunities

```typescript
async function monitorHighYields() {
  const highYields = await canix.getYields({ 
    minApy: 20,
    minTvl: 100000 
  });

  if (highYields.length > 0) {
    console.log(`⚡ Found ${highYields.length} high-yield opportunities:`);
    highYields.forEach(y => {
      console.log(`  ${y.asset} on ${y.platform}: ${y.apyFormatted} (TVL: ${y.tvlFormatted})`);
    });
  }
}

// Run every 5 minutes
setInterval(monitorHighYields, 5 * 60 * 1000);
```

## Error Handling

```typescript
try {
  const yields = await canix.getYields();
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Request timed out');
  } else if (error.message.includes('Failed to fetch')) {
    console.error('Network error');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type { 
  YieldOpportunity, 
  GetYieldsFilters,
  AssetType,
  YieldType 
} from '@canix/sdk';

const filters: GetYieldsFilters = {
  assetType: 'Stablecoin',
  minApy: 5
};

const yields: YieldOpportunity[] = await canix.getYields(filters);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT


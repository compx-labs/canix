# Canix SDK - Quick Start Guide

## Installation

```bash
cd /Users/kierannelson/Development/canix/sdk
npm install
npm run build
```

## Development

```bash
# Watch mode for development
npm run dev
```

## Testing the SDK Locally

### Option 1: Run the example file

```bash
# Build the SDK first
npm run build

# Run the example (requires ts-node or tsx)
npx tsx examples/basic-usage.ts
```

### Option 2: Link locally for testing in other projects

```bash
# In the SDK directory
npm link

# In your project directory (e.g., frontend)
npm link @canix/sdk
```

### Option 3: Use it directly in the Canix frontend

In your `frontend/src/services/api.js`, you can now use:

```javascript
import { CanixClient } from '@canix/sdk';

const canix = new CanixClient();
const yields = await canix.getYields();
```

## Basic Usage

```typescript
import { CanixClient } from '@canix/sdk';

// Initialize
const canix = new CanixClient();

// Get all yields
const allYields = await canix.getYields();

// Search for ALGO
const algoYields = await canix.getYields({ search: 'ALGO' });

// Filter by platform
const tinymanYields = await canix.getYields({ platform: 'Tinyman' });

// Filter by asset type
const stablecoins = await canix.getYields({ assetType: 'Stablecoin' });

// Filter by yield type
const lending = await canix.getYields({ yieldType: 'Lending' });

// High yield opportunities
const highYields = await canix.getYields({ minApy: 10 });

// Combine filters
const filtered = await canix.getYields({
  search: 'USDC',
  assetType: 'Stablecoin',
  yieldType: 'Lending',
  minApy: 5,
  platform: 'Folks Finance'
});
```

## Available Filter Options

### Search
- `search: string` - Search across asset names, platforms, and rewards

### Asset Types
- `Standard Asset`
- `Liquidity Token`
- `Stablecoin`
- `Governance`
- `Yield bearing`
- `RWA` (Real World Assets)

### Platforms
- `Tinyman`
- `CompX`
- `Folks Finance`
- `Pact`
- `Orbital Lending`

### Yield Types
- `Liquidity Pool`
- `Lending`
- `Staking`
- `Farming`

### Numeric Filters
- `minApy` - Minimum APY percentage
- `maxApy` - Maximum APY percentage
- `minTvl` - Minimum TVL in USD
- `maxTvl` - Maximum TVL in USD

## Response Format

Each yield opportunity includes:

```typescript
{
  platform: string;          // "Tinyman"
  asset: string;             // "ALGO-USDC"
  assetType: AssetType;      // "Liquidity Token"
  yieldType: YieldType;      // "Liquidity Pool"
  apy: number;               // 12.5
  apyFormatted: string;      // "12.50%"
  tvl: number;               // 1500000
  tvlFormatted: string;      // "1.50M"
  rewards: string[];         // ["ALGO", "TINY"]
  rewardsFormatted: string;  // "ALGO, TINY"
}
```

## Publishing (when ready)

1. Update version in `package.json`
2. Build the package: `npm run build`
3. Publish to npm: `npm publish --access public`

## Directory Structure

```
sdk/
├── src/
│   ├── index.ts          # Main entry point
│   ├── client.ts         # CanixClient class
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── examples/
│   └── basic-usage.ts    # Usage examples
├── dist/                 # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```


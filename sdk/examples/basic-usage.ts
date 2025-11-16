/**
 * Basic usage examples for the Canix SDK
 */

import { CanixClient } from '../src/index';

async function main() {
  // Initialize the client
  const canix = new CanixClient();

  console.log('🔍 Canix SDK Examples\n');

  // Example 1: Get all yields
  console.log('1. Getting all yield opportunities...');
  const allYields = await canix.getYields();
  console.log(`   Found ${allYields.length} opportunities\n`);

  // Example 2: Search for ALGO yields
  console.log('2. Searching for ALGO yields...');
  const algoYields = await canix.getYields({ search: 'ALGO' });
  console.log(`   Found ${algoYields.length} ALGO opportunities`);
  algoYields.slice(0, 3).forEach(y => {
    console.log(`   - ${y.asset} on ${y.platform}: ${y.apyFormatted}`);
  });
  console.log();

  // Example 3: Filter by platform
  console.log('3. Getting Tinyman yields...');
  const tinymanYields = await canix.getYields({ platform: 'Tinyman' });
  console.log(`   Found ${tinymanYields.length} opportunities on Tinyman\n`);

  // Example 4: Filter by asset type
  console.log('4. Getting stablecoin yields...');
  const stablecoins = await canix.getYields({ assetType: 'Stablecoin' });
  console.log(`   Found ${stablecoins.length} stablecoin opportunities`);
  stablecoins.slice(0, 3).forEach(y => {
    console.log(`   - ${y.asset} on ${y.platform}: ${y.apyFormatted}`);
  });
  console.log();

  // Example 5: Filter by yield type
  console.log('5. Getting lending opportunities...');
  const lending = await canix.getYields({ yieldType: 'Lending' });
  console.log(`   Found ${lending.length} lending opportunities\n`);

  // Example 6: High yield opportunities
  console.log('6. Finding high-yield opportunities (>10% APY)...');
  const highYields = await canix.getYields({ minApy: 10 });
  console.log(`   Found ${highYields.length} high-yield opportunities`);
  
  // Sort by APY and show top 5
  highYields.sort((a, b) => b.apy - a.apy);
  console.log('   Top 5:');
  highYields.slice(0, 5).forEach((y, i) => {
    console.log(`   ${i + 1}. ${y.asset} on ${y.platform}: ${y.apyFormatted} (TVL: ${y.tvlFormatted})`);
  });
  console.log();

  // Example 7: Combine multiple filters
  console.log('7. Complex filter: Stablecoin lending with >5% APY...');
  const filtered = await canix.getYields({
    assetType: 'Stablecoin',
    yieldType: 'Lending',
    minApy: 5,
    minTvl: 50000
  });
  console.log(`   Found ${filtered.length} matching opportunities`);
  filtered.forEach(y => {
    console.log(`   - ${y.asset} on ${y.platform}: ${y.apyFormatted} (TVL: ${y.tvlFormatted})`);
  });
  console.log();

  // Example 8: Platform comparison
  console.log('8. Comparing platforms...');
  const platforms = ['Tinyman', 'CompX', 'Folks Finance'];
  for (const platform of platforms) {
    const yields = await canix.getYields({ platform });
    const avgApy = yields.reduce((sum, y) => sum + y.apy, 0) / yields.length;
    const totalTvl = yields.reduce((sum, y) => sum + y.tvl, 0);
    console.log(`   ${platform}:`);
    console.log(`     - ${yields.length} opportunities`);
    console.log(`     - Avg APY: ${avgApy.toFixed(2)}%`);
    console.log(`     - Total TVL: $${(totalTvl / 1000000).toFixed(2)}M`);
  }
}

// Run examples
main().catch(console.error);


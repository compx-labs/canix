/**
 * Simple test script to verify the SDK works
 * Run with: node test-sdk.js
 */

const { CanixClient } = require('./dist/index.js');

async function test() {
  console.log('🧪 Testing Canix SDK...\n');

  try {
    const canix = new CanixClient();

    // Test 1: Get all yields
    console.log('✅ Test 1: Getting all yields...');
    const allYields = await canix.getYields();
    console.log(`   Found ${allYields.length} opportunities`);
    
    if (allYields.length > 0) {
      const first = allYields[0];
      console.log(`   Sample: ${first.asset} on ${first.platform}: ${first.apyFormatted}`);
    }
    console.log();

    // Test 2: Search filter
    console.log('✅ Test 2: Testing search filter...');
    const searchResults = await canix.getYields({ search: 'ALGO' });
    console.log(`   Found ${searchResults.length} results for "ALGO"`);
    console.log();

    // Test 3: Platform filter
    console.log('✅ Test 3: Testing platform filter...');
    const tinymanYields = await canix.getYields({ platform: 'Tinyman' });
    console.log(`   Found ${tinymanYields.length} opportunities on Tinyman`);
    console.log();

    // Test 4: Asset type filter
    console.log('✅ Test 4: Testing asset type filter...');
    const stablecoins = await canix.getYields({ assetType: 'Stablecoin' });
    console.log(`   Found ${stablecoins.length} stablecoin opportunities`);
    console.log();

    // Test 5: APY filter
    console.log('✅ Test 5: Testing APY filter...');
    const highYields = await canix.getYields({ minApy: 10 });
    console.log(`   Found ${highYields.length} opportunities with >10% APY`);
    if (highYields.length > 0) {
      highYields.sort((a, b) => b.apy - a.apy);
      console.log(`   Highest: ${highYields[0].asset} on ${highYields[0].platform}: ${highYields[0].apyFormatted}`);
    }
    console.log();

    // Test 6: Combined filters
    console.log('✅ Test 6: Testing combined filters...');
    const filtered = await canix.getYields({
      assetType: 'Stablecoin',
      minApy: 3
    });
    console.log(`   Found ${filtered.length} stablecoin opportunities with >3% APY`);
    console.log();

    console.log('✅ All tests passed!\n');
    console.log('📊 Summary:');
    console.log(`   Total opportunities: ${allYields.length}`);
    console.log(`   Platforms: ${new Set(allYields.map(y => y.platform)).size}`);
    console.log(`   Asset types: ${new Set(allYields.map(y => y.assetType)).size}`);
    console.log(`   Yield types: ${new Set(allYields.map(y => y.yieldType)).size}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();


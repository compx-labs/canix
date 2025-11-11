/**
 * TypeScript usage examples demonstrating type safety
 */

import { 
  CanixClient, 
  type YieldOpportunity, 
  type GetYieldsFilters,
  type AssetType,
  type Platform 
} from '../src/index';

// Initialize client
const canix = new CanixClient();

/**
 * Example 1: Basic usage with type inference
 */
async function example1() {
  const yields: YieldOpportunity[] = await canix.getYields();
  
  yields.forEach((opportunity) => {
    // TypeScript knows all properties
    console.log({
      platform: opportunity.platform,
      asset: opportunity.asset,
      apy: opportunity.apy,
      tvl: opportunity.tvl
    });
  });
}

/**
 * Example 2: Using typed filters
 */
async function example2() {
  const filters: GetYieldsFilters = {
    search: 'ALGO',
    assetType: 'Stablecoin',
    platform: ['Tinyman', 'CompX'],
    minApy: 5
  };
  
  const yields = await canix.getYields(filters);
  return yields;
}

/**
 * Example 3: Type-safe filter builder
 */
class FilterBuilder {
  private filters: GetYieldsFilters = {};
  
  search(term: string): this {
    this.filters.search = term;
    return this;
  }
  
  assetType(type: AssetType | AssetType[]): this {
    this.filters.assetType = type;
    return this;
  }
  
  platform(platform: Platform | Platform[]): this {
    this.filters.platform = platform;
    return this;
  }
  
  minApy(apy: number): this {
    this.filters.minApy = apy;
    return this;
  }
  
  maxApy(apy: number): this {
    this.filters.maxApy = apy;
    return this;
  }
  
  minTvl(tvl: number): this {
    this.filters.minTvl = tvl;
    return this;
  }
  
  maxTvl(tvl: number): this {
    this.filters.maxTvl = tvl;
    return this;
  }
  
  build(): GetYieldsFilters {
    return this.filters;
  }
}

async function example3() {
  const filters = new FilterBuilder()
    .search('USDC')
    .assetType('Stablecoin')
    .platform(['Tinyman', 'CompX'])
    .minApy(5)
    .minTvl(100000)
    .build();
  
  const yields = await canix.getYields(filters);
  return yields;
}

/**
 * Example 4: Aggregation and analytics
 */
async function example4() {
  const yields = await canix.getYields();
  
  // Calculate statistics
  const stats = {
    totalOpportunities: yields.length,
    averageApy: yields.reduce((sum, y) => sum + y.apy, 0) / yields.length,
    totalTvl: yields.reduce((sum, y) => sum + y.tvl, 0),
    platforms: new Set(yields.map(y => y.platform)).size,
    assetTypes: new Set(yields.map(y => y.assetType)).size,
    yieldTypes: new Set(yields.map(y => y.yieldType)).size,
  };
  
  return stats;
}

/**
 * Example 5: Platform comparison
 */
async function example5() {
  const platforms: Platform[] = ['Tinyman', 'CompX', 'Folks Finance'];
  
  const comparison = await Promise.all(
    platforms.map(async (platform) => {
      const yields = await canix.getYields({ platform });
      
      return {
        platform,
        opportunities: yields.length,
        averageApy: yields.reduce((sum, y) => sum + y.apy, 0) / yields.length,
        totalTvl: yields.reduce((sum, y) => sum + y.tvl, 0),
        topYield: yields.sort((a, b) => b.apy - a.apy)[0]
      };
    })
  );
  
  return comparison;
}

/**
 * Example 6: Real-time monitoring
 */
class YieldMonitor {
  private canix: CanixClient;
  private lastCheck: Date | null = null;
  
  constructor() {
    this.canix = new CanixClient();
  }
  
  async findHighYields(minApy: number = 20): Promise<YieldOpportunity[]> {
    const yields = await this.canix.getYields({ 
      minApy,
      minTvl: 50000 
    });
    
    this.lastCheck = new Date();
    return yields;
  }
  
  async findStablecoinYields(minApy: number = 5): Promise<YieldOpportunity[]> {
    return await this.canix.getYields({
      assetType: 'Stablecoin',
      minApy
    });
  }
  
  async compareYieldTypes(): Promise<Record<string, number>> {
    const yields = await this.canix.getYields();
    
    const byType: Record<string, number> = {};
    yields.forEach((y) => {
      if (!byType[y.yieldType]) {
        byType[y.yieldType] = 0;
      }
      byType[y.yieldType] += y.apy;
    });
    
    // Calculate average
    Object.keys(byType).forEach((type) => {
      const count = yields.filter(y => y.yieldType === type).length;
      byType[type] = byType[type] / count;
    });
    
    return byType;
  }
}

/**
 * Example 7: Custom data transformation
 */
interface SimplifiedYield {
  name: string;
  platform: string;
  apy: number;
  tvl: number;
}

async function example7(): Promise<SimplifiedYield[]> {
  const yields = await canix.getYields({ minApy: 10 });
  
  return yields.map((y) => ({
    name: y.asset,
    platform: y.platform,
    apy: y.apy,
    tvl: y.tvl
  }));
}

/**
 * Run all examples
 */
async function main() {
  console.log('TypeScript Examples\n');
  
  // Example 4: Stats
  console.log('Overall Statistics:');
  const stats = await example4();
  console.log(stats);
  console.log();
  
  // Example 5: Platform comparison
  console.log('Platform Comparison:');
  const comparison = await example5();
  comparison.forEach((c) => {
    console.log(`${c.platform}:`);
    console.log(`  Opportunities: ${c.opportunities}`);
    console.log(`  Average APY: ${c.averageApy.toFixed(2)}%`);
    console.log(`  Total TVL: $${(c.totalTvl / 1000000).toFixed(2)}M`);
    if (c.topYield) {
      console.log(`  Top Yield: ${c.topYield.asset} (${c.topYield.apyFormatted})`);
    }
  });
  console.log();
  
  // Example 6: Monitor
  console.log('High Yield Monitoring:');
  const monitor = new YieldMonitor();
  const highYields = await monitor.findHighYields(20);
  console.log(`Found ${highYields.length} opportunities with >20% APY`);
  
  const yieldTypeComparison = await monitor.compareYieldTypes();
  console.log('Average APY by Yield Type:');
  Object.entries(yieldTypeComparison).forEach(([type, avgApy]) => {
    console.log(`  ${type}: ${avgApy.toFixed(2)}%`);
  });
}

// Only run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other modules
export {
  FilterBuilder,
  YieldMonitor,
  example1,
  example2,
  example3,
  example4,
  example5,
  example7
};


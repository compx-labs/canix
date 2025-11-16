import type {
  CanixConfig,
  RawYieldOpportunity,
  YieldOpportunity,
  GetYieldsFilters,
} from './types';
import {
  categorizeAssetType,
  mapYieldType,
  formatTVL,
  formatAPY,
  extractRewardAssets,
  toArray,
} from './utils';

const DEFAULT_API_BASE_URL = 'https://api-general.compx.io';
const DEFAULT_TIMEOUT = 10000;

/**
 * Canix SDK Client
 * 
 * @example
 * ```typescript
 * const canix = new CanixClient();
 * 
 * // Get all yields
 * const allYields = await canix.getYields();
 * 
 * // Filter by platform
 * const tinymanYields = await canix.getYields({ platform: 'Tinyman' });
 * 
 * // Multiple filters
 * const filtered = await canix.getYields({
 *   search: 'ALGO',
 *   assetType: 'Stablecoin',
 *   minApy: 5,
 *   platform: ['Tinyman', 'CompX']
 * });
 * ```
 */
export class CanixClient {
  private apiBaseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: CanixConfig = {}) {
    this.apiBaseUrl = config.apiBaseUrl || DEFAULT_API_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Fetch yield opportunities with optional filtering
   * 
   * @param filters - Optional filters to apply to the results
   * @returns Array of yield opportunities
   * 
   * @example
   * ```typescript
   * // Get all yields
   * const yields = await canix.getYields();
   * 
   * // Search for ALGO yields
   * const algoYields = await canix.getYields({ search: 'ALGO' });
   * 
   * // Filter by asset type
   * const stablecoins = await canix.getYields({ assetType: 'Stablecoin' });
   * 
   * // Filter by platform
   * const tinymanYields = await canix.getYields({ platform: 'Tinyman' });
   * 
   * // Multiple platforms
   * const yields = await canix.getYields({ 
   *   platform: ['Tinyman', 'CompX'] 
   * });
   * 
   * // Filter by yield type
   * const lpYields = await canix.getYields({ yieldType: 'Liquidity Pool' });
   * 
   * // Minimum APY
   * const highYields = await canix.getYields({ minApy: 10 });
   * 
   * // Combine filters
   * const filtered = await canix.getYields({
   *   search: 'USDC',
   *   assetType: 'Stablecoin',
   *   minApy: 5,
   *   platform: 'Folks Finance',
   *   yieldType: 'Lending'
   * });
   * ```
   */
  async getYields(filters?: GetYieldsFilters): Promise<YieldOpportunity[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiBaseUrl}/api/getOpportunities`, {
        headers: this.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json() as RawYieldOpportunity[];
      const transformed = this.transformData(rawData);
      
      return filters ? this.filterYields(transformed, filters) : transformed;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  /**
   * Transform raw API data to YieldOpportunity format
   */
  private transformData(rawData: RawYieldOpportunity[]): YieldOpportunity[] {
    return rawData.map((item) => {
      const assetType = categorizeAssetType(item.assetType, item.assetName);
      const yieldType = mapYieldType(item.type);
      const rewards = extractRewardAssets(item.rewardAssets);

      return {
        platform: item.platform || 'Unknown',
        asset: item.assetName || 'Unknown Asset',
        assetType,
        yieldType,
        apy: item.apy || 0,
        apyFormatted: formatAPY(item.apy || 0),
        tvl: item.tvl || 0,
        tvlFormatted: formatTVL(item.tvl || 0),
        rewards,
        rewardsFormatted: rewards.length > 0 ? rewards.join(', ') : 'N/A',
      };
    });
  }

  /**
   * Apply filters to yield opportunities
   */
  private filterYields(
    yields: YieldOpportunity[],
    filters: GetYieldsFilters
  ): YieldOpportunity[] {
    return yields.filter((opportunity) => {
      // Search filter (case-insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          opportunity.asset.toLowerCase().includes(searchLower) ||
          opportunity.platform.toLowerCase().includes(searchLower) ||
          opportunity.rewardsFormatted.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Asset type filter
      if (filters.assetType) {
        const assetTypes = toArray(filters.assetType);
        if (!assetTypes.includes(opportunity.assetType)) return false;
      }

      // Platform filter
      if (filters.platform) {
        const platforms = toArray(filters.platform);
        if (!platforms.includes(opportunity.platform)) return false;
      }

      // Yield type filter
      if (filters.yieldType) {
        const yieldTypes = toArray(filters.yieldType);
        if (!yieldTypes.includes(opportunity.yieldType)) return false;
      }

      // APY range filters
      if (filters.minApy !== undefined && opportunity.apy < filters.minApy) {
        return false;
      }
      if (filters.maxApy !== undefined && opportunity.apy > filters.maxApy) {
        return false;
      }

      // TVL range filters
      if (filters.minTvl !== undefined && opportunity.tvl < filters.minTvl) {
        return false;
      }
      if (filters.maxTvl !== undefined && opportunity.tvl > filters.maxTvl) {
        return false;
      }

      return true;
    });
  }
}


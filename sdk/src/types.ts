/**
 * Platform types supported by Canix
 */
export type Platform = 
  | "Tinyman" 
  | "CompX" 
  | "Folks Finance" 
  | "Pact" 
  | "Orbital Lending"
  | string;

/**
 * Asset type categories
 */
export type AssetType = 
  | "Standard Asset"
  | "Liquidity Token"
  | "Stablecoin"
  | "Governance"
  | "Yield bearing"
  | "RWA";

/**
 * Yield opportunity types
 */
export type YieldType = 
  | "Liquidity Pool"
  | "Lending"
  | "Staking"
  | "Farming";

/**
 * Raw API response for a single yield opportunity
 */
export interface RawYieldOpportunity {
  platform: string;
  assetName: string;
  assetType?: string;
  type: string;
  apy: number;
  tvl: number;
  rewardAssets?: Array<{
    assetId: number;
    name?: string;
  }>;
}

/**
 * Transformed yield opportunity with all computed fields
 */
export interface YieldOpportunity {
  platform: Platform;
  asset: string;
  assetType: AssetType;
  yieldType: YieldType;
  apy: number;
  apyFormatted: string;
  tvl: number;
  tvlFormatted: string;
  rewards: string[];
  rewardsFormatted: string;
}

/**
 * Filter options for querying yield opportunities
 */
export interface GetYieldsFilters {
  /**
   * Search term to filter by asset name or platform
   */
  search?: string;
  
  /**
   * Filter by asset type(s)
   */
  assetType?: AssetType | AssetType[];
  
  /**
   * Filter by platform(s)
   */
  platform?: Platform | Platform[];
  
  /**
   * Filter by yield type(s)
   */
  yieldType?: YieldType | YieldType[];
  
  /**
   * Minimum APY percentage (e.g., 5 for 5%)
   */
  minApy?: number;
  
  /**
   * Maximum APY percentage (e.g., 100 for 100%)
   */
  maxApy?: number;
  
  /**
   * Minimum TVL in USD
   */
  minTvl?: number;
  
  /**
   * Maximum TVL in USD
   */
  maxTvl?: number;
}

/**
 * SDK Configuration options
 */
export interface CanixConfig {
  /**
   * Base URL for the Canix API
   * @default "https://api-general.compx.io"
   */
  apiBaseUrl?: string;
  
  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
  
  /**
   * Custom headers to include with requests
   */
  headers?: Record<string, string>;
}


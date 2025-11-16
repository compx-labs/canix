/**
 * Canix SDK - Programmatically explore DeFi yield opportunities
 * 
 * @packageDocumentation
 */

export { CanixClient } from './client';
export type {
  Platform,
  AssetType,
  YieldType,
  RawYieldOpportunity,
  YieldOpportunity,
  GetYieldsFilters,
  CanixConfig,
} from './types';

// Re-export utility functions for advanced usage
export {
  categorizeAssetType,
  mapYieldType,
  formatTVL,
  formatAPY,
  extractRewardAssets,
} from './utils';


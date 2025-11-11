import type { AssetType, YieldType } from './types';

/**
 * Categorize an asset based on its type and name
 */
export function categorizeAssetType(assetType: string | undefined, assetName: string | undefined): AssetType {
  if (!assetType && !assetName) return "Standard Asset";

  const name = (assetName || "").toLowerCase();
  const type = (assetType || "").toLowerCase();

  // Check for LP tokens first
  if (type.includes("lp") || name.includes("-")) {
    return "Liquidity Token";
  }

  // Check for stablecoins
  if (name.includes("usdc") || name.includes("usdt") || name.includes("xusd")) {
    return "Stablecoin";
  }

  // Check for governance tokens
  if (name.includes("compx") && !name.includes("tiny") && !name.includes("pow")) {
    return "Governance";
  }

  // Check for yield bearing
  if (
    name.includes("calgo") ||
    name.includes("xalgo") ||
    name.includes("talgo") ||
    name.includes("malgo") ||
    name.includes("cusdc") ||
    name.includes("calpha") ||
    name.includes("ctiny") ||
    name.includes("cpow") ||
    name.includes("cxusd") ||
    name.includes("ccompx")
  ) {
    return "Yield bearing";
  }

  // Check for RWA
  if (name.includes("gold") || name.includes("silver")) {
    return "RWA";
  }

  // Default to Standard Asset
  return "Standard Asset";
}

/**
 * Map API type to yield type
 */
export function mapYieldType(type: string): YieldType {
  const typeMapping: Record<string, YieldType> = {
    liquidity: "Liquidity Pool",
    lending: "Lending",
    staking: "Staking",
    farming: "Farming",
    farm: "Farming", // Pact API uses "farm" instead of "farming"
  };

  return typeMapping[type.toLowerCase()] || "Liquidity Pool";
}

/**
 * Format TVL with K, M, B suffixes
 */
export function formatTVL(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

/**
 * Format APY as percentage string
 */
export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`;
}

/**
 * Extract reward asset names
 */
export function extractRewardAssets(
  rewardAssets?: Array<{ assetId: number; name?: string }>
): string[] {
  if (!rewardAssets || !Array.isArray(rewardAssets) || rewardAssets.length === 0) {
    return [];
  }

  return rewardAssets
    .map((reward) => reward.name || `Asset ${reward.assetId}`)
    .filter(Boolean);
}

/**
 * Convert value or array to array for filtering
 */
export function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}


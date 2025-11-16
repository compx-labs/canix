// API service for fetching yield opportunities

// Types for API responses
interface ApiRewardAsset {
  name?: string;
  assetId: number;
}

interface ApiOpportunity {
  platform: string;
  assetName?: string;
  assetType?: string;
  type: string;
  apy?: number;
  tvl?: number;
  rewardAssets?: ApiRewardAsset[];
  appId?: string; // Can be an app ID or wallet address (e.g., for Tinyman pools)
}

export interface Opportunity {
  platform: string;
  logo: string;
  url: string;
  asset: string;
  assetType: string;
  yieldType: string;
  yield: string;
  tvl: string;
  rewards: string;
  appId?: string; // Can be an app ID or wallet address (e.g., for Tinyman pools)
}

const API_BASE_URL = "https://api-general.compx.io";

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  const response = await fetch(`${API_BASE_URL}/api/getOpportunities`);

  if (!response.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  const data: ApiOpportunity[] = await response.json();
  return transformApiData(data);
};

// Platform logo mapping
const platformLogos: Record<string, string> = {
  Tinyman: "/tinyman-logo-dark.svg",
  CompX: "/compx-logo-small.png",
  "Folks Finance": "/folks-logo-dark.png",
  Pact: "/pactfi-logo-dark.svg",
  "Orbital Lending": "/orbital-logo-small.png",
};

// Platform URL mapping
const platformUrls: Record<string, string> = {
  Tinyman: "https://app.tinyman.org",
  CompX: "https://app.compx.io",
  "Folks Finance": "https://app.folks.finance",
  Pact: "https://app.pact.fi",
  "Orbital Lending": "https://orbital.compx.io",
};

// Type mapping for yield types
const typeMapping: Record<string, string> = {
  liquidity: "Liquidity Pool",
  lending: "Lending",
  staking: "Staking",
  farming: "Farming",
  farm: "Farming", // Pact API uses "farm" instead of "farming"
};

// Asset type categorization
const categorizeAssetType = (assetType?: string, assetName?: string): string => {
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
  if (
    name.includes("compx") &&
    !name.includes("tiny") &&
    !name.includes("pow")
  ) {
    return "Governance";
  }

  // Check for yield bearing
  if (
    name.includes("cAlgo") ||
    name.includes("xAlgo") ||
    name.includes("tAlgo") ||
    name.includes("mAlgo") ||
    name.includes("cUSDC") ||
    name.includes("cALPHA") ||
    name.includes("cTINY") ||
    name.includes("cPOW") ||
    name.includes("cxUSD") ||
    name.includes("cCOMPX")
  ) {
    return "Yield bearing";
  }

  // Check for RWA
  if (name.includes("gold") || name.includes("silver")) {
    return "RWA";
  }

  // Default to Standard Asset for everything else
  return "Standard Asset";
};

// Build deep link URL based on platform, type, and appId
const buildDeepLinkUrl = (platform: string, type: string, appId?: string): string => {
  const baseUrl = platformUrls[platform] || "https://app.compx.io";
  
  // If no appId, return base URL
  if (!appId) {
    return baseUrl;
  }
  
  // Build deep links based on platform and type combination
  switch (platform) {
    case "CompX":
      if (type === "farm" || type === "farming") {
        // CompX farms: /farm?farmId={appId}
        return `${baseUrl}/farm?farmId=${appId}`;
      } else if (type === "staking") {
        // CompX staking pools: appId contains the full URL path
        // e.g., "staking-pool?poolId=3206268063"
        return `${baseUrl}/${appId}`;
      }
      return baseUrl;
    
    case "Tinyman":
      if (type === "liquidity") {
        // Tinyman liquidity pools: /pool/{appId}
        return `${baseUrl}/pool/${appId}`;
      } else if (type === "farm" || type === "farming") {
        // Tinyman farms: /pool/{poolAddress}/farming-programs/{farmId}
        // appId contains both pool address and farm ID separated by "/"
        const parts = appId.split("/");
        if (parts.length >= 2) {
          const poolAddress = parts[0];
          const farmId = parts[1];
          return `${baseUrl}/pool/${poolAddress}/farming-programs/${farmId}`;
        }
        // Fallback: if format is unexpected, use appId as pool address
        return `${baseUrl}/pool/${appId}`;
      }
      return baseUrl;
    
    case "Pact":
      if (type === "liquidity") {
        // Pact liquidity pools: /add-liquidity/{appId}
        return `${baseUrl}/add-liquidity/${appId}`;
      } else if (type === "farm" || type === "farming") {
        // Pact farms: /stake/{appId}
        return `${baseUrl}/stake/${appId}`;
      }
      return baseUrl;
    
    case "Orbital Lending":
      if (type === "lending") {
        // Orbital Lending: /app/markets/details?id={appId}
        return `${baseUrl}/app/markets/details?id=${appId}`;
      }
      return baseUrl;
    
    default:
      return baseUrl;
  }
};

// Transform API data to match our app's format
const transformApiData = (apiData: ApiOpportunity[]): Opportunity[] => {
  return apiData.map((item) => {
    const platform = item.platform || "Unknown";
    const type = item.type || "liquidity";
    const appId = item.appId;
    
    return {
      platform,
      logo: platformLogos[platform] || "/compx-logo-small.png",
      url: buildDeepLinkUrl(platform, type, appId),
      asset: item.assetName || "Unknown Asset",
      assetType: categorizeAssetType(item.assetType, item.assetName),
      yieldType: typeMapping[type] || "Liquidity Pool",
      yield: item.apy ? `${item.apy.toFixed(2)}%` : "0.00%",
      tvl: item.tvl ? `$${formatTVL(item.tvl)}` : "$0",
      rewards: formatRewardAssets(item.rewardAssets),
      appId,
    };
  });
};

// Format TVL with K, M, B suffixes
const formatTVL = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

// Format reward assets from the API
const formatRewardAssets = (rewardAssets?: ApiRewardAsset[]): string => {
  if (
    !rewardAssets ||
    !Array.isArray(rewardAssets) ||
    rewardAssets.length === 0
  ) {
    return "N/A";
  }

  // Extract reward names and join with commas
  return rewardAssets
    .map((reward) => reward.name || `Asset ${reward.assetId}`)
    .join(", ");
};


// API service for fetching yield opportunities
const API_BASE_URL = "https://api-general.compx.io";

export const fetchOpportunities = async () => {
  const response = await fetch(`${API_BASE_URL}/api/getOpportunities`);

  if (!response.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  const data = await response.json();
  return transformApiData(data);
};

// Platform logo mapping
const platformLogos = {
  Tinyman: "/tinyman-logo-dark.svg",
  CompX: "/compx-logo-small.png",
  "Folks Finance": "/folks-logo-dark.png",
  Pact: "/pactfi-logo-dark.svg",
  "Orbital Lending": "/orbital-logo-small.png",
};

// Platform URL mapping
const platformUrls = {
  Tinyman: "https://app.tinyman.org",
  CompX: "https://app.compx.io",
  "Folks Finance": "https://app.folks.finance",
  Pact: "https://app.pact.fi",
  "Orbital Lending": "https://orbital.compx.io",
};

// Type mapping for yield types
const typeMapping = {
  liquidity: "Liquidity Pool",
  lending: "Lending",
  staking: "Staking",
  farming: "Farming",
  farm: "Farming", // Pact API uses "farm" instead of "farming"
};

// Asset type categorization
const categorizeAssetType = (assetType, assetName) => {
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

// Transform API data to match our app's format
const transformApiData = (apiData) => {
  return apiData.map((item) => ({
    platform: item.platform || "Unknown",
    logo: platformLogos[item.platform] || "/compx-logo-small.png",
    url: platformUrls[item.platform] || "https://app.compx.io",
    asset: item.assetName || "Unknown Asset",
    assetType: categorizeAssetType(item.assetType, item.assetName),
    yieldType: typeMapping[item.type] || "Liquidity Pool",
    yield: item.apy ? `${item.apy.toFixed(2)}%` : "0.00%",
    tvl: item.tvl ? `$${formatTVL(item.tvl)}` : "$0",
    rewards: formatRewardAssets(item.rewardAssets),
  }));
};

// Format TVL with K, M, B suffixes
const formatTVL = (value) => {
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
const formatRewardAssets = (rewardAssets) => {
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

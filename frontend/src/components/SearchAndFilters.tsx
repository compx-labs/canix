import { useState } from 'react';
import CustomDropdown from './CustomDropdown';

interface SearchAndFiltersProps {
  searchQuery: string;
  assetType: string;
  platform: string;
  yieldType: string;
  onSearchChange: (value: string) => void;
  onAssetTypeChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onYieldTypeChange: (value: string) => void;
  onClear: () => void;
}

export default function SearchAndFilters({
  searchQuery,
  assetType,
  platform,
  yieldType,
  onSearchChange,
  onAssetTypeChange,
  onPlatformChange,
  onYieldTypeChange,
  onClear,
}: SearchAndFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search platforms, assets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-graphite-50 border border-graphite-100 text-silver placeholder-silver/40 px-4 py-2 text-sm focus:outline-none focus:border-crimson transition-colors"
        />
        <button
          onClick={onClear}
          className="bg-crimson hover:bg-crimson-dark text-white px-6 py-2 text-sm font-semibold transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <CustomDropdown
          label="Asset Type"
          value={assetType}
          options={['All', 'Governance', 'RWA', 'Yield bearing', 'Stablecoin', 'Liquidity Token', 'Standard Asset']}
          onChange={(value) => {
            onAssetTypeChange(value);
            setOpenDropdown(null);
          }}
          dropdownKey="assetType"
          isOpen={openDropdown === 'assetType'}
          onToggle={() => toggleDropdown('assetType')}
        />
        <CustomDropdown
          label="Platform"
          value={platform}
          options={['All', 'CompX', 'Folks Finance', 'Tinyman', 'Pact']}
          onChange={(value) => {
            onPlatformChange(value);
            setOpenDropdown(null);
          }}
          dropdownKey="platform"
          isOpen={openDropdown === 'platform'}
          onToggle={() => toggleDropdown('platform')}
        />
        <CustomDropdown
          label="Yield Type"
          value={yieldType}
          options={['All', 'Staking', 'Farming', 'Liquidity Pool', 'Lending']}
          onChange={(value) => {
            onYieldTypeChange(value);
            setOpenDropdown(null);
          }}
          dropdownKey="yieldType"
          isOpen={openDropdown === 'yieldType'}
          onToggle={() => toggleDropdown('yieldType')}
        />
      </div>
    </div>
  );
}


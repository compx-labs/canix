import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOpportunities } from './services/api';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [assetType, setAssetType] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [yieldType, setYieldType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(1);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const rowsPerPage = 20;
  
  // Fetch data from API
  const { data: yieldData = [], isError, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  });

  // Handle initial loading with 5 second minimum
  useEffect(() => {
    if (isInitialLoad) {
      // Progress bar animation (5 segments over 5 seconds)
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 5) {
            return 5;
          }
          return prev + 1;
        });
      }, 1000);

      // Text cycling animation (change every 1.5 seconds)
      const textInterval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % 5);
      }, 1500);
      
      // Set minimum 5 second delay before allowing content to show
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 5000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
        clearTimeout(timer);
      };
    }
  }, [isInitialLoad]);
  
  // Filter data based on search and filters
  const filteredData = yieldData.filter((row) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      row.platform.toLowerCase().includes(searchLower) ||
      row.asset.toLowerCase().includes(searchLower);
    
    // Asset Type filter
    const matchesAssetType = assetType === 'All' || row.assetType === assetType;
    
    // Platform filter
    const matchesPlatform = platform === 'All' || row.platform === platform;
    
    // Yield Type filter
    const matchesYieldType = yieldType === 'All' || row.yieldType === yieldType;
    
    return matchesSearch && matchesAssetType && matchesPlatform && matchesYieldType;
  });

  // Sort by APY (highest to lowest)
  const sortedData = [...filteredData].sort((a, b) => {
    const apy1 = parseFloat(a.yield.replace('%', '')) || 0;
    const apy2 = parseFloat(b.yield.replace('%', '')) || 0;
    return apy2 - apy1;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];
    const showEllipsisThreshold = 7; // Show ellipsis if more than 7 pages
    
    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Determine range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const CustomDropdown = ({ label, value, options, onChange, dropdownKey }) => {
    const isOpen = openDropdown === dropdownKey;
    
    return (
      <div className="relative">
        <label className="block text-silver/60 text-xs mb-1 font-semibold uppercase">{label}</label>
        <button
          onClick={() => toggleDropdown(dropdownKey)}
          className="w-full bg-graphite-50 border border-graphite-100 text-silver px-3 py-2 text-sm text-left focus:outline-none focus:border-crimson transition-colors flex items-center justify-between"
        >
          <span>{value}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-graphite-50 border border-crimson shadow-glow max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpenDropdown(null);
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-graphite-100 transition-colors ${
                  value === option ? 'bg-graphite-100 text-crimson font-semibold' : 'text-silver'
                }`}
              >
                {value === option && (
                  <span className="mr-2 text-crimson">✓</span>
                )}
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Loading messages that cycle
  const loadingMessages = [
    "Scanning DeFi protocols...",
    "Analyzing yield opportunities...",
    "Calculating APYs across Algorand...",
    "Fetching TVL data...",
    "Preparing your dashboard..."
  ];

  // Loading state (show for minimum 5 seconds on initial load)
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          {/* Logo */}
          <img 
            src="/logo-long.png" 
            alt="Canix" 
            className="h-44 mx-auto mb-8"
          />
          
          {/* 5-Segment Progress Bar */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((segment) => (
              <div
                key={segment}
                className={`flex-1 h-2 transition-all duration-500 ${
                  loadingProgress >= segment
                    ? 'bg-crimson shadow-glow'
                    : 'bg-graphite-100'
                }`}
              />
            ))}
          </div>
          
          {/* Cycling Text */}
          <p className="text-silver/80 text-sm font-mono animate-pulse">
            {loadingMessages[loadingTextIndex]}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-crimson text-6xl mb-4">⚠️</div>
          <h2 className="text-silver text-2xl font-bold mb-2">Unable to Load Data</h2>
          <p className="text-silver/70 mb-4">
            {error?.message || 'Failed to fetch yield opportunities. Please check if the API server is running.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-crimson hover:bg-crimson-dark text-white px-6 py-2 text-sm font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-graphite">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6 md:mb-8 flex items-center justify-between gap-4">
            <img 
              src="/logo-long.png" 
              alt="Canix - The Yield Hunter" 
              className="h-24 max-w-[50%] object-contain"
            />
            <img 
              src="/powered by.png" 
              alt="Powered by CompX" 
              className="h-8 sm:h-12 md:h-16 lg:h-20 max-w-[45%] object-contain"
            />
          </header>

          {/* Intro Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-silver mb-2">
              Hunt down the best Yield
            </h2>
            <p className="text-sm md:text-base text-silver/70">
              Use Canix to find the best yield opportunities on Algorand across multiple protocols.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3 mb-6">
            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search platforms, assets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 bg-graphite-50 border border-graphite-100 text-silver placeholder-silver/40 px-4 py-2 text-sm focus:outline-none focus:border-crimson transition-colors"
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAssetType('All');
                  setPlatform('All');
                  setYieldType('All');
                  setCurrentPage(1);
                }}
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
                onChange={handleFilterChange(setAssetType)}
                dropdownKey="assetType"
              />
              <CustomDropdown
                label="Platform"
                value={platform}
                options={['All', 'CompX', 'Folks Finance', 'Tinyman', 'Pact']}
                onChange={handleFilterChange(setPlatform)}
                dropdownKey="platform"
              />
              <CustomDropdown
                label="Yield Type"
                value={yieldType}
                options={['All', 'Staking', 'Farming', 'Liquidity Pool', 'Lending']}
                onChange={handleFilterChange(setYieldType)}
                dropdownKey="yieldType"
              />
            </div>
          </div>

          {/* Yield Table */}
          <div className="bg-graphite-50 shadow-glow overflow-hidden border border-graphite-100">
            <div className="px-6 py-3 border-b border-graphite-100">
              <h2 className="text-lg font-semibold text-silver">
                Top Yield Opportunities
              </h2>
              <p className="text-silver/60 text-xs mt-1">
                Real-time yield data across DeFi protocols
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-graphite-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Asset Type
                    </th>
                    <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Yield Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Yield
                    </th>
                    <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      TVL
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                      Rewards
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-100">
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <p className="text-silver/60 text-sm">No yield opportunities found matching your filters.</p>
                        <p className="text-silver/40 text-xs mt-2">Try adjusting your search or filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((row, index) => (
                    <>
                      <tr
                        key={index}
                        onClick={() => {
                          // On mobile, toggle expansion
                          if (window.innerWidth < 768) {
                            setExpandedRow(expandedRow === index ? null : index);
                          } else {
                            // On desktop, navigate to platform
                            window.open(row.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className="hover:bg-graphite-100 transition-colors duration-150 cursor-pointer"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={row.logo} 
                              alt={row.platform}
                              className="w-6 h-6 mr-2"
                            />
                            <span className="text-silver text-sm font-semibold">{row.platform}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-silver/90 text-sm font-mono">{row.asset}</span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                          <span className="text-silver/70 text-xs">{row.assetType}</span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                          <span className="text-silver/70 text-xs">{row.yieldType}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-success font-bold text-sm">{row.yield}</span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                          <span className="text-silver/90 text-sm">{row.tvl}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 bg-amber/20 text-amber text-xs font-semibold">
                            {row.rewards}
                          </span>
                        </td>
                      </tr>
                      {/* Mobile Expandable Section */}
                      {expandedRow === index && (
                        <tr className="md:hidden bg-graphite-100">
                          <td colSpan="5" className="px-4 py-3">
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-silver/60 font-semibold uppercase">Asset Type:</span>
                                <span className="text-silver">{row.assetType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-silver/60 font-semibold uppercase">Yield Type:</span>
                                <span className="text-silver">{row.yieldType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-silver/60 font-semibold uppercase">TVL:</span>
                                <span className="text-silver">{row.tvl}</span>
                              </div>
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-crimson hover:bg-crimson-dark text-white font-semibold px-4 py-2 text-xs flex items-center justify-center gap-2 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Start Earning</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-graphite-100 bg-graphite-50 flex items-center justify-between">
              <div className="text-xs text-silver/60">
                Showing {sortedData.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, sortedData.length)} of {sortedData.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-semibold text-silver bg-graphite-100 border border-graphite-100 hover:border-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-graphite-100"
                >
                  Previous
                </button>
                {getPaginationNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-xs font-semibold text-silver/50">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-crimson text-white border border-crimson'
                          : 'text-silver bg-graphite-100 border border-graphite-100 hover:border-crimson'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-semibold text-silver bg-graphite-100 border border-graphite-100 hover:border-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-graphite-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App

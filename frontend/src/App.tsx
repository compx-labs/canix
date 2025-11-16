import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOpportunities, Opportunity } from './services/api';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ErrorState from './components/ErrorState';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import SearchAndFilters from './components/SearchAndFilters';
import YieldTable from './components/YieldTable';

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [assetType, setAssetType] = useState<string>('All');
  const [platform, setPlatform] = useState<string>('All');
  const [yieldType, setYieldType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [minLoadTimeElapsed, setMinLoadTimeElapsed] = useState<boolean>(false);
  const rowsPerPage = 20;
  
  // Fetch data from API
  const { data: yieldData = [], isError, error, isLoading } = useQuery<Opportunity[]>({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  });

  // Handle minimum 5 second loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadTimeElapsed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Hide loading screen only when both conditions are met:
  // 1. Minimum 5 seconds have elapsed
  // 2. API query has completed (either success or error)
  useEffect(() => {
    if (minLoadTimeElapsed && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [minLoadTimeElapsed, isLoading]);
  
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

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setAssetType('All');
    setPlatform('All');
    setYieldType('All');
    setCurrentPage(1);
  };

  const handleRowClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Loading state (show until both minimum 5 seconds AND API call complete)
  if (isInitialLoad) {
    return <LoadingScreen />;
  }

  // Error state
  if (isError) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-graphite">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Header />
          <IntroSection />
          
          <SearchAndFilters
            searchQuery={searchQuery}
            assetType={assetType}
            platform={platform}
            yieldType={yieldType}
            onSearchChange={handleSearchChange}
            onAssetTypeChange={handleFilterChange(setAssetType)}
            onPlatformChange={handleFilterChange(setPlatform)}
            onYieldTypeChange={handleFilterChange(setYieldType)}
            onClear={handleClear}
          />

          <YieldTable
            data={sortedData}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            expandedRow={expandedRow}
            onRowClick={handleRowClick}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App


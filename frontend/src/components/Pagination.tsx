interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}: PaginationProps) {
  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
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

  return (
    <div className="px-6 py-3 border-t border-graphite-100 bg-graphite-50 flex items-center justify-between">
      <div className="text-xs text-silver/60">
        Showing {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, totalItems)} of {totalItems}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(page as number)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-xs font-semibold text-silver bg-graphite-100 border border-graphite-100 hover:border-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-graphite-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}


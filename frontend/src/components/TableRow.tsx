import { Opportunity } from '../services/api';

interface TableRowProps {
  row: Opportunity;
  index: number;
  expandedRow: number | null;
  onRowClick: (index: number) => void;
}

export default function TableRow({ row, index, expandedRow, onRowClick }: TableRowProps) {
  const isExpanded = expandedRow === index;

  const handleClick = () => {
    // On mobile, toggle expansion
    if (window.innerWidth < 768) {
      onRowClick(index);
    } else {
      // On desktop, navigate to platform
      window.open(row.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <tr
        onClick={handleClick}
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
        <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
          <span className="px-2 py-1 bg-amber/20 text-amber text-xs font-semibold">
            {row.rewards}
          </span>
        </td>
      </tr>
      {/* Mobile Expandable Section */}
      {isExpanded && (
        <tr className="md:hidden bg-graphite-100">
          <td colSpan={3} className="px-4 py-3">
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
              <div className="flex justify-between">
                <span className="text-silver/60 font-semibold uppercase">Rewards:</span>
                <span className="px-2 py-1 bg-amber/20 text-amber font-semibold">{row.rewards}</span>
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
  );
}


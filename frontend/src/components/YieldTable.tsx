import { Opportunity } from '../services/api';
import TableRow from './TableRow';
import Pagination from './Pagination';

interface YieldTableProps {
  data: Opportunity[];
  currentPage: number;
  rowsPerPage: number;
  expandedRow: number | null;
  onRowClick: (index: number) => void;
  onPageChange: (page: number) => void;
}

export default function YieldTable({
  data,
  currentPage,
  rowsPerPage,
  expandedRow,
  onRowClick,
  onPageChange,
}: YieldTableProps) {
  // Calculate pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
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
              <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-semibold text-silver/80 uppercase tracking-wider">
                Rewards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-silver/60 text-sm">No yield opportunities found matching your filters.</p>
                  <p className="text-silver/40 text-xs mt-2">Try adjusting your search or filter criteria.</p>
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <TableRow
                  key={`${row.platform}-${row.asset}-${index}`}
                  row={row}
                  index={index}
                  expandedRow={expandedRow}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
      />
    </div>
  );
}


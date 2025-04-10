import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import { useState, useMemo } from "react";

// Types for trader data
export interface Trader {
  rank: number;
  avatar: string;
  user: string;
  tradingScore: number;
  buyVolume: number;
  sellVolume: number;
  currentBalance: number;
}

// Props interface for the component
interface TradingBoardProps {
  traders: Trader[];
  className?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

// Type for sort configuration
type SortConfig = {
  key: keyof Trader;
  direction: "ascending" | "descending";
} | null;

export default function TradingBoard({
  traders,
  className = "",
  pagination,
}: TradingBoardProps) {
  // State for sorting and hover
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "rank",
    direction: "ascending",
  });
  const [hoveredColumn, setHoveredColumn] = useState<keyof Trader | null>(null);

  // Request sort function
  const requestSort = (key: keyof Trader) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Get sorted items using useMemo to prevent unnecessary re-renders
  const sortedTraders = useMemo(() => {
    if (!sortConfig) return traders;

    return [...traders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [traders, sortConfig]);

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Get the column index to determine arrow position (left/right)
  const getColumnIndex = (key: keyof Trader): number => {
    const columns: (keyof Trader)[] = [
      "rank",
      "user",
      "tradingScore",
      "buyVolume",
      "sellVolume",
      "currentBalance",
    ];
    return columns.indexOf(key);
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = (key: keyof Trader) => {
    // Show arrow if column is currently sorted or if it's being hovered
    const shouldShow =
      (sortConfig && sortConfig.key === key) || hoveredColumn === key;

    if (!shouldShow) {
      return null;
    }

    const columnIndex = getColumnIndex(key);
    const totalColumns = 6; // Total number of columns
    const isLeftHalf = columnIndex < totalColumns / 2;

    // Different positioning and classes based on which half of the table we're in
    const positionClass = isLeftHalf ? "right-0" : "left-0";

    // Use the current sort direction if this column is sorted, otherwise default to ascending for hover
    const direction =
      sortConfig && sortConfig.key === key ? sortConfig.direction : "ascending";

    return direction === "ascending" ? (
      <ArrowUpIcon
        className={`w-4 h-4 absolute ${positionClass} top-1/2 transform -translate-y-1/2 ${
          hoveredColumn === key && sortConfig?.key !== key ? "opacity-50" : ""
        }`}
      />
    ) : (
      <ArrowDownIcon
        className={`w-4 h-4 absolute ${positionClass} top-1/2 transform -translate-y-1/2 ${
          hoveredColumn === key && sortConfig?.key !== key ? "opacity-50" : ""
        }`}
      />
    );
  };

  // Get padding based on column position
  const getHeaderPadding = (key: keyof Trader) => {
    const columnIndex = getColumnIndex(key);
    const totalColumns = 6;
    const isLeftHalf = columnIndex < totalColumns / 2;

    // Apply padding to make space for the arrow
    if (key === "rank") {
      return "pr-5"; // Rank is always on the left
    } else if (isLeftHalf) {
      return "pr-5"; // First half gets right padding
    } else {
      return "pl-5"; // Second half gets left padding
    }
  };

  return (
    <div
      className={`overflow-x-auto max-w-7xl mx-auto w-full bg-white shadow-sm rounded-lg ${className}`}
    >
      <div className="p-4">
        <table className="min-w-full">
          <thead className="font-gluten">
            <tr className="border-b border-gray-300 text-gray-500">
              <th
                className="py-3 px-4 font-medium cursor-pointer text-left select-none"
                onClick={() => requestSort("rank")}
                onMouseEnter={() => setHoveredColumn("rank")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center ${getHeaderPadding(
                    "rank"
                  )}`}
                >
                  Rank
                  {getSortDirectionIndicator("rank")}
                </div>
              </th>
              <th
                className="py-3 px-4 font-medium cursor-pointer text-center select-none"
                onClick={() => requestSort("user")}
                onMouseEnter={() => setHoveredColumn("user")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center justify-center ${getHeaderPadding(
                    "user"
                  )}`}
                >
                  User
                  {getSortDirectionIndicator("user")}
                </div>
              </th>
              <th
                className="py-3 px-4 font-medium cursor-pointer text-center select-none"
                onClick={() => requestSort("tradingScore")}
                onMouseEnter={() => setHoveredColumn("tradingScore")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center justify-center ${getHeaderPadding(
                    "tradingScore"
                  )}`}
                >
                  Trading Score
                  {getSortDirectionIndicator("tradingScore")}
                </div>
              </th>
              <th
                className="py-3 px-4 font-medium cursor-pointer text-center select-none"
                onClick={() => requestSort("buyVolume")}
                onMouseEnter={() => setHoveredColumn("buyVolume")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center justify-center -ml-4 ${getHeaderPadding(
                    "buyVolume"
                  )}`}
                >
                  Buy Volume
                  {getSortDirectionIndicator("buyVolume")}
                </div>
              </th>
              <th
                className="py-3 px-4 font-medium cursor-pointer text-center select-none"
                onClick={() => requestSort("sellVolume")}
                onMouseEnter={() => setHoveredColumn("sellVolume")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center justify-center -ml-4 ${getHeaderPadding(
                    "sellVolume"
                  )}`}
                >
                  Sell Volume
                  {getSortDirectionIndicator("sellVolume")}
                </div>
              </th>
              <th
                className="py-3 px-4 font-medium cursor-pointer text-right select-none"
                onClick={() => requestSort("currentBalance")}
                onMouseEnter={() => setHoveredColumn("currentBalance")}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <div
                  className={`relative inline-flex items-center justify-end ${getHeaderPadding(
                    "currentBalance"
                  )}`}
                >
                  Current Balance
                  {getSortDirectionIndicator("currentBalance")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="font-nunito">
            {sortedTraders.map((trader, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-6 px-4">
                  <div className="flex items-center">
                    {trader.rank <= 3 ? (
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-white
                        ${
                          trader.rank === 1
                            ? "bg-yellow-300"
                            : trader.rank === 2
                            ? "bg-slate-400"
                            : "bg-amber-800"
                        }`}
                      >
                        {trader.rank}
                      </div>
                    ) : (
                      <div className="h-6 w-6 flex items-center justify-center mr-2">
                        {trader.rank}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-4 font-regular">
                    <img src={trader.avatar} className="w-8 h-8 rounded-full" />

                    <p>{trader.user}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#FA73A0] text-center font-bold">
                  {formatNumber(trader.tradingScore)}
                </td>
                <td className="py-3 px-4 text-green-500 text-center font-bold">
                  {formatNumber(trader.buyVolume)}
                </td>
                <td className="py-3 px-4 text-red-500 text-center font-bold">
                  {formatNumber(trader.sellVolume)}
                </td>
                <td className="py-3 px-4 text-slate-700 text-right font-bold">
                  {formatNumber(trader.currentBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              First
            </button>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {/* Show page numbers, with ellipsis for large ranges */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) < 2
                )
                .map((page, index, array) => {
                  const previousPage = array[index - 1];
                  const showEllipsisBefore =
                    previousPage && page - previousPage > 1;

                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsisBefore && <span className="px-2">...</span>}
                      <button
                        onClick={() => pagination.onPageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          page === pagination.currentPage
                            ? "bg-[#FA73A0] text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

// Types for trader data
export interface Trader {
  rank: number;
  avatar: string;
  user: string;
  tradingScore: number;
  buyVolume: number;
  sellVolume: number;
  currentBalance: number;
  nftCounts?: {
    gold_nft: number;
    ring_nft: number;
    blob_nft: number;
  };
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
  sortConfig?: {
    key: keyof Trader;
    direction: "ascending" | "descending";
  };
  onSort?: (key: keyof Trader, direction: "ascending" | "descending") => void;
}

export default function TradingBoard({
  traders,
  className = "",
  pagination,
  sortConfig,
  onSort,
}: TradingBoardProps) {
  // State for sorting and hover
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

    if (onSort) {
      onSort(key, direction);
    }
  };

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Render NFT counts with icons
  const renderNftCounts = (nftCounts: Trader["nftCounts"]) => {
    // Handle undefined or null nftCounts
    if (!nftCounts) {
      return <span className="text-slate-400">-</span>;
    }

    const nftEntries = [
      {
        key: "gold_nft",
        icon: "/blub-coin.png",
        count: nftCounts.gold_nft || 0,
      },
      {
        key: "ring_nft",
        icon: "/blub-ring.png",
        count: nftCounts.ring_nft || 0,
      },
      {
        key: "blob_nft",
        icon: "/blub-goo.png",
        count: nftCounts.blob_nft || 0,
      },
    ];

    // Filter entries that have count > 0
    const validEntries = nftEntries.filter((entry) => entry.count > 0);

    // If no valid entries, show dash
    if (validEntries.length === 0) {
      return <span className="text-slate-400">-</span>;
    }

    // Show the NFT counts
    return (
      <div className="flex items-center justify-center gap-2 text-sm">
        {validEntries.map((entry, index) => (
          <span key={entry.key} className="flex items-center gap-1">
            <img
              src={entry.icon}
              alt={entry.key}
              className="w-5 h-5 object-contain"
            />
            <span className="font-medium text-slate-800 dark:text-slate-300">
              x{entry.count}
            </span>
            {index < validEntries.length - 1 && (
              <span className="text-slate-400 mx-1">|</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  // Get the column index to determine arrow position (left/right)
  const getColumnIndex = (key: keyof Trader): number => {
    const columns: (keyof Trader)[] = [
      "rank",
      "user",
      "tradingScore",
      "buyVolume",
      "sellVolume",
      "nftCounts",
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
    const totalColumns = 7; // Total number of columns
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
    const totalColumns = 7;
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
    <div className={`overflow-x-auto max-w-7xl mx-auto w-full ${className}`}>
      <div className="rounded-2xl backdrop-blur-sm p-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] dark:shadow-none border border-white/20 bg-black/2 dark:bg-inherit relative min-w-fit">
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 to-transparent pointer-events-none"></div>
        <div className="rounded-xl">
          <table className="min-w-full">
            <thead className="font-gluten">
              <tr className="border-b border-gray-500 text-slate-700 dark:text-slate-300">
                <th
                  className="py-4 px-4 font-medium cursor-pointer text-left select-none"
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
                <th className="py-4 px-4 font-medium text-left select-none">
                  <div
                    className={`relative inline-flex items-center justify-start ${getHeaderPadding(
                      "user"
                    )}`}
                  >
                    User
                  </div>
                </th>
                <th
                  className="py-4 px-4 font-medium cursor-pointer text-center select-none"
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
                  className="py-4 px-4 font-medium cursor-pointer text-center select-none"
                  onClick={() => requestSort("buyVolume")}
                  onMouseEnter={() => setHoveredColumn("buyVolume")}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div
                    className={`relative inline-flex items-center justify-center -ml-4 ${getHeaderPadding(
                      "buyVolume"
                    )}`}
                  >
                    Volume In
                    {getSortDirectionIndicator("buyVolume")}
                  </div>
                </th>
                <th
                  className="py-4 px-4 font-medium cursor-pointer text-center select-none"
                  onClick={() => requestSort("sellVolume")}
                  onMouseEnter={() => setHoveredColumn("sellVolume")}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div
                    className={`relative inline-flex items-center justify-center -ml-4 ${getHeaderPadding(
                      "sellVolume"
                    )}`}
                  >
                    Volume Out
                    {getSortDirectionIndicator("sellVolume")}
                  </div>
                </th>
                <th
                  className="py-4 px-4 font-medium cursor-pointer text-center select-none"
                  onClick={() => requestSort("nftCounts")}
                  onMouseEnter={() => setHoveredColumn("nftCounts")}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div
                    className={`relative inline-flex items-center justify-center ${getHeaderPadding(
                      "nftCounts"
                    )}`}
                  >
                    Blub Reserve
                    {getSortDirectionIndicator("nftCounts")}
                  </div>
                </th>
                <th
                  className="py-4 px-4 font-medium cursor-pointer text-right select-none"
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
              {traders.map((trader, index) => (
                <tr
                  key={index}
                  className="hover:bg-black/5 transition-colors duration-150"
                >
                  <td className="py-6 px-4">
                    <div className="flex items-center">
                      {trader.rank <= 3 ? (
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-white drop-shadow-sm font-gluten text-xl
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
                        <div className="h-6 w-6 flex items-center justify-center mr-2 font-gluten text-xl text-slate-800 dark:text-slate-300">
                          {trader.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-start gap-4 font-regular">
                      <img
                        src={trader.avatar}
                        className="w-8 h-8 rounded-full shadow-sm"
                        alt={`${trader.user}'s avatar`}
                      />
                      <p className="text-slate-800 dark:text-slate-300">
                        {trader.user}
                      </p>
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
                  <td className="py-3 px-4 text-center">
                    {renderNftCounts(trader.nftCounts)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-right font-bold dark:text-slate-300">
                    {formatNumber(trader.currentBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add pagination controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="py-4 px-6 flex justify-center gap-2 font-nunito">
              <button
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.currentPage === 1}
                className={`${
                  pagination.currentPage === 1
                    ? "rounded-xl backdrop-blur-sm px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/20 bg-black/2 relative overflow-hidden text-slate-500"
                    : "rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden"
                }`}
              >
                First
              </button>
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage === 1}
                className={`${
                  pagination.currentPage === 1
                    ? "rounded-xl backdrop-blur-sm px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/20 bg-black/2 relative overflow-hidden text-slate-500"
                    : "rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden text-slate-800 dark:font-bold"
                }`}
              >
                Previous
              </button>

              <div className="flex gap-2 mx-4">
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
                        {showEllipsisBefore && (
                          <span className="px-2">...</span>
                        )}
                        <button
                          onClick={() => pagination.onPageChange(page)}
                          className={`${
                            page === pagination.currentPage
                              ? "rounded-xl backdrop-blur-sm px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/20 bg-black/2 relative overflow-hidden text-slate-500"
                              : "rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden text-slate-800 dark:font-bold"
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
                className={`${
                  pagination.currentPage === pagination.totalPages
                    ? "rounded-xl backdrop-blur-sm px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/20 bg-black/2 relative overflow-hidden text-slate-500"
                    : "rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden text-slate-800 dark:font-bold"
                }`}
              >
                Next
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`${
                  pagination.currentPage === pagination.totalPages
                    ? "rounded-xl backdrop-blur-sm px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/20 bg-black/2 relative overflow-hidden text-slate-500"
                    : "rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden text-slate-800 dark:font-bold"
                }`}
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

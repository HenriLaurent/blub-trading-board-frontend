import { useMemo, useState, useEffect } from "react";
import { useTradingVolumes } from "../api/trading";
import TradingBoard from "../components/TradingBoard";
import { formatTokenAmount } from "../utils/formatters";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useDebounce } from "../hooks/useDebounce";

export default function TradingBoardPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: tradingVolumes,
    isLoading,
    error,
  } = useTradingVolumes({ page, limit, search: debouncedSearchTerm });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, limit]);

  const traders = useMemo(() => {
    if (!tradingVolumes || !Array.isArray(tradingVolumes.items)) return [];

    return tradingVolumes.items
      .map((volume, index) => ({
        rank: (page - 1) * limit + index + 1,
        user: volume.username || `Anonymous ${index + 1}`,
        avatar: volume.profile_image_url || "",
        tradingScore: parseFloat(formatTokenAmount(volume.trading_points, 15)),
        buyVolume: parseFloat(formatTokenAmount(volume.volume_in)),
        sellVolume: parseFloat(formatTokenAmount(volume.volume_out)),
        currentBalance: parseFloat(formatTokenAmount(volume.balance)),
      }))
      .sort((a, b) => b.tradingScore - a.tradingScore)
      .map((trader, index) => ({
        ...trader,
        rank: (page - 1) * limit + index + 1,
      }));
  }, [tradingVolumes, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setShowLimitDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowLimitDropdown(false);
    };

    if (showLimitDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showLimitDropdown]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        {/* Search bar */}
        <div className="md:w-2/3">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA73A0] focus:border-[#FA73A0] outline-none"
              placeholder="Search by username or wallet address..."
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Limit dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Items per page:</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLimitDropdown(!showLimitDropdown);
              }}
              className="flex items-center justify-between w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FA73A0]"
            >
              <span>{limit}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {showLimitDropdown && (
            <div className="absolute z-10 right-0 mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-lg">
              {[10, 25, 50, 100].map((option) => (
                <button
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLimitChange(option);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    limit === option ? "bg-gray-100 font-medium" : ""
                  } ${option === 10 ? "rounded-t-lg" : ""} ${
                    option === 100 ? "rounded-b-lg" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-xl">Loading data...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500 text-xl">
            Error while loading data: {error.message}
          </div>
        </div>
      ) : tradingVolumes?.items.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-gray-500 text-xl">No results found</div>
        </div>
      ) : (
        <TradingBoard
          traders={traders}
          pagination={
            tradingVolumes?.pagination
              ? {
                  currentPage: page,
                  totalPages: tradingVolumes.pagination.pages,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

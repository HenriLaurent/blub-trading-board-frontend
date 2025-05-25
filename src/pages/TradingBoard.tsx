import { useMemo, useState, useEffect } from "react";
import { useTradingVolumes } from "../api/trading";
import TradingBoard from "../components/TradingBoard";
import { formatTokenAmount } from "../utils/formatters";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDebounce } from "../hooks/useDebounce";

export default function TradingBoardPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
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

    return tradingVolumes.items.map((volume, index) => ({
      rank: volume.rank,
      user: volume.username || `Anonymous ${index + 1}`,
      avatar: volume.profile_image_url || "",
      tradingScore: parseFloat(formatTokenAmount(volume.trading_points, 15)),
      buyVolume: parseFloat(formatTokenAmount(volume.volume_in)),
      sellVolume: parseFloat(formatTokenAmount(volume.volume_out)),
      currentBalance: parseFloat(formatTokenAmount(volume.balance)),
    }));
  }, [tradingVolumes]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
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
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Search bar */}
      <div className="rounded-2xl backdrop-blur-sm p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] dark:shadow-none border border-white/20 bg-black/2 relative overflow-hidden dark:text-slate-300">
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 to-transparent pointer-events-none"></div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 rounded-lg outline-none text-slate-700 dark:text-slate-300"
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

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-xl text-slate-800 dark:text-slate-300">
            Loading data...
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500 text-xl dark:text-slate-300">
            Error while loading data: {error.message}
          </div>
        </div>
      ) : tradingVolumes?.items.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-gray-500 text-xl dark:text-slate-300">
            No results found
          </div>
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

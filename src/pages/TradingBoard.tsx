import { useMemo } from "react";
import { useTradingVolumes } from "../api/trading";
import TradingBoard from "../components/TradingBoard";
import { formatTokenAmount } from "../utils/formatters";

export default function TradingBoardPage() {
  const { data: tradingVolumes, isLoading, error } = useTradingVolumes();

  const traders = useMemo(() => {
    if (!tradingVolumes) return [];

    return tradingVolumes
      .map((volume, index) => ({
        rank: index + 1,
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
        rank: index + 1,
      }));
  }, [tradingVolumes]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading datas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">
          Error while loading datas: {error.message}
        </div>
      </div>
    );
  }
  return <TradingBoard traders={traders} />;
}

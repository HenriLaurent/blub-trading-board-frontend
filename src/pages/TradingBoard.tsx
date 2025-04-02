import { useMemo } from "react";
import { useTradingVolumes } from "../api/trading";
import TradingBoard from "../components/TradingBoard";

export default function TradingBoardPage() {
  const { data: tradingVolumes, isLoading, error } = useTradingVolumes();

  const traders = useMemo(() => {
    if (!tradingVolumes) return [];

    return (
      tradingVolumes
        .map((volume, index) => ({
          rank: index + 1, // Sera recalculé après le tri
          user: volume.username || `Anonymous ${index + 1}`,
          tradingScore: parseFloat(volume.trading_points),
          buyVolume: parseFloat(volume.volume_in),
          sellVolume: parseFloat(volume.volume_out),
          currentBalance: parseFloat(volume.balance),
        }))
        // Trier par trading score pour déterminer le rang
        .sort((a, b) => b.tradingScore - a.tradingScore)
        // Réassigner les rangs après le tri
        .map((trader, index) => ({
          ...trader,
          rank: index + 1,
        }))
    );
  }, [tradingVolumes]);
  //   const tradersData: Trader[] = [
  //     {
  //       rank: 1,
  //       user: "0x8923...4d21",
  //       tradingScore: 1250,
  //       buyVolume: 32450,
  //       sellVolume: 12230,
  //       currentBalance: 20220,
  //     },
  //     {
  //       rank: 2,
  //       user: "0x7128...9f32",
  //       tradingScore: 980,
  //       buyVolume: 28100,
  //       sellVolume: 10200,
  //       currentBalance: 17900,
  //     },
  //     {
  //       rank: 3,
  //       user: "0x7128...9f32",
  //       tradingScore: 980,
  //       buyVolume: 28100,
  //       sellVolume: 10200,
  //       currentBalance: 17900,
  //     },
  //     {
  //       rank: 4,
  //       user: "0x7128...9f32",
  //       tradingScore: 980,
  //       buyVolume: 28100,
  //       sellVolume: 10200,
  //       currentBalance: 17900,
  //     },
  //     // more traders...
  //   ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">
          Erreur lors du chargement des données: {error.message}
        </div>
      </div>
    );
  }
  return <TradingBoard traders={traders} />;
}

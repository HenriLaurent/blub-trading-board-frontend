import { useQuery } from "@tanstack/react-query";

interface TradingVolumeResponse {
  username: string | null;
  display_name: string | null;
  profile_image_url: string | null;
  balance: string;
  volume_in: string;
  volume_out: string;
  trading_points: string;
  transfer_count: number;
  presale_type: string[];
  wallet_addresses: string[];
}

// Interface pour les volumes de trading par adresse
interface AddressTradingVolumeResponse {
  id: number;
  wallet_address: string;
  balance: string;
  volume_in: string;
  volume_out: string;
  trading_points: string;
  transfer_count: number;
  presale_type: string;
  created_at: string;
  updated_at: string;
  username?: string | null;
  display_name?: string | null;
  profile_image_url?: string | null;
}

export const useTradingVolumes = () => {
  return useQuery<TradingVolumeResponse[], Error>({
    queryKey: ["tradingVolumes"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/trading-volumes/"
        );

        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(
            `Error while getting volumes: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Data received:", data);

        return data;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  });
};

export const useWalletTradingVolumes = (walletAddress: string | null) => {
  return useQuery<AddressTradingVolumeResponse[], Error>({
    queryKey: ["walletTradingVolumes", walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        return [];
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/trading-volumes/${walletAddress}`
        );

        console.log(
          "Wallet volumes response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          throw new Error(
            `Error while getting wallet volumes: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Wallet volumes data received:", data);

        return data;
      } catch (error) {
        console.error("Error fetching wallet trading volumes:", error);
        throw error;
      }
    },
    enabled: !!walletAddress,
  });
};

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

export const useTradingVolumes = () => {
  return useQuery<TradingVolumeResponse[], Error>({
    queryKey: ["tradingVolumes"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/trading-volumes/"
        );

        console.log("Response status :", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(
            `Error while getting volumes : ${response.status} ${response.statusText}`
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

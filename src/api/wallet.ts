import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";

export const useLinkWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      console.log("Try to link wallet", walletAddress);

      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
      console.log("Is address valid :", isValidAddress, walletAddress);

      if (!isValidAddress) {
        console.error("Address does not match required format");
      }

      try {
        const response = await fetch(`${API_URL}/api/wallet/link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_address: walletAddress }),
          credentials: "include",
        });

        console.log("Response status:", response.status, response.statusText);

        const responseData = await response.json().catch((e) => {
          console.error("Error while reading body", e);
          return null;
        });

        console.log("Boyd response", responseData);

        if (!response.ok) {
          throw new Error(
            `Error: ${response.status} ${response.statusText}` +
              (responseData?.detail ? ` - ${responseData.detail}` : "")
          );
        }

        return responseData;
      } catch (error) {
        console.error("Complete error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Wallet successfuly linked", data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["tradingVolumes"] });
    },
    onError: (error) => {
      console.error("Error while linking wallet", error);
    },
  });
};

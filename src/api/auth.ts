import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisconnect } from "wagmi";
import { API_URL } from "../config";

export const useStartTwitterAuth = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/auth/twitter/start`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log(data, "data");
      window.location.href = data.auth_url;
    },
    onError: (error) => {
      console.error("X auth error :", error);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        console.log("Envoi de la requête à /auth/user");
        const response = await fetch(`${API_URL}/auth/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          console.error("HTTP  error:", response.status);
          return { authenticated: false };
        }

        const data = await response.json();
        console.log("Response:", data);
        return data;
      } catch (error) {
        console.error("Error during request:", error);
        return { authenticated: false };
      }
    },
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { disconnect } = useDisconnect();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await disconnect();

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Error during logout:", error);
    },
  });
};

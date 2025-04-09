import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";

export const useStartTwitterAuth = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/auth/twitter/start`, {
        method: "GET",
        credentials: "include",
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
        console.log("Starting /auth/user request");
        console.log("Current cookies:", document.cookie);
        console.log("API URL:", API_URL);

        const response = await fetch(`${API_URL}/auth/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(document.cookie && { Cookie: document.cookie }),
          },
        });

        console.log("Request URL:", `${API_URL}/auth/user`);
        console.log("Request headers:", {
          cookie: document.cookie,
          credentials: "include",
          contentType: "application/json",
        });
        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          return { authenticated: false };
        }

        const data = await response.json();
        console.log("Auth Response data:", data);
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error during request:", error);
        console.error("Error details:", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
        });
        return { authenticated: false };
      }
    },
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

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

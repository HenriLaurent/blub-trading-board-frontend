import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Starting Twitter auth redirect with data:", data);
      window.location.href = data.auth_url;
    },
    onError: (error) => {
      console.error("X auth error:", error);
    },
  });
};

// Add a function to check cookies
const logCookieState = () => {
  console.log("Document cookies:", document.cookie);
  console.log("Cookie parsing attempt:", {
    raw: document.cookie,
    parsed: document.cookie.split(";").reduce((acc, curr) => {
      const [key, value] = curr.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        console.log("Starting /auth/user request");
        console.log("Current document.cookie:", document.cookie);

        const response = await fetch(`${API_URL}/auth/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        // Log complete request and response details
        console.log("Response details:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url,
        });

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          return { authenticated: false };
        }

        const data = await response.json();
        console.log("Auth Response data:", data);
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

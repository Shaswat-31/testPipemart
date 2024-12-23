import { useQuery } from "@tanstack/react-query";

export interface City {
  id: string;
  cityName: string;
  postalCode: string;
  state: string;
  country: string;
}

export const useCities = () => {
  return useQuery<City[], Error>({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await fetch("/api/city/fetch", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch cities");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

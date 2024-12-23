import { useQuery } from "@tanstack/react-query";

interface Template {
  id: string;
  post_id: number;
  post_name: string;
}

export const useTemplates = (wordpressId: string) => {
  return useQuery<Template[], Error>({
    queryKey: ["templates", wordpressId],
    queryFn: async () => {
      const response = await fetch(`/api/temp/fetch?wordpressId=${wordpressId}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
    enabled: !!wordpressId, // Fetch only if wordpressId is truthy
  });
};

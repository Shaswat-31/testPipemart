import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Product {
  id: string;
  title: string;
  titleDescription: string;
  topDescription: string;
  advantage: string;
  application: string;
  choose: string;
  questions: QuestionAnswer[];
  specification: Record<string, string[]>;
  chemicalSpec: Record<string, string[]>;
  mechanicalSpec: Record<string, string[]>;
  images: string[];
  industry: string[];
  applicationSummary: string;
}
interface QuestionAnswer {
    question: string;
    answer: string;
  }
export const useProducts = (categoryName: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", categoryName],
    queryFn: async () => {
      const response = await axios.get("/api/product/fetch/all");
      const filteredProducts = response.data.filter((product: Product) =>
        product.title.includes(categoryName)
      );
      return filteredProducts;
    },
    enabled: !!categoryName, // Fetch only if categoryName is truthy
  });
};

import V2ProductService from "@/service/Product";
import { Product, ProductResponse } from "@/types/ApiRespose";
import { useMutation, useQuery, useQueryClient } from "react-query";

// Fetch products query
export const useProducts = (wordpressId: string) => {
  return useQuery(['products', wordpressId], () =>
    V2ProductService.getProduct({ wordpressId }),
    {
      select: (data: ProductResponse) => data.data || [],
    }
  );
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => V2ProductService.deleteProduct({ productid:productId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
    },
  });
};

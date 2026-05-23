import api from "@/api";
import { useQuery } from "@tanstack/react-query";

interface FetchProductsParams {
  slug: string;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const useFetchCategoryProducts = ({
  slug,
  page = 1,
  perPage = 8,
  minPrice,
  maxPrice,
  sort = "latest",
}: FetchProductsParams) => {
  return useQuery({
    queryKey: [
      "category-products",
      slug,
      page,
      perPage,
      minPrice,
      maxPrice,
      sort,
    ],

    queryFn: async () => {
      const response = await api.get(`/categories/${slug}`, {
        params: {
          page,
          per_page: perPage,
          min_price: minPrice,
          max_price: maxPrice,
          sort,
        },
      });

      return response.data;
    },

    enabled: !!slug,
  });
};

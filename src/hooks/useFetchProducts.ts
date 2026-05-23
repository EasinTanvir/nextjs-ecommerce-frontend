import api from "@/api";

import { useQuery } from "@tanstack/react-query";

interface FetchProductsParams {
  categories?: string[];

  page?: number;

  perPage?: number;

  minPrice?: number;

  maxPrice?: number;

  sort?: string;
  keyword?: string;
}

export const useFetchProducts = ({
  categories = [],
  page = 1,
  keyword,
  perPage = 8,
  minPrice,
  maxPrice,
  sort = "latest",
}: FetchProductsParams) => {
  return useQuery({
    queryKey: [
      "products",
      categories,
      page,
      perPage,
      minPrice,
      maxPrice,
      sort,
      keyword,
    ],

    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          categories: categories.join(","),
          search: keyword,
          page,

          per_page: perPage,

          min_price: minPrice,

          max_price: maxPrice,

          sort,
        },
      });

      return response.data;
    },
  });
};

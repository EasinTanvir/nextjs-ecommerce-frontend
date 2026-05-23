import api from "@/api";

import { useQuery } from "@tanstack/react-query";

interface FetchProductsParams {
  categories?: string[];

  page?: number;

  perPage?: number;

  minPrice?: number;

  maxPrice?: number;

  sort?: string;
}

export const useFetchProducts = ({
  categories = [],
  page = 1,
  perPage = 8,
  minPrice,
  maxPrice,
  sort = "latest",
}: FetchProductsParams) => {
  return useQuery({
    queryKey: ["products", categories, page, perPage, minPrice, maxPrice, sort],

    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          categories: categories.join(","),

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

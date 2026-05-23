import api from "@/api";

import { useQuery } from "@tanstack/react-query";

interface FetchProductsParams {
  page?: number;
  perPage?: number;
  sort?: string;
}

export const useFetchProducts = ({
  page = 1,
  perPage = 8,
  sort = "latest",
}: FetchProductsParams) => {
  return useQuery({
    queryKey: ["products", page, perPage, sort],

    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          page,
          per_page: perPage,
          sort,
        },
      });

      return response.data;
    },
  });
};

import api from "@/api";
import { CACHING_TIME_REACT_QUERY } from "@/config";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  data: Category[];
}

export const useFetchAllCategories = (enable: boolean = true) => {
  return useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const response = await api.get<CategoriesResponse>("/categories");

      return response.data.data;
    },

    staleTime: CACHING_TIME_REACT_QUERY,

    enabled: enable,
  });
};

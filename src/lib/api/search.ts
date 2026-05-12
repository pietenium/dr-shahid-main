import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SearchParams, SearchResult } from "@/types/search";

export async function searchContent(
  params: SearchParams,
): Promise<SearchResult> {
  const { data } = await api.get<ApiResponse<SearchResult>>("/search", {
    params,
  });
  return data.data;
}

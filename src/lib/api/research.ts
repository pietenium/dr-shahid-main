import { api } from "@/lib/axios";
import { serverFetch } from "@/lib/fetcher";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { Research, ResearchFilterParams } from "@/types/research";

export async function getResearchList(
  params?: ResearchFilterParams,
): Promise<PaginatedData<Research>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.uploadType) query.set("uploadType", params.uploadType);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return serverFetch<PaginatedData<Research>>(
    `/research${qs ? `?${qs}` : ""}`,
    { revalidate: 300, tags: ["research"] },
  );
}

export async function getResearchBySlug(slug: string): Promise<Research> {
  return serverFetch<Research>(`/research/slug/${slug}`, {
    revalidate: 600,
    tags: ["research", slug],
  });
}

export async function fetchResearchClient(params: ResearchFilterParams) {
  const { data } = await api.get<ApiResponse<PaginatedData<Research>>>(
    "/research",
    { params },
  );
  return data.data;
}

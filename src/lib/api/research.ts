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

export async function fetchResearchClient(
  params: ResearchFilterParams,
): Promise<PaginatedData<Research>> {
  const { data: response } = await api.get<ApiResponse<Research[]>>(
    "/research",
    { params },
  );

  const { data, meta } = response;

  if (meta) {
    return {
      docs: data,
      totalDocs: meta.total,
      limit: meta.limit,
      totalPages: meta.totalPage,
      page: meta.page,
    };
  }

  return {
    docs: data || [],
    totalDocs: 0,
    limit: 10,
    totalPages: 0,
    page: 1,
  };
}

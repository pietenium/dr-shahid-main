import type { ApiResponse } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = (await res.json()) as ApiResponse<unknown>;

  // If the backend returns meta, we map it to the frontend's PaginatedData structure
  if (json.meta) {
    const paginated = {
      docs: json.data as unknown[],
      totalDocs: json.meta.total,
      limit: json.meta.limit,
      totalPages: json.meta.totalPage,
      page: json.meta.page,
    };
    return paginated as unknown as T;
  }

  // Cast the simple data response to the expected return type T
  return json.data as T;
}

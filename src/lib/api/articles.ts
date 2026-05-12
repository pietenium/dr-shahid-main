import { api } from "@/lib/axios";
import { serverFetch } from "@/lib/fetcher";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type {
  Article,
  ArticleCategory,
  ArticleFilterParams,
} from "@/types/article";

export async function getArticles(
  params?: ArticleFilterParams,
): Promise<PaginatedData<Article>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.category) query.set("category", String(params.category));
  if (params?.articleType) query.set("articleType", params.articleType);
  if (params?.search) query.set("search", params.search);
  if (params?.tag) query.set("tag", params.tag);
  const qs = query.toString();
  return serverFetch<PaginatedData<Article>>(`/articles${qs ? `?${qs}` : ""}`, {
    revalidate: 300,
    tags: ["articles"],
  });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  return serverFetch<Article>(`/articles/slug/${slug}`, {
    revalidate: 600,
    tags: ["article", slug],
  });
}

export async function getCategories(): Promise<ArticleCategory[]> {
  return serverFetch<ArticleCategory[]>("/articles/categories", {
    revalidate: 300,
    tags: ["categories"],
  });
}

// Client-side version for filtered/paginated fetches
export async function fetchArticlesClient(params: ArticleFilterParams) {
  const { data } = await api.get<ApiResponse<PaginatedData<Article>>>(
    "/articles",
    { params },
  );
  return data.data;
}

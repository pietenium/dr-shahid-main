import type { ImageFile } from "./api";

export type ArticleType = "MEDICAL" | "POLITICAL";
export type ContentStatus = "DRAFT" | "PUBLISHED";

export interface ArticleCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: ImageFile;
  category: ArticleCategory;
  articleType: ArticleType;
  status: ContentStatus;
  impressions: number;
  ogImage?: ImageFile;
  author?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFilterParams {
  page?: number;
  limit?: number;
  category?: string;
  articleType?: ArticleType;
  search?: string;
  tag?: string;
}

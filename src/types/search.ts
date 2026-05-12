import type { ArticleType } from "./article";
import type { UploadType } from "./research";

export type SearchType = "article" | "research" | "testimonial";

export interface SearchResult {
  query: string;
  totalResults: number;
  results: {
    articles: Array<{
      _id: string;
      title: string;
      slug: string;
      excerpt?: string;
      articleType: ArticleType;
      resultType: "article";
    }>;
    research: Array<{
      _id: string;
      title: string;
      slug: string;
      description?: string;
      uploadType: UploadType;
      resultType: "research";
    }>;
    testimonials: Array<{
      _id: string;
      name: string;
      content: string;
      designation?: string;
      resultType: "testimonial";
    }>;
  };
}

export interface SearchParams {
  q: string;
  type?: SearchType;
  limit?: number;
}

import type { ImageFile } from "./api";
import type { ContentStatus } from "./article";

export type UploadType = "PDF" | "DOI";

export interface Research {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  uploadType: UploadType;
  pdfFile?: ImageFile;
  doiUrl?: string;
  doiNumber?: string;
  thumbnailImage?: ImageFile;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchFilterParams {
  page?: number;
  limit?: number;
  uploadType?: UploadType;
  search?: string;
}

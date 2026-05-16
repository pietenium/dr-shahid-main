export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  minImpressions?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedData<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaginatedData<T>;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

export interface ImageFile {
  url: string;
  fileId: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  ip: string;
}

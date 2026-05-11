import type { ImageFile } from "./api";

export interface VideoFile {
  url: string;
  fileId: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  image?: ImageFile;
  video?: VideoFile;
  rating: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

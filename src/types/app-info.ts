import type { ImageFile } from "./api";

export interface AppInfo {
  _id: string;
  siteName: string;
  siteDescription?: string;
  doctorName: string;
  doctorTitle: string;
  doctorSpecialty: string;
  doctorBio?: string;
  doctorImage?: ImageFile;
  ogImage?: ImageFile;
  email: string;
  phone: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  clinicHours?: string;
  mapEmbedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

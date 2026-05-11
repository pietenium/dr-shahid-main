import { serverFetch } from "@/lib/fetcher";
import type { AppInfo } from "@/types/app-info";

export async function getAppInfo(): Promise<AppInfo> {
  return serverFetch<AppInfo>("/app-info", {
    revalidate: 3600,
    tags: ["app-info"],
  });
}

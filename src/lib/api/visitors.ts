import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export async function giveConsent(): Promise<void> {
  await api.post<ApiResponse<null>>("/visitor/accept");
}

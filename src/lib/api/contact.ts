import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ContactPayload, ContactResponse } from "@/types/contact";

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResponse> {
  const { data } = await api.post<ApiResponse<ContactResponse>>(
    "/contact",
    payload,
  );
  return data.data;
}

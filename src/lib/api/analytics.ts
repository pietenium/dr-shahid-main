import { api } from "@/lib/axios";

export interface TrackPayload {
  page: string;
  sessionId: string;
  visitorId?: string;
  referrer?: string;
}

export async function trackPageView(payload: TrackPayload): Promise<void> {
  await api.post("/analytics/track", payload);
}

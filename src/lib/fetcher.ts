const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

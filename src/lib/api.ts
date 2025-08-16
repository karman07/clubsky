export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type ApiErr = { message?: string };

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ApiErr;
      if (data?.message) msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

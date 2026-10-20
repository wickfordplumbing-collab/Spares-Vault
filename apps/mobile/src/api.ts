const BASE = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, "");

export function apiBase(): string {
  return BASE;
}

export async function api<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
  };
  if (init?.token) headers.Authorization = `Bearer ${init.token}`;
  const response = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers, ...(init?.headers || {}) } });
  const text = await response.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text.slice(0, 240) };
    }
  }
  if (!response.ok) {
    const message = (data as { error?: string }).error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

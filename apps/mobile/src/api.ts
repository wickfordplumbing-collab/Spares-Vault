import { demoRequest, isDemoMode } from "./demo/engine";

const BASE = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, "");

export function apiBase(): string {
  return isDemoMode() ? "demo://browser" : BASE;
}

export { isDemoMode };

export async function api<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  if (isDemoMode()) {
    try {
      return await demoRequest<T>(path, { method: init?.method, body: init?.body ?? null, token: init?.token });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The browser demo could not complete that request";
      throw new Error(message);
    }
  }
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

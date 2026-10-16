const BLOCKED = new Set([
  "authorization",
  "connection",
  "content-length",
  "cookie",
  "host",
]);

export function upstreamUrl(
  backendUrl: string,
  segments: string[],
  search = "",
): string {
  return `${backendUrl.replace(/\/+$/, "")}/${segments.join("/")}${search}`;
}

export function resolveToken(
  cookieToken: string | null,
  bypassToken: string | undefined,
  isProduction: boolean,
): string | null {
  if (cookieToken) return cookieToken;
  if (isProduction) return null;
  return bypassToken || null;
}

export function upstreamHeaders(
  incoming: Headers,
  token: string | null,
): Headers {
  const headers = new Headers();

  incoming.forEach((value, key) => {
    if (!BLOCKED.has(key.toLowerCase())) headers.set(key, value);
  });

  if (token) headers.set("authorization", `Bearer ${token}`);

  return headers;
}

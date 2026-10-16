import { clearAccessToken, getAccessToken } from "@/lib/auth/cookies";
import {
  resolveToken,
  upstreamHeaders,
  upstreamUrl,
} from "@/lib/http/upstream";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

async function proxy(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const token = resolveToken(
    await getAccessToken(),
    process.env.AUTH_BYPASS_TOKEN,
    process.env.NODE_ENV === "production",
  );

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  let response: Response;
  try {
    response = await fetch(
      upstreamUrl(BACKEND_URL, path, new URL(request.url).search),
      {
        method: request.method,
        headers: upstreamHeaders(request.headers, token),
        body,
        cache: "no-store",
        redirect: "manual",
      },
    );
  } catch (cause) {
    return Response.json(
      {
        message: `Backend inacessível em ${BACKEND_URL}.`,
        detail: cause instanceof Error ? cause.message : String(cause),
      },
      { status: 503 },
    );
  }

  if (response.status === 401) await clearAccessToken();

  const headers = new Headers();
  for (const name of ["content-type", "content-disposition"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(response.body, { status: response.status, headers });
}

export {
  proxy as DELETE,
  proxy as GET,
  proxy as PATCH,
  proxy as POST,
  proxy as PUT,
};

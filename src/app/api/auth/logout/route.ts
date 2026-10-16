import { clearAccessToken, getAccessToken } from "@/lib/auth/cookies";
import { upstreamUrl } from "@/lib/http/upstream";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST() {
  const token = await getAccessToken();

  if (token) {
    try {
      await fetch(upstreamUrl(BACKEND_URL, ["auth", "logout"]), {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    } catch {}
  }

  await clearAccessToken();

  return Response.json({ ok: true });
}

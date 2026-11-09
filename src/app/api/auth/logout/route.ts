import { clearAccessToken } from "@/lib/auth/cookies";

export async function POST() {
  await clearAccessToken();

  return Response.json({ ok: true });
}

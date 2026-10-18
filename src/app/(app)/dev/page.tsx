import { redirect } from "next/navigation";

// This segment only issues a redirect, so it can never produce an instant/static
// UI. Opt it out of Cache Components' instant-navigation validation to avoid the
// "Could not validate `instant`" error raised while rendering the target segment.
export const instant = false;

export default function DevIndex() {
  redirect("/dev/primitives");
}

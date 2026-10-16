export type Account = {
  name: string;
  email: string | null;
  organization: string | null;
  profilePicture: string | null;
};

export async function getAccount(): Promise<Account | null> {
  return {
    name: "Ana Souza",
    email: "ana@exemplo.com",
    organization: "1one",
    profilePicture: null,
  };
}

export function initials(name?: string | null): string {
  const clean = (name ?? "").trim();
  if (!clean) return "U";

  return (
    clean
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

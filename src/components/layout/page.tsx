import type { ReactNode } from "react";

export function PageLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6 p-6 md:p-8">{children}</div>;
}

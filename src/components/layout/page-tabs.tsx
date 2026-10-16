"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActiveLink } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { AppRoute } from "./routes";

export function PageTabs({ items }: { items: AppRoute[] }) {
  const pathname = usePathname();

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Seções desta página"
      className="flex gap-1 border-b border-border"
    >
      {items.map((item) => {
        const isActive = isActiveLink(item.link, pathname, items);

        return (
          <Link
            key={item.id}
            href={item.link ?? "#"}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

import { CodeXmlIcon, HomeIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AppRoute = {
  id: string;
  title: string;
  link?: string;
  icon?: ReactNode;
  nav?: false;
  children?: AppRoute[];
};

export const routes: AppRoute[] = [
  {
    id: "home",
    title: "Home",
    icon: <HomeIcon className="size-4" />,
    link: "/home",
  },
  {
    id: "dev",
    title: "Design system",
    icon: <CodeXmlIcon className="size-4" />,
    link: "/dev",
    nav: false,
    children: [
      { id: "dev-primitives", title: "Primitives", link: "/dev/primitives" },
      { id: "dev-semantics", title: "Semantics", link: "/dev/semantics" },
      { id: "dev-components", title: "Components", link: "/dev/components" },
      { id: "dev-skeletons", title: "Skeletons", link: "/dev/skeletons" },
    ],
  },
];

export function childRoutes(id: string): AppRoute[] {
  return routes.find((route) => route.id === id)?.children ?? [];
}

export const navRoutes = routes.filter((route) => route.nav !== false);

export function routeTitle(link: string): string {
  const find = (items: AppRoute[]): string | undefined => {
    for (const item of items) {
      if (item.link === link) return item.title;
      const found = item.children && find(item.children);
      if (found) return found;
    }
  };

  const title = find(routes);
  if (!title) throw new Error(`Rota sem título no catálogo: ${link}`);
  return title;
}

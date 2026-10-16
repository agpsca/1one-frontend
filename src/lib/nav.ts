export type NavNode = {
  id: string;
  link?: string;
  title?: string;
  children?: NavNode[];
};

function matchesLink(
  link: string | undefined,
  pathname: string,
): link is string {
  return (
    !!link &&
    (pathname === link || (link !== "/" && pathname.startsWith(`${link}/`)))
  );
}

export function isActiveLink(
  link: string | undefined,
  pathname: string,
  siblings?: NavNode[],
): boolean {
  return (
    matchesLink(link, pathname) &&
    !siblings?.some(
      (sibling) =>
        sibling.link !== link &&
        sibling.link &&
        sibling.link.length > link.length &&
        matchesLink(sibling.link, pathname),
    )
  );
}

export function hasActiveChild(
  items: NavNode[] | undefined,
  pathname: string,
): boolean {
  if (!items?.length) return false;

  return items.some(
    (item) =>
      isActiveLink(item.link, pathname, items) ||
      hasActiveChild(item.children, pathname),
  );
}

export function buildTrail(items: NavNode[], pathname: string): NavNode[] {
  for (const item of items) {
    const childTrail = item.children ? buildTrail(item.children, pathname) : [];
    if (childTrail.length) return [item, ...childTrail];

    if (isActiveLink(item.link, pathname, items)) return [item];
  }

  return [];
}

export function buildOpenMap(
  items: NavNode[],
  pathname: string,
): Record<string, boolean> {
  const map: Record<string, boolean> = {};

  const walk = (nodes: NavNode[]) => {
    for (const node of nodes) {
      if (node.children?.length) {
        if (
          hasActiveChild(node.children, pathname) ||
          isActiveLink(node.link, pathname)
        ) {
          map[node.id] = true;
        }
        walk(node.children);
      }
    }
  };

  walk(items);
  return map;
}

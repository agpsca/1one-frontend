"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { buildOpenMap, hasActiveChild, isActiveLink } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { AppRoute } from "./routes";

function indentClass(depth: number, isCollapsed: boolean) {
  if (isCollapsed) return "mx-auto px-2 justify-center";
  if (depth === 0) return "px-2";
  if (depth === 1) return "pl-3 pr-2";
  if (depth === 2) return "pl-5 pr-2";
  return "pl-7 pr-2";
}

const activeClass =
  "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground";
const idleClass =
  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

function NavTreeItem({
  item,
  siblings,
  depth,
  isCollapsed,
  pathname,
  openMap,
  setOpenMap,
}: {
  item: AppRoute;
  siblings: AppRoute[];
  depth: number;
  isCollapsed: boolean;
  pathname: string;
  openMap: Record<string, boolean>;
  setOpenMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const { setOpen } = useSidebar();

  const hasChildren = !!item.children?.length;
  const isActive = isActiveLink(item.link, pathname, siblings);
  const isChildActive = hasActiveChild(item.children, pathname);
  const isOpen = !!openMap[item.id];
  const indent = indentClass(depth, isCollapsed);

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible
          className="w-full"
          open={!isCollapsed && isOpen}
          onOpenChange={(open) => {
            setOpenMap((prev) => ({ ...prev, [item.id]: open }));
            if (isCollapsed && open) setOpen(true);
          }}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={isCollapsed ? item.title : undefined}
              className={cn(
                "flex w-full min-w-0 items-center rounded-md py-2 text-sm transition-colors",
                indent,
                isActive || isChildActive ? activeClass : idleClass,
              )}
            >
              <span className="shrink-0">{item.icon}</span>

              {!isCollapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="shrink-0">
                    {isOpen ? (
                      <ChevronDownIcon className="size-4" />
                    ) : (
                      <ChevronRightIcon className="size-4" />
                    )}
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {!isCollapsed && (
            <CollapsibleContent>
              <SidebarMenuSub
                className={cn(
                  "mt-1 space-y-1 border-l border-sidebar-border/60 py-1",
                  depth === 0 ? "ml-2" : "ml-3",
                )}
              >
                {item.children?.map((child) => (
                  <NavTreeItem
                    key={child.id}
                    item={child}
                    siblings={item.children ?? []}
                    depth={depth + 1}
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                    openMap={openMap}
                    setOpenMap={setOpenMap}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  const label = !isCollapsed && (
    <span className="min-w-0 truncate text-sm font-medium">{item.title}</span>
  );

  if (depth === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={isCollapsed ? item.title : undefined}
          className={cn(
            "flex w-full min-w-0 items-center rounded-md py-2 text-sm transition-colors",
            indent,
            isActive ? activeClass : idleClass,
          )}
        >
          <Link
            href={item.link ?? "#"}
            prefetch
            aria-current={isActive ? "page" : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuSubItem className="h-auto">
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link
          href={item.link ?? "#"}
          prefetch
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex min-w-0 items-center rounded-md py-2 text-sm font-medium transition-colors",
            indent,
            isActive ? activeClass : idleClass,
          )}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          {label}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function AppSidebarNavigation({ routes }: { routes: AppRoute[] }) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  const openByRoute = useMemo(
    () => buildOpenMap(routes, pathname),
    [routes, pathname],
  );

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(openByRoute);

  useEffect(() => {
    setOpenMap((prev) => ({ ...prev, ...openByRoute }));
  }, [openByRoute]);

  return (
    <SidebarMenu className="space-y-1">
      {routes.map((route) => (
        <NavTreeItem
          key={route.id}
          item={route}
          siblings={routes}
          depth={0}
          isCollapsed={isCollapsed}
          pathname={pathname}
          openMap={openMap}
          setOpenMap={setOpenMap}
        />
      ))}
    </SidebarMenu>
  );
}

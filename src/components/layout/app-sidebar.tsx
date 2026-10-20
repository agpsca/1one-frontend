"use client";

import { CodeXmlIcon } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Account } from "@/features/account/account";
import { cn } from "@/lib/utils";
import { AppSidebarNavigation } from "./nav-main";
import { navRoutes } from "./routes";
import { UserProfile } from "./user-profile";

function BrandMark() {
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-sidebar-border font-heading text-base font-medium text-sidebar-primary"
    >
      1
    </span>
  );
}

function DevDocsLink() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dev">
            <CodeXmlIcon />
            <span className="sr-only">Design system</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Design system</TooltipContent>
    </Tooltip>
  );
}

function SidebarToggle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent side="right">Alternar barra lateral</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({ account }: { account: Account | null }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon" resizable>
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-center md:justify-start"
            : "flex-row items-center justify-between",
        )}
      >
        <Link href="/home" className="flex items-center gap-2">
          <BrandMark />
          {!isCollapsed && (
            <span className="font-heading font-medium text-foreground">
              1one
            </span>
          )}
        </Link>

        <div
          key={isCollapsed ? "collapsed" : "expanded"}
          className={cn(
            "flex animate-in items-center gap-2 duration-500 fade-in",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row",
          )}
        >
          {!isCollapsed && <DevDocsLink />}
          {!isCollapsed && <ThemeToggle />}
          {!isCollapsed && <SidebarToggle />}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        <AppSidebarNavigation routes={navRoutes} />
      </SidebarContent>

      <SidebarFooter className={cn("px-2", isCollapsed && "items-center px-1")}>
        {isCollapsed && (
          <>
            <SidebarToggle />
            <ThemeToggle />
            <DevDocsLink />
            <SidebarSeparator className="my-1" />
          </>
        )}
        <UserProfile account={account} />
      </SidebarFooter>
    </Sidebar>
  );
}

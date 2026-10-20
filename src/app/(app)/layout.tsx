import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getAccount } from "@/features/account/account";

export const instant = false;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore, account] = await Promise.all([cookies(), getAccount()]);
  const collapsed = cookieStore.get("sidebar_state")?.value === "false";

  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <div className="relative flex h-dvh w-full overflow-hidden">
        <AppSidebar account={account} />

        <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background/40">
          <header className="relative flex h-14 shrink-0 items-center border-b border-border px-4 md:hidden">
            <SidebarTrigger aria-label="Abrir navegação" />
            <span className="absolute left-1/2 -translate-x-1/2 font-heading font-medium">
              1one
            </span>
          </header>

          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

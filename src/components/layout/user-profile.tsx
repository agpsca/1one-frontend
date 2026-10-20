"use client";

import {
  Building2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  LogOutIcon,
  MailIcon,
  UserPenIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { type Account, initials } from "@/features/account/account";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal-store";

function AccountAvatar({
  account,
  className,
}: {
  account: Account | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background text-foreground",
        className,
      )}
    >
      {account?.profilePicture ? (
        <Image
          src={account.profilePicture}
          alt={account.name}
          width={36}
          height={36}
          unoptimized
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span aria-hidden className="text-xs font-semibold">
          {initials(account?.name)}
        </span>
      )}
    </div>
  );
}

function AccountDetails({ account }: { account: Account | null }) {
  return (
    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
      {account?.email && (
        <div className="flex items-center gap-2">
          <MailIcon className="size-3.5 shrink-0" />
          <span className="truncate">{account.email}</span>
        </div>
      )}
      {account?.organization && (
        <div className="flex items-center gap-2">
          <Building2Icon className="size-3.5 shrink-0" />
          <span className="truncate">{account.organization}</span>
        </div>
      )}
    </div>
  );
}

export function UserProfile({ account }: { account: Account | null }) {
  const { isMobile } = useSidebar();
  const openModal = useModalStore((store) => store.open);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const name = account?.name || "Usuário";

  const handleLogout = async () => {
    setConfirmOpen(false);
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.replace("/login");
    }
  };

  return (
    <SidebarMenu className="flex-row items-center gap-2 group-data-[collapsible=icon]:flex-col">
      <SidebarMenuItem className="order-2 shrink-0 group-data-[collapsible=icon]:order-0">
        <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              tooltip="Sair"
              disabled={isLoggingOut}
              className="size-9! justify-center text-destructive hover:bg-destructive-surface hover:text-destructive group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8!"
            >
              {isLoggingOut ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <LogOutIcon />
              )}
              <span className="sr-only">Sair</span>
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent align="end" side="right" className="w-72 gap-0 p-0">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <AccountAvatar account={account} className="size-9 bg-muted" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Sair desta conta?
                </p>
              </div>
            </div>

            <div className="px-4 py-3">
              <AccountDetails account={account} />
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOutIcon className="size-3.5" />
                Sair
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>

      <SidebarMenuItem className="flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
            >
              <AccountAvatar account={account} />

              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {account?.organization || account?.email || ""}
                </span>
              </div>

              <ChevronUpIcon className="ml-auto size-4 shrink-0 opacity-70 group-data-open/menu-button:hidden group-data-[collapsible=icon]:hidden" />
              <ChevronDownIcon className="ml-auto hidden size-4 shrink-0 opacity-70 group-data-open/menu-button:block group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "top"}
            sideOffset={4}
            className="mb-4 w-(--radix-dropdown-menu-trigger-width) min-w-56"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Minha conta
            </DropdownMenuLabel>

            <div className="px-2 pt-1 pb-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
                <AccountAvatar account={account} className="size-9 bg-muted" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {account?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={!account}
              onClick={() =>
                account &&
                openModal("editProfile", {
                  name: account.name,
                  email: account.email ?? "",
                })
              }
            >
              <UserPenIcon />
              Editar perfil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

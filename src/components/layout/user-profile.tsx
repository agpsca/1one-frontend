"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  LogOutIcon,
  UserPenIcon,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export function UserProfile({ account }: { account: Account | null }) {
  const { isMobile, state } = useSidebar();
  const openModal = useModalStore((store) => store.open);

  const logoutStarted = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const name = account?.name || "Usuário";

  const handleLogout = async () => {
    if (logoutStarted.current) return;

    logoutStarted.current = true;
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
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton
                  type="button"
                  aria-label="Sair"
                  aria-busy={isLoggingOut}
                  disabled={isLoggingOut}
                  className="size-9! justify-center text-destructive hover:bg-destructive-surface hover:text-destructive group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8!"
                >
                  {isLoggingOut ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <LogOutIcon />
                  )}
                </SidebarMenuButton>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              hidden={state !== "collapsed" || isMobile}
            >
              Sair
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Você voltará para a tela de login.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                onClick={handleLogout}
              >
                <LogOutIcon className="size-3.5" />
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

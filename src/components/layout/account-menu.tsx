"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  dashboardPath: string;
  compact?: boolean;
};

export function AccountMenu({ dashboardPath, compact = false }: AccountMenuProps) {
  const { data: session } = useSession();
  const name = session?.user?.name || "Traveler";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className={cn("h-10 gap-2 rounded-full px-2", compact && "max-w-40")}
          aria-label="Open account menu"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt=""
              key={session.user.image}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-xs font-semibold text-sky-700 dark:text-sky-300">
              {initials}
            </span>
          )}
          {!compact && <span className="max-w-28 truncate">{name}</span>}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[60] min-w-56 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl"
        >
          <div className="border-b px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          <DropdownMenu.Item asChild>
            <Link
              href={dashboardPath}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent focus:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/user/profile"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent focus:bg-accent"
            >
              <UserRound className="h-4 w-4" /> Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 border-t" />
          <DropdownMenu.Item
            onSelect={() => void signOut({ callbackUrl: "/" })}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none hover:bg-destructive/10 focus:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

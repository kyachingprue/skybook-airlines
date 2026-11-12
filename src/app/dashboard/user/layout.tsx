"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Plane,
  Ticket,
  UserRound,
} from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard, exact: true },
  { label: "My Bookings", href: "/dashboard/user/bookings", icon: Ticket },
  { label: "Profile", href: "/dashboard/user/profile", icon: UserRound },
];

export default function UserDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="animate-pulse text-sm text-muted-foreground">
          {status === "loading" ? "Loading your dashboard..." : "Redirecting to sign in..."}
        </p>
      </div>
    );
  }

  const firstName = session.user.name?.split(" ")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard/user" className="flex shrink-0 items-center gap-2 font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                <Plane className="h-5 w-5" />
              </span>
              <span className="hidden bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-lg text-transparent sm:inline">
                SkyBook
              </span>
            </Link>
            <div className="hidden h-8 border-l sm:block" />
            <div className="hidden min-w-0 sm:block">
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="max-w-48 truncate text-sm font-semibold">{firstName}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <AccountMenu dashboardPath="/dashboard/user" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r bg-background p-5 lg:flex">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 p-4 text-white">
            <p className="font-semibold">Ready for your next trip?</p>
            <p className="mt-1 text-xs leading-5 text-sky-100">
              Explore flights and find a route that works for you.
            </p>
            <Link
              href="/flights"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Find a flight <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <nav
            aria-label="Dashboard navigation"
            className="flex gap-2 overflow-x-auto border-b bg-background px-4 py-3 lg:hidden"
          >
            {navigation.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
            <Link
              href="/flights"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <Plane className="h-4 w-4" /> Find flights
            </Link>
          </nav>
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

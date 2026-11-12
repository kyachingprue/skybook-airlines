"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Plane, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccountMenu } from "@/components/layout/account-menu";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Air Tickets", href: "/flights" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const dashboardPath =
    session?.user?.role === "ADMIN"
      ? "/dashboard/admin"
      : session?.user?.role === "AIRLINE"
      ? "/dashboard/airline"
      : "/dashboard/user";

  const isCurrentRoute = (href: string) => {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (!open) return;

    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
            <Plane className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            SkyBook
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navigationItems.map((item) => {
            const active = isCurrentRoute(item.href);
            return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-2 py-2 transition",
                active
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="hidden sm:block">
              <AccountMenu dashboardPath={dashboardPath} />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation-drawer"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className={cn("fixed inset-0 z-[60] overflow-hidden lg:hidden transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        />
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          inert={!open}
          className={cn(
            "absolute inset-y-0 right-0 flex h-dvh w-[min(88vw,24rem)] flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                <Plane className="h-5 w-5" />
              </span>
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-lg text-transparent">
                SkyBook
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <nav aria-label="Mobile navigation links" className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const active = isCurrentRoute(item.href);
                return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium transition",
                    active
                      ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
                );
              })}
            </div>
            {session ? (
              <div className="mt-5 space-y-3 border-t pt-5">
                <AccountMenu dashboardPath={dashboardPath} />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => void signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="mt-5 grid gap-2 border-t pt-5">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                </Button>
              </div>
            )}
          </nav>
          <p className="shrink-0 border-t px-5 py-4 text-xs text-muted-foreground">
            Find your next destination with SkyBook.
          </p>
        </aside>
      </div>
    </header>
  );
}

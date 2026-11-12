"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Plane, Menu, X, User, LayoutDashboard, LogOut, Ticket } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const dashboardPath =
    session?.user?.role === "ADMIN"
      ? "/dashboard/admin"
      : session?.user?.role === "AIRLINE"
      ? "/dashboard/airline"
      : "/dashboard/user";

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

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/flights" className="text-muted-foreground hover:text-foreground transition">
            Flights
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
            About
          </Link>
          {session && (
            <Link href={dashboardPath} className="text-muted-foreground hover:text-foreground transition">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={dashboardPath}>
                  <LayoutDashboard className="h-4 w-4" />
                  {session.user.name?.split(" ")[0] || "Account"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t bg-background transition-all overflow-hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container px-4 py-4 flex flex-col gap-3">
          <Link href="/flights" onClick={() => setOpen(false)} className="py-2">
            Flights
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="py-2">
            About
          </Link>
          {session ? (
            <>
              <Link href={dashboardPath} onClick={() => setOpen(false)} className="py-2 flex items-center gap-2">
                <Ticket className="h-4 w-4" /> My Bookings
              </Link>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link href="/register" onClick={() => setOpen(false)}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

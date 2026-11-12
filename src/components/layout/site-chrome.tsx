"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollAnimations } from "@/components/effects/scroll-animations";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTravelerDashboard = pathname.startsWith("/dashboard/user");

  return (
    <div className="flex min-h-screen flex-col">
      {!isTravelerDashboard && <Navbar />}
      {isTravelerDashboard ? children : <main className="flex-1">{children}</main>}
      {!isTravelerDashboard && <Footer />}
      <ScrollAnimations />
    </div>
  );
}

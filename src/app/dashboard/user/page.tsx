"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Ticket, Plane, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DEMO_BOOKINGS = [
  {
    id: "1",
    ref: "SK8X2P9Q",
    flight: "SK101 · DAC → DXB",
    date: "20 Nov 2026",
    status: "CONFIRMED",
    amount: 320,
  },
  {
    id: "2",
    ref: "SK3K7M1A",
    flight: "SK205 · DAC → BKK",
    date: "05 Dec 2026",
    status: "PENDING",
    amount: 185,
  },
];

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name?.split(" ")[0] || "Traveler"}</h1>
        <p className="text-muted-foreground mt-1">Manage your bookings and upcoming trips</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Bookings", value: "2", icon: Ticket, color: "from-sky-500 to-blue-600" },
          { label: "Upcoming", value: "1", icon: Plane, color: "from-emerald-500 to-teal-600" },
          { label: "This Month", value: "$320", icon: CreditCard, color: "from-violet-500 to-purple-600" },
          { label: "Next Trip", value: "20 Nov", icon: Calendar, color: "from-amber-500 to-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Bookings</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/flights">
            Book New Flight <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_BOOKINGS.map((b) => (
          <Card key={b.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-sm text-sky-600 dark:text-sky-400 font-semibold">{b.ref}</div>
                <div className="font-medium mt-1">{b.flight}</div>
                <div className="text-sm text-muted-foreground">{b.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    b.status === "CONFIRMED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {b.status}
                </span>
                <div className="font-semibold">${b.amount}</div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

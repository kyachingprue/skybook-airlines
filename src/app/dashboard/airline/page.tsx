"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plane, Users, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AirlineDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (
      status === "authenticated" &&
      session?.user?.role !== "AIRLINE" &&
      session?.user?.role !== "ADMIN"
    ) {
      router.push("/dashboard/user");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading airline dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10" data-reveal>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-enter>
        <div>
          <h1 className="text-3xl font-bold">Airline Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your flights & schedules</p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4" /> Add Flight
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-10" data-reveal-stagger>
        {[
          { label: "Active Flights", value: "24", icon: Plane },
          { label: "Passengers (30d)", value: "1,842", icon: Users },
          { label: "Upcoming Departures", value: "8", icon: Calendar },
        ].map((stat) => (
          <Card key={stat.label} data-reveal-item>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
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

      <Card data-reveal>
        <CardHeader>
          <CardTitle>Recent Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { num: "SK101", route: "DAC → DXB", status: "SCHEDULED", seats: "42/180" },
              { num: "SK205", route: "DAC → BKK", status: "BOARDING", seats: "28/160" },
              { num: "SK310", route: "DXB → DAC", status: "DELAYED", seats: "91/180" },
            ].map((f) => (
              <div
                key={f.num}
                className="flex items-center justify-between p-4 rounded-xl border bg-muted/20"
              >
                <div>
                  <div className="font-semibold">{f.num}</div>
                  <div className="text-sm text-muted-foreground">{f.route}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{f.status}</div>
                  <div className="text-xs text-muted-foreground">{f.seats} seats</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Plane, Ticket, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const revenueData = [
  { name: "Mon", value: 4200 },
  { name: "Tue", value: 3800 },
  { name: "Wed", value: 5100 },
  { name: "Thu", value: 4600 },
  { name: "Fri", value: 6200 },
  { name: "Sat", value: 7800 },
  { name: "Sun", value: 6900 },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard/user");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading admin panel...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10" data-reveal>
      <div className="mb-8" data-enter>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview & management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10" data-reveal-stagger>
        {[
          { label: "Total Users", value: "12,480", icon: Users, change: "+12%" },
          { label: "Active Flights", value: "86", icon: Plane, change: "+3" },
          { label: "Bookings (30d)", value: "3,241", icon: Ticket, change: "+18%" },
          { label: "Revenue (30d)", value: "$284k", icon: DollarSign, change: "+9%" },
        ].map((stat) => (
          <Card key={stat.label} data-reveal-item>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> {stat.change}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2" data-reveal-stagger>
        <Card data-reveal-item>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(199 89% 48%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-reveal-item>
          <CardHeader>
            <CardTitle>Booking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(239 84% 67%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

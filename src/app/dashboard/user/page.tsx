"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, Plane, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Booking = {
  id: string;
  bookingRef: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  flight: {
    flightNumber: string;
    departureTime: string;
    airline: { name: string };
    departureAirport: { code: string };
    arrivalAirport: { code: string };
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/bookings")
      .then(async (response) => {
        const data: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof data === "object" && data !== null && "error" in data
              ? String(data.error)
              : "Could not load your bookings.";
          throw new Error(message);
        }
        return data as Booking[];
      })
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load your bookings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => new Date(booking.flight.departureTime) >= new Date()),
    [bookings]
  );
  const currentMonthSpend = useMemo(
    () =>
      bookings
        .filter((booking) => {
          const date = new Date(booking.createdAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((total, booking) => total + Number(booking.totalAmount), 0),
    [bookings]
  );
  const nextTrip = upcomingBookings[0];
  const stats = [
    { label: "Total bookings", value: loading ? "—" : String(bookings.length), icon: Ticket, color: "from-sky-500 to-blue-600" },
    { label: "Upcoming trips", value: loading ? "—" : String(upcomingBookings.length), icon: Plane, color: "from-emerald-500 to-teal-600" },
    { label: "This month", value: loading ? "—" : `$${currentMonthSpend.toFixed(2)}`, icon: CreditCard, color: "from-violet-500 to-purple-600" },
    { label: "Next trip", value: loading ? "—" : nextTrip ? formatDate(nextTrip.flight.departureTime) : "—", icon: CalendarDays, color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="mx-auto max-w-6xl" data-reveal>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-enter>
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">Traveler overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome, {session?.user?.name?.split(" ")[0] || "Traveler"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Your trips and account details, all in one place.</p>
        </div>
        <Button variant="gradient" asChild className="w-fit">
          <Link href="/flights">Book a flight <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-reveal-stagger>
        {stats.map((stat) => (
          <Card key={stat.label} data-reveal-item>
            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="truncate text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Recent bookings</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your latest flight reservations.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/user/bookings">All bookings <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      {error ? (
        <Card><CardContent role="alert" className="p-5 text-sm text-destructive">{error}</CardContent></Card>
      ) : loading ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading your trips...</CardContent></Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-10 text-center">
            <Ticket className="h-8 w-8 text-sky-600 dark:text-sky-300" />
            <p className="mt-3 font-semibold">Your next adventure starts here</p>
            <p className="mt-1 text-sm text-muted-foreground">Once you book a flight, you&apos;ll find it here.</p>
            <Button className="mt-4" variant="gradient" asChild><Link href="/flights">Browse flights</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 3).map((booking) => (
            <Card key={booking.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-sky-700 dark:text-sky-300">{booking.bookingRef}</p>
                  <p className="mt-1 font-medium">
                    {booking.flight.departureAirport.code} → {booking.flight.arrivalAirport.code}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {booking.flight.airline.name} · {booking.flight.flightNumber}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(booking.flight.departureTime)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {booking.status.replaceAll("_", " ")}
                  </span>
                  <span className="font-semibold">${Number(booking.totalAmount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Plane, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Booking = {
  id: string;
  bookingRef: string;
  status: string;
  totalAmount: string | number;
  passengersCount: number;
  createdAt: string;
  flight: {
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    airline: { name: string; code: string };
    departureAirport: { code: string; city: string };
    arrivalAirport: { code: string; city: string };
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyBookingsPage() {
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

  return (
    <div className="mx-auto max-w-5xl" data-reveal>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-enter>
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">Your travel</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">My Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep track of your flights and booking details.
          </p>
        </div>
        <Button variant="gradient" asChild className="w-fit">
          <Link href="/flights">Find flights <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      {loading ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading your bookings...</CardContent></Card>
      ) : error ? (
        <Card><CardContent role="alert" className="p-6 text-sm text-destructive">{error}</CardContent></Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <Ticket className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">No bookings yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              When you book a flight, its itinerary and status will appear here.
            </p>
            <Button className="mt-5" variant="gradient" asChild>
              <Link href="/flights">Explore flights</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4" data-reveal-stagger>
          {bookings.map((booking) => (
            <Card key={booking.id} data-reveal-item className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-sky-700 dark:text-sky-300">
                        {booking.bookingRef}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {booking.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <div>
                        <p className="text-xl font-semibold">{booking.flight.departureAirport.code}</p>
                        <p className="text-xs text-muted-foreground">{booking.flight.departureAirport.city}</p>
                      </div>
                      <Plane className="h-4 w-4 rotate-90 text-sky-500 sm:rotate-0" />
                      <div>
                        <p className="text-xl font-semibold">{booking.flight.arrivalAirport.code}</p>
                        <p className="text-xs text-muted-foreground">{booking.flight.arrivalAirport.city}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {booking.flight.airline.name} · {booking.flight.flightNumber}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(booking.flight.departureTime)}
                      </span>
                      <span>{booking.passengersCount} passenger{booking.passengersCount === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4 md:min-w-36 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <span className="text-xs text-muted-foreground">Total fare</span>
                    <span className="text-xl font-bold">${Number(booking.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

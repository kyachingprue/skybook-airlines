"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plane, Clock, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Suspense } from "react";

// Demo flights (in production these come from /api/flights + Prisma)
const DEMO_FLIGHTS = [
  {
    id: "fl1",
    flightNumber: "SK101",
    airline: "SkyBook Air",
    from: "DAC",
    fromCity: "Dhaka",
    to: "DXB",
    toCity: "Dubai",
    departure: "2026-11-20T08:30:00",
    arrival: "2026-11-20T12:45:00",
    duration: 255,
    price: 320,
    seats: 42,
  },
  {
    id: "fl2",
    flightNumber: "SK205",
    airline: "SkyBook Air",
    from: "DAC",
    fromCity: "Dhaka",
    to: "BKK",
    toCity: "Bangkok",
    departure: "2026-11-20T14:00:00",
    arrival: "2026-11-20T17:20:00",
    duration: 200,
    price: 185,
    seats: 28,
  },
  {
    id: "fl3",
    flightNumber: "EK583",
    airline: "Emirates",
    from: "DAC",
    fromCity: "Dhaka",
    to: "DXB",
    toCity: "Dubai",
    departure: "2026-11-20T10:15:00",
    arrival: "2026-11-20T14:00:00",
    duration: 225,
    price: 410,
    seats: 15,
  },
  {
    id: "fl4",
    flightNumber: "QR639",
    airline: "Qatar Airways",
    from: "DAC",
    fromCity: "Dhaka",
    to: "DOH",
    toCity: "Doha",
    departure: "2026-11-21T01:40:00",
    arrival: "2026-11-21T04:55:00",
    duration: 195,
    price: 295,
    seats: 33,
  },
];

function FlightsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const { data: flights = DEMO_FLIGHTS, isLoading } = useQuery({
    queryKey: ["flights", from, to],
    queryFn: async () => {
      // In production: return fetch(`/api/flights?from=${from}&to=${to}`).then(r => r.json())
      return DEMO_FLIGHTS.filter((f) => {
        if (from && !f.fromCity.toLowerCase().includes(from.toLowerCase()) && !f.from.toLowerCase().includes(from.toLowerCase())) return false;
        if (to && !f.toCity.toLowerCase().includes(to.toLowerCase()) && !f.to.toLowerCase().includes(to.toLowerCase())) return false;
        return true;
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Flights</h1>
          <p className="text-muted-foreground mt-1">
            {from || to ? `Showing results for ${from || "Any"} → ${to || "Any"}` : "All upcoming flights"}
          </p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Filter airline..." className="w-48" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : flights.length === 0 ? (
        <Card className="p-12 text-center">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No flights found</h3>
          <p className="text-muted-foreground mt-1">Try different dates or destinations</p>
          <Button className="mt-4" asChild>
            <Link href="/">Back to Search</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/60">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6">
                  <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-2xl font-bold">{flight.from}</div>
                      <div className="text-sm text-muted-foreground">{flight.fromCity}</div>
                      <div className="text-sm font-medium mt-1">
                        {new Date(flight.departure).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                      </div>
                      <div className="w-full flex items-center my-1">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="h-4 w-4 text-sky-500 mx-2 rotate-90" />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">{flight.flightNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{flight.to}</div>
                      <div className="text-sm text-muted-foreground">{flight.toCity}</div>
                      <div className="text-sm font-medium mt-1">
                        {new Date(flight.arrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 md:border-l md:pl-6 md:min-w-[160px]">
                    <div className="text-right md:text-center">
                      <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                        {formatCurrency(flight.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">{flight.seats} seats left</div>
                    </div>
                    <Button variant="gradient" asChild>
                      <Link href={`/booking?flightId=${flight.id}`}>
                        Book Now <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="border-t bg-muted/30 px-5 py-2 text-xs text-muted-foreground flex justify-between">
                  <span>{flight.airline}</span>
                  <span>{formatDate(flight.departure)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading flights...</div>}>
      <FlightsContent />
    </Suspense>
  );
}

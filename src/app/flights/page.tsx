"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plane, Clock, ArrowRight, Filter, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

type Flight = {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: string | number;
  seatsAvailable: number;
  airline: { name: string; code: string };
  departureAirport: { code: string; city: string };
  arrivalAirport: { code: string; city: string };
};

async function getFlights(from: string, to: string, date: string): Promise<Flight[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (date) params.set("date", date);
  const response = await fetch(`/api/flights${params.size ? `?${params}` : ""}`);
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null && "error" in result
        ? String(result.error)
        : "Could not load flights.";
    throw new Error(message);
  }
  return result as Flight[];
}

function FlightsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [airlineFilter, setAirlineFilter] = useState("");

  const {
    data: flights = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["flights", from, to, date],
    queryFn: () => getFlights(from, to, date),
  });
  const visibleFlights = flights.filter((flight) =>
    flight.airline.name.toLowerCase().includes(airlineFilter.trim().toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10" data-reveal>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 p-6 text-white shadow-xl sm:p-9" data-enter>
        <div aria-hidden="true" className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[32px] border-white/5" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-sky-200">
              <Plane className="h-4 w-4" /> Your next journey
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find your flight</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              {from || to ? `${from || "Any origin"} → ${to || "Any destination"}` : "Explore available upcoming flights"}
              {date ? ` · ${new Date(`${date}T00:00:00`).toLocaleDateString()}` : ""}
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <label htmlFor="airline-filter" className="mb-1.5 block text-xs font-medium text-sky-100">FILTER BY AIRLINE</label>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="airline-filter"
                placeholder="Search airline"
                value={airlineFilter}
                onChange={(event) => setAirlineFilter(event.target.value)}
                className="h-11 border-white/20 bg-white text-slate-950 pl-10 pr-10 placeholder:text-slate-500"
              />
              {airlineFilter && (
                <button
                  type="button"
                  aria-label="Clear airline filter"
                  onClick={() => setAirlineFilter("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-950"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent role="alert" className="flex items-center gap-3 p-6 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error.message}
          </CardContent>
        </Card>
      ) : flights.length === 0 ? (
        <Card className="p-12 text-center">
          <Plane className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No available flights found</h3>
          <p className="mt-1 text-muted-foreground">Try another route or departure date, or check back later.</p>
          <Button className="mt-4" asChild>
            <Link href="/">Back to search</Link>
          </Button>
        </Card>
      ) : visibleFlights.length === 0 ? (
        <Card className="p-10 text-center">
          <Search className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
          <h3 className="font-semibold">No matching airlines</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a different airline name or clear the filter.</p>
          <Button className="mt-4" variant="outline" onClick={() => setAirlineFilter("")}>Clear filter</Button>
        </Card>
      ) : (
        <div className="space-y-4" data-reveal-stagger>
          <p className="text-sm text-muted-foreground">{visibleFlights.length} flight{visibleFlights.length === 1 ? "" : "s"} available</p>
          {visibleFlights.map((flight) => (
            <Card key={flight.id} data-reveal-item className="overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:p-6">
                  <div className="grid flex-1 grid-cols-3 items-center gap-4">
                    <div>
                      <div className="text-2xl font-bold">{flight.departureAirport.code}</div>
                      <div className="text-sm text-muted-foreground">{flight.departureAirport.city}</div>
                      <div className="mt-1 text-sm font-medium">
                        {new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                      </div>
                      <div className="my-1 flex w-full items-center">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="mx-2 h-4 w-4 rotate-90 text-sky-500" />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">{flight.flightNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{flight.arrivalAirport.code}</div>
                      <div className="text-sm text-muted-foreground">{flight.arrivalAirport.city}</div>
                      <div className="mt-1 text-sm font-medium">
                        {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:min-w-40 md:flex-col md:justify-center md:border-l md:pl-6">
                    <div className="md:text-center">
                      <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                        {formatCurrency(flight.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">{flight.seatsAvailable} seats left</div>
                    </div>
                    <Button variant="gradient" asChild>
                      <Link href={`/booking?flightId=${encodeURIComponent(flight.id)}`}>
                        Book Now <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between border-t bg-muted/30 px-5 py-2 text-xs text-muted-foreground">
                  <span>{flight.airline.name} ({flight.airline.code})</span>
                  <span>{formatDate(flight.departureTime)}</span>
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

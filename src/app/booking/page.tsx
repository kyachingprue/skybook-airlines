"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CalendarDays, Loader2, Plane, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type Flight = {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  seatsAvailable: number;
  airline: { name: string; code: string };
  departureAirport: { code: string; city: string };
  arrivalAirport: { code: string; city: string };
  price: string | number;
};

async function getError(response: Response) {
  const data: unknown = await response.json();
  if (typeof data === "object" && data !== null && "error" in data) {
    return String(data.error);
  }
  return "Could not continue to payment.";
}

function BookingContent() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const paymentResult = searchParams.get("payment");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [flightLoading, setFlightLoading] = useState(true);
  const [flightError, setFlightError] = useState("");
  const [passengerName, setPassengerName] = useState<string | undefined>();
  const [passengerAge, setPassengerAge] = useState("");
  const [passengerGender, setPassengerGender] = useState("");
  const [contactEmail, setContactEmail] = useState<string | undefined>();
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = flightId
        ? `/booking?flightId=${encodeURIComponent(flightId)}`
        : "/booking";
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [status, router, flightId]);

  useEffect(() => {
    if (paymentResult === "cancelled") {
      toast.error("Payment cancelled. No charge was made.");
      router.replace(flightId ? `/booking?flightId=${encodeURIComponent(flightId)}` : "/booking");
    }
  }, [paymentResult, router, flightId]);

  useEffect(() => {
    if (!flightId) {
      return;
    }

    let active = true;
    fetch(`/api/flights/${encodeURIComponent(flightId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await getError(response));
        return (await response.json()) as Flight;
      })
      .then((data) => {
        if (active) setFlight(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setFlightError(cause instanceof Error ? cause.message : "Could not load this flight.");
        }
      })
      .finally(() => {
        if (active) setFlightLoading(false);
      });

    return () => {
      active = false;
    };
  }, [flightId]);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!flight) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: flight.id,
          passengerName: passengerName ?? session?.user?.name ?? "",
          ...(passengerAge ? { passengerAge: Number(passengerAge) } : {}),
          ...(passengerGender ? { passengerGender } : {}),
          contactEmail: contactEmail ?? session?.user?.email ?? "",
          ...(contactPhone ? { contactPhone } : {}),
        }),
      });
      if (!response.ok) throw new Error(await getError(response));
      const result = (await response.json()) as { checkoutUrl?: string };
      if (!result.checkoutUrl) throw new Error("Stripe did not return a checkout link.");
      window.location.assign(result.checkoutUrl);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not continue to payment.";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="container py-20 text-center text-muted-foreground">Loading your booking...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="container py-20 text-center text-muted-foreground">Redirecting to sign in...</div>;
  }

  if (!flightId || flightError || (!flightLoading && !flight)) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Flight unavailable</h1>
        <p role="alert" className="mt-3 text-sm text-muted-foreground">
          {flightError || "Choose an available flight before continuing to checkout."}
        </p>
        <Button className="mt-6" variant="gradient" asChild>
          <Link href="/flights">Browse available flights</Link>
        </Button>
      </div>
    );
  }

  if (flightLoading || !flight) {
    return <div className="container py-20 text-center text-muted-foreground">Loading your booking...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/flights" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to flights
      </Link>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Complete your booking</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Passenger details are used for your ticket and payment confirmation.
      </p>

      <Card className="mt-7" data-reveal>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-sky-500" /> Flight details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-bold">{flight.departureAirport.code}</p>
                <p className="text-sm text-muted-foreground">{flight.departureAirport.city}</p>
              </div>
              <Plane className="h-4 w-4 rotate-90 text-sky-500 sm:rotate-0" />
              <div>
                <p className="text-2xl font-bold">{flight.arrivalAirport.code}</p>
                <p className="text-sm text-muted-foreground">{flight.arrivalAirport.city}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold">{flight.airline.name} · {flight.flightNumber}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:justify-end">
                <CalendarDays className="h-4 w-4" /> {formatDate(flight.departureTime)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {flight.seatsAvailable} seat{flight.seatsAvailable === 1 ? "" : "s"} available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5" data-reveal>
        <CardHeader>
          <CardTitle>Passenger and contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="passenger-name" className="text-sm font-medium">Passenger full name</label>
              <Input
                id="passenger-name"
                placeholder="As shown on travel documents"
                value={passengerName ?? session?.user?.name ?? ""}
                onChange={(event) => setPassengerName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="passenger-age" className="text-sm font-medium">Age (optional)</label>
                <Input
                  id="passenger-age"
                  type="number"
                  min={0}
                  max={120}
                  value={passengerAge}
                  onChange={(event) => setPassengerAge(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="passenger-gender" className="text-sm font-medium">Gender (optional)</label>
                <Input
                  id="passenger-gender"
                  placeholder="Optional"
                  value={passengerGender}
                  onChange={(event) => setPassengerGender(event.target.value)}
                  maxLength={30}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium">Contact email</label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail ?? session?.user?.email ?? ""}
                onChange={(event) => setContactEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-phone" className="text-sm font-medium">Phone (optional)</label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                maxLength={30}
              />
            </div>
            {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

            <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total · 1 passenger</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {formatCurrency(flight.price)}
                </p>
              </div>
              <Button type="submit" variant="gradient" size="lg" disabled={loading} className="w-full sm:w-auto">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Connecting to Stripe...</> : "Continue to secure payment"}
              </Button>
            </div>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-end">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure payment powered by Stripe Checkout
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading booking...</div>}>
      <BookingContent />
    </Suspense>
  );
}

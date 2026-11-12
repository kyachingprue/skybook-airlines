"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Compass,
  Globe2,
  Luggage,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const destinations = [
  {
    city: "Dubai",
    country: "United Arab Emirates",
    airport: "DXB",
    price: "$320",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Dubai skyline at sunset",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    airport: "BKK",
    price: "$185",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bangkok city skyline",
  },
  {
    city: "Doha",
    country: "Qatar",
    airport: "DOH",
    price: "$295",
    image:
      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Doha waterfront and skyline",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find your route",
    description: "Search available flights by city, airport, and departure date.",
  },
  {
    number: "02",
    icon: TicketCheck,
    title: "Choose your flight",
    description: "Compare routes and fares, then enter your passenger details.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Travel with confidence",
    description: "Pay securely and keep your itinerary together in My Bookings.",
  },
];

function getLocalDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function HomePage() {
  const router = useRouter();
  const [from, setFrom] = useState("Dhaka");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    if (date) params.set("date", date);
    router.push(`/flights${params.size ? `?${params.toString()}` : ""}`);
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative isolate min-h-[610px] overflow-hidden bg-slate-950 text-white sm:min-h-[660px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-[center_55%]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=90')",
          }}
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20" />
        <div aria-hidden="true" className="absolute -right-20 top-24 -z-10 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]" />

        <div className="container mx-auto grid min-h-[610px] items-center gap-8 px-4 pb-20 pt-16 sm:min-h-[660px] sm:pb-24 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
          <div className="max-w-3xl" data-enter>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-sky-100 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300" />
              A clearer way to travel
            </div>
            <h1 className="max-w-3xl text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              There&apos;s a whole
              <br className="hidden sm:block" /> world{" "}
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                waiting.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              Find a flight that fits your plans. Compare available routes, book
              securely, and keep every trip in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="h-12 bg-white px-6 text-slate-950 hover:bg-sky-50" asChild>
                <Link href="/flights">
                  Explore flights <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                How SkyBook works <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              {["Secure checkout", "Clear fares", "Trips in one place"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[360px] items-center justify-center md:flex" data-enter>
            <div className="absolute right-8 top-8 h-64 w-64 rounded-full border border-white/15" />
            <div className="absolute right-16 top-16 h-48 w-48 rounded-full border border-white/10" />
            <div className="relative w-full max-w-sm rounded-[2rem] border border-white/20 bg-slate-950/35 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-sky-100">Make room for</p>
                  <p className="mt-1 text-2xl font-semibold">somewhere new.</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300 text-slate-950">
                  <Compass className="h-5 w-5" />
                </span>
              </div>
              <div className="my-7 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300 ring-4 ring-sky-300/15" />
                <span className="h-px flex-1 border-t border-dashed border-white/40" />
                <Plane className="h-5 w-5 rotate-90 text-sky-200" />
                <span className="h-px flex-1 border-t border-dashed border-white/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-white ring-4 ring-white/15" />
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
                <div>
                  <p className="text-xs text-slate-300">Search</p>
                  <p className="mt-1 text-sm font-medium">Your route</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Choose</p>
                  <p className="mt-1 text-sm font-medium">Your flight</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Go</p>
                  <p className="mt-1 text-sm font-medium">Your way</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-sky-100">
                <CircleCheck className="h-4 w-4 text-emerald-300" />
                Every trip, together in one place
              </div>
            </div>
            <div className="absolute -bottom-2 left-0 flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 shadow-xl backdrop-blur-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Book with confidence</span>
                <span className="mt-0.5 block text-xs text-slate-300">Secure, clear checkout</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 container mx-auto -mt-14 px-4 sm:-mt-16" data-enter>
        <form
          onSubmit={handleSearch}
          className="rounded-3xl border border-border/70 bg-card p-4 text-card-foreground shadow-[0_28px_90px_-32px_rgba(15,23,42,0.42)] sm:p-6 lg:p-7"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Find your next flight</p>
              <p className="mt-1 text-sm text-muted-foreground">Where would you like to go?</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
              <Plane className="h-3.5 w-3.5" /> Flight search
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end">
            <div className="min-w-0">
              <label htmlFor="flight-from" className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground">
                FROM
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
                <Input
                  id="flight-from"
                  list="airport-suggestions"
                  placeholder="City or airport"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Swap departure and destination"
              onClick={swapLocations}
              className="hidden rounded-full md:inline-flex"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <label htmlFor="flight-to" className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground">
                TO
              </label>
              <div className="relative">
                <Plane className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600" />
                <Input
                  id="flight-to"
                  list="airport-suggestions"
                  placeholder="Where to?"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label htmlFor="flight-date" className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground">
                DEPARTURE
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="flight-date"
                  type="date"
                  min={getLocalDate()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <Button type="submit" variant="gradient" size="lg" className="h-12 w-full md:w-auto">
              <Search className="h-4 w-4" /> Search flights
            </Button>
          </div>
          <datalist id="airport-suggestions">
            <option value="Dhaka" />
            <option value="Dubai" />
            <option value="Bangkok" />
            <option value="Doha" />
            <option value="DAC" />
            <option value="DXB" />
            <option value="BKK" />
            <option value="DOH" />
          </datalist>
        </form>
      </div>

      <section className="container mx-auto px-4 pb-8 pt-12 sm:pt-16" data-reveal>
        <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:grid-cols-3 sm:p-7" data-reveal-stagger>
          {[
            { icon: Globe2, title: "Explore new places", detail: "Browse routes from one simple search" },
            { icon: BadgeCheck, title: "Book with clarity", detail: "See the fare before you check out" },
            { icon: Luggage, title: "Keep plans together", detail: "Find your trips in your account" },
          ].map((item, index) => (
            <div
              key={item.title}
              data-reveal-item
              className={`flex items-center gap-4 ${index > 0 ? "sm:border-l sm:pl-6" : ""}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20" data-reveal>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              A little inspiration
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where could you go next?
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore popular destinations and see which flights are available for your dates.
            </p>
          </div>
          <Button variant="outline" asChild className="w-fit">
            <Link href="/flights">Explore all flights <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3" data-reveal-stagger>
          {destinations.map((destination) => (
            <Link
              key={destination.airport}
              data-reveal-item
              href={`/flights?${new URLSearchParams({ from: "Dhaka", to: destination.city })}`}
              className="group relative isolate min-h-[330px] overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
              aria-label={`View flights from Dhaka to ${destination.city}`}
            >
              <div
                role="img"
                aria-label={destination.imageAlt}
                className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${destination.image}')` }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/5 transition group-hover:via-slate-950/50" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-sky-300" /> {destination.airport}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm text-slate-200">From Dhaka · {destination.country}</p>
                <div className="mt-1 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold">{destination.city}</h3>
                    <p className="mt-2 text-sm text-slate-200">
                      Example fare <span className="font-semibold text-white">{destination.price}</span>
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition duration-300 group-hover:rotate-45 group-hover:bg-sky-300">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Example fares are for inspiration; current prices and availability appear in flight search.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-muted/40 py-16 md:py-20" data-reveal>
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Simple from takeoff
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three steps to your next trip
            </h2>
            <p className="mt-3 text-muted-foreground">
              A straightforward booking flow, with the important details kept together.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3" data-reveal-stagger>
            {steps.map((step) => (
              <article
                key={step.number}
                data-reveal-item
                className="relative rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 text-sky-700 dark:text-sky-300">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm font-semibold text-muted-foreground">{step.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20" data-reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl md:p-12">
          <div aria-hidden="true" className="absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-sky-100">
                <ShieldCheck className="h-4 w-4" /> Ready when you are
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Your next destination is just a search away.
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-sky-100">
                Explore available routes, book securely, and manage your itinerary in SkyBook.
              </p>
            </div>
            <Button size="lg" className="w-fit bg-white text-sky-800 hover:bg-sky-50" asChild>
              <Link href="/flights">Find a flight <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-sm text-sky-100">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Secure Stripe checkout</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Booking details in your account</span>
          </div>
        </div>
      </section>
    </div>
  );
}

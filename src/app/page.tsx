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
  Clock3,
  Globe2,
  Headphones,
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

const benefits = [
  {
    icon: BadgeCheck,
    title: "Clear, upfront fares",
    description: "See your fare before you book, with no surprise checkout fees.",
  },
  {
    icon: ShieldCheck,
    title: "A safer way to book",
    description: "Your account and booking details are protected at every step.",
  },
  {
    icon: Headphones,
    title: "Help when you need it",
    description: "Find your trip and get support from one convenient place.",
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
      <section className="relative isolate min-h-[690px] overflow-hidden bg-slate-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=90')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

        <div className="container mx-auto px-4 pb-28 pt-20 md:pb-36 md:pt-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-sky-100 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300" />
              A better way to get there
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              The world is
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                closer than ever.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Find a flight that fits your plans. Compare popular routes, book
              with confidence, and keep every trip in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-300" /> Easy flight search
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-300" /> Secure booking
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-300" /> Simple trip management
              </span>
            </div>
          </div>
        </div>

        <div className="container absolute inset-x-0 bottom-0 mx-auto translate-y-1/2 px-4">
          <form
            onSubmit={handleSearch}
            className="rounded-3xl border border-white/70 bg-background p-4 text-foreground shadow-[0_24px_80px_-24px_rgba(2,8,23,0.55)] sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Find your next flight</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Search the routes available on SkyBook
                </p>
              </div>
              <span className="hidden items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300 sm:inline-flex">
                <Plane className="h-3.5 w-3.5" /> One way
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end">
              <div className="min-w-0">
                <label htmlFor="flight-from" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                <label htmlFor="flight-to" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                <label htmlFor="flight-date" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                <Search className="h-4 w-4" />
                Search flights
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
      </section>

      <section className="container mx-auto px-4 pb-8 pt-44 sm:pt-40">
        <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:grid-cols-3 sm:p-7">
          {[
            { icon: Globe2, title: "Popular destinations", detail: "Explore routes from Dhaka" },
            { icon: TicketCheck, title: "Easy booking", detail: "A clear, simple checkout" },
            { icon: Luggage, title: "Trips in one place", detail: "Manage your travel with ease" },
          ].map((item, index) => (
            <div
              key={item.title}
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

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Make it a getaway
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Popular routes from Dhaka
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A few ideas for where to go next. Choose a destination to see
              matching flights.
            </p>
          </div>
          <Button variant="outline" asChild className="w-fit">
            <Link href="/flights">
              Explore all flights <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.airport}
              href={`/flights?${new URLSearchParams({ from: "Dhaka", to: destination.city })}`}
              className="group relative isolate min-h-[340px] overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
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
                      Fares from <span className="font-semibold text-white">{destination.price}</span>
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
          Displayed fares are examples from the currently listed flights and may
          change.
        </p>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Travel, made simpler
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              More than a ticket
            </h2>
            <p className="mt-3 text-muted-foreground">
              The essentials for a smoother journey, from your first search to
              your next adventure.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="group rounded-3xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 text-sky-700 transition duration-300 group-hover:scale-110 group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:text-white dark:text-sky-300">
                  <benefit.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 rounded-[2rem] bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-sky-100">
              <Clock3 className="h-4 w-4" /> Your next trip starts here
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick a place. We&apos;ll help you get there.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-sky-100">
              Browse available flights or create an account to keep your travel
              plans together.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button size="lg" className="bg-white text-sky-800 hover:bg-sky-50" asChild>
              <Link href="/flights">
                Browse flights <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              asChild
            >
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  CreditCard,
  Plane,
  ShieldCheck,
  Smartphone,
  TicketCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const principles = [
  {
    icon: Compass,
    title: "Keep it easy to navigate",
    description:
      "Search routes, review your flight details, and follow a clear booking flow from any device.",
  },
  {
    icon: ShieldCheck,
    title: "Make the important parts clear",
    description:
      "Review the fare and passenger information before continuing to secure Stripe Checkout.",
  },
  {
    icon: TicketCheck,
    title: "Keep every trip close",
    description:
      "Find your confirmed bookings and itinerary details in your personal dashboard.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/25 via-slate-950 to-slate-950" />
        <div aria-hidden="true" className="absolute -bottom-36 -right-10 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div className="container mx-auto grid gap-10 px-4 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-28">
          <div className="max-w-3xl" data-enter>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-sky-100">
              <Plane className="h-4 w-4 text-sky-300" /> About SkyBook
            </p>
            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Good trips start with{" "}
              <span className="text-sky-300">a little more clarity.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              SkyBook is an online flight-booking experience built to make
              discovering a route, completing a booking, and managing a trip
              feel straightforward.
            </p>
          </div>
          <div className="hidden h-36 w-36 items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 text-sky-200 shadow-2xl backdrop-blur md:flex">
            <Plane className="h-14 w-14 -rotate-12" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-20" data-reveal>
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            What matters to us
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed around the way people travel.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3" data-reveal-stagger>
          {principles.map((item, index) => (
            <article
              key={item.title}
              data-reveal-item
              className="rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20" data-reveal>
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3" data-reveal-stagger>
            {[
              { icon: Smartphone, title: "Works across devices", detail: "Responsive pages for phone, tablet, and desktop." },
              { icon: CreditCard, title: "Secure payment flow", detail: "Stripe Checkout verifies payment before confirming tickets." },
              { icon: TicketCheck, title: "Your booking, together", detail: "See booking references and itinerary details in your account." },
            ].map((item) => (
              <div key={item.title} data-reveal-item className="flex gap-4 rounded-2xl border bg-card p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <h2 className="text-2xl font-semibold">Let&apos;s find your next flight.</h2>
              <p className="mt-2 text-sm text-sky-100">Browse upcoming routes and start planning.</p>
            </div>
            <Button className="w-fit bg-white text-sky-800 hover:bg-sky-50" asChild>
              <Link href="/flights">Explore flights <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  Headphones,
  Luggage,
  MapPinned,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: MapPinned,
    number: "01",
    title: "Flight discovery",
    description:
      "Search routes by city or airport, compare upcoming flights, and see availability before you choose.",
    detail: "Useful route and date filters",
  },
  {
    icon: TicketCheck,
    number: "02",
    title: "Straightforward booking",
    description:
      "Add passenger and contact details once, then review the selected itinerary before payment.",
    detail: "Clear booking details",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Secure online payment",
    description:
      "Complete your purchase with Stripe Checkout. Your ticket is confirmed after payment is verified.",
    detail: "Secure Stripe Checkout",
  },
  {
    icon: Luggage,
    number: "04",
    title: "Trip management",
    description:
      "Return to your traveler dashboard to find your booking reference, route, departure time, and fare.",
    detail: "Your bookings in one place",
  },
  {
    icon: UserRound,
    number: "05",
    title: "Personal account",
    description:
      "Update your name, phone number, and profile photo to keep your traveler details current.",
    detail: "A profile that stays yours",
  },
  {
    icon: Headphones,
    number: "06",
    title: "Helpful support",
    description:
      "Need help with a booking or account? Send the SkyBook team a message and include your booking reference.",
    detail: "Support for your journey",
  },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/30 via-slate-950 to-slate-950" />
        <div aria-hidden="true" className="absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -right-16 top-36 -z-10 h-64 w-64 rounded-full border border-white/10" />
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl" data-enter>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-sky-100">
              <BadgeCheck className="h-4 w-4 text-sky-300" /> SkyBook services
            </p>
            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Every step of your journey,{" "}
              <span className="text-sky-300">a little simpler.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              From comparing flights to finding your confirmed ticket, SkyBook
              brings the essentials of booking and trip management together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-sky-50" asChild>
                <Link href="/flights">Explore flights <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/contact">Talk to our team</Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-3" data-reveal-stagger>
            {[
              { icon: MapPinned, label: "Search", value: "Find available routes" },
              { icon: ShieldCheck, label: "Book", value: "Pay securely online" },
              { icon: Luggage, label: "Manage", value: "Keep trips close at hand" },
            ].map((item) => (
              <div key={item.label} data-reveal-item className="flex items-center gap-3 py-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-200">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-slate-400">{item.label}</span>
                  <span className="mt-0.5 block text-sm font-medium">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-20" data-reveal>
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            Built around your trip
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The tools you need, from search to takeoff.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            A connected booking experience, designed to make each next step easy to find.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-reveal-stagger>
          {services.map((service) => (
            <article
              key={service.number}
              data-reveal-item
              className="group rounded-3xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white dark:text-sky-300 dark:group-hover:text-white">
                  <service.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">{service.number}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 min-h-20 text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t pt-4 text-xs font-medium text-sky-700 dark:text-sky-300">
                <BadgeCheck className="h-4 w-4" /> {service.detail}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20" data-reveal>
        <div className="container mx-auto grid items-center gap-8 px-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Your next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to make a plan?
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Search upcoming routes and find a flight that fits your trip.
            </p>
          </div>
          <Button size="lg" variant="gradient" asChild>
            <Link href="/flights">Search available flights <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

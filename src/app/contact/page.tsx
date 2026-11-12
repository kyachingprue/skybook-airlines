"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MessageCircle,
  Plane,
  Send,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@skybook.com";

const helpTopics = [
  {
    icon: TicketCheck,
    title: "Existing booking",
    description: "Include your booking reference so we can find your itinerary faster.",
  },
  {
    icon: ShieldCheck,
    title: "Payment question",
    description: "Never send your full card number or security code in a message.",
  },
  {
    icon: MessageCircle,
    title: "General question",
    description: "Tell us what you need and we’ll point you in the right direction.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Booking support");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`SkyBook support: ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name}\nReply-to: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    toast("Your email app will open with this message ready to send.");
  };

  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/25 via-slate-950 to-slate-950" />
        <div aria-hidden="true" className="absolute -bottom-48 right-0 -z-10 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl" data-enter>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-sky-100">
              <MessageCircle className="h-4 w-4 text-sky-300" /> We’re here to help
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              Let&apos;s get you{" "}
              <span className="text-sky-300">on your way.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Questions about a flight, a payment, or your account? Send us a
              note and our team will be ready to help.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5" data-reveal>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-xl">
              <CardContent className="p-6 sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Mail className="h-5 w-5" />
                </span>
                <p className="mt-5 text-sm text-sky-100">Email support</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-1 inline-flex items-center gap-2 break-all text-lg font-semibold hover:underline"
                >
                  {contactEmail} <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
                <p className="mt-3 text-sm leading-6 text-sky-100">
                  The contact form opens your email app with the message prepared.
                </p>
              </CardContent>
            </Card>

            <div className="rounded-3xl border bg-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                  <Clock3 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold">A quicker answer</h2>
                  <p className="text-sm text-muted-foreground">Add the details that help us understand.</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {helpTopics.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" />
                    <span>
                      <span className="block text-sm font-medium">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border bg-muted/40 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <Plane className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold">Looking for a flight?</h2>
                  <p className="text-sm text-muted-foreground">Browse current routes and availability.</p>
                </div>
              </div>
              <Button variant="link" className="mt-2 h-auto px-0" asChild>
                <Link href="/flights">Go to flight search <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/70 shadow-lg" data-reveal>
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Send a message</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">How can we help?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We’ll prepare an email with your details so you can review it and send it.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-medium">Your name</label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email-address" className="text-sm font-medium">Email address</label>
                    <Input
                      id="contact-email-address"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-topic" className="text-sm font-medium">Topic</label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Booking support</option>
                    <option>Payment question</option>
                    <option>Account help</option>
                    <option>General question</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={6}
                    required
                    maxLength={3000}
                    placeholder="Tell us a little about how we can help..."
                    className="flex w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full sm:w-auto">
                  <Send className="h-4 w-4" /> Prepare email
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                  Your message isn&apos;t sent automatically. Your email app will open so you can review and send it.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

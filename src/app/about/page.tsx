import { Plane, Code2, Shield, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
          <Plane className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold">About SkyBook</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A modern full-stack airplane ticket booking platform built with the latest web technologies.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[
          {
            icon: Code2,
            title: "Modern Stack",
            desc: "Next.js 16, TypeScript, Tailwind, Prisma, Redux Toolkit, TanStack Query, NextAuth.",
          },
          {
            icon: Shield,
            title: "Secure by Design",
            desc: "JWT sessions, role-based access control, bcrypt password hashing, Google OAuth.",
          },
          {
            icon: Smartphone,
            title: "Fully Responsive",
            desc: "Beautiful UI that works perfectly on smartphones, tablets, and large desktops.",
          },
          {
            icon: Plane,
            title: "Complete Booking Flow",
            desc: "Search → Select → Passenger details → Confirm → Email notification via Brevo.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="pt-6">
              <item.icon className="h-8 w-8 text-sky-500 mb-3" />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

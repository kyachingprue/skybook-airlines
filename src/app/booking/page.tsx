"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plane, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

function BookingContent() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/booking?flightId=${flightId}`);
    }
  }, [status, router, flightId]);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call + Brevo email
    await new Promise((r) => setTimeout(r, 1500));
    setRef("SK" + Math.random().toString(36).substring(2, 8).toUpperCase());
    setConfirmed(true);
    setLoading(false);
  };

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (confirmed) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Confirmation email has been sent. Your reference is:
        </p>
        <div className="mt-6 rounded-2xl border-2 border-dashed border-sky-500 bg-sky-50 dark:bg-sky-950/40 p-6">
          <div className="text-sm text-muted-foreground">Booking Reference</div>
          <div className="text-3xl font-mono font-bold tracking-widest text-sky-600 dark:text-sky-400 mt-1">
            {ref}
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" asChild>
            <Link href="/dashboard/user">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/flights">Book Another</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
      <p className="text-muted-foreground mb-8">
        Flight ID: <span className="font-mono">{flightId || "N/A"}</span>
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-sky-500" />
            Passenger & Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Passenger Full Name</label>
            <Input placeholder="As on passport" className="mt-1.5" defaultValue={session?.user?.name || ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input type="number" placeholder="25" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <Input placeholder="Male / Female / Other" className="mt-1.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <Input type="email" className="mt-1.5" defaultValue={session?.user?.email || ""} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input type="tel" placeholder="+880 1XXX-XXXXXX" className="mt-1.5" />
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold text-sky-600">$320.00</div>
            </div>
            <Button variant="gradient" size="lg" onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Confirm & Pay"
              )}
            </Button>
          </div>
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

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    let active = true;
    fetch("/api/bookings/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof result === "object" && result !== null && "error" in result
              ? String(result.error)
              : "We could not verify your payment.";
          throw new Error(message);
        }
      })
      .then(() => {
        if (!active) return;
        toast.success("Payment successful! Your ticket is in My Bookings.");
        router.replace("/dashboard/user/bookings");
      })
      .catch((cause: unknown) => {
        if (!active) return;
        const message = cause instanceof Error ? cause.message : "We could not verify your payment.";
        setError(message);
        toast.error(message);
      });

    return () => {
      active = false;
    };
  }, [sessionId, router]);

  const displayedError = error || (!sessionId ? "The payment confirmation link is missing its Stripe session ID." : "");
  if (displayedError) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center" data-enter>
        <h1 className="text-2xl font-bold">Payment confirmation needed</h1>
        <p role="alert" className="mt-3 text-sm text-muted-foreground">{displayedError}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          If your card was charged, your booking will appear after Stripe confirms the payment.
        </p>
        <Button className="mt-6" variant="gradient" asChild>
          <Link href="/dashboard/user/bookings">Go to My Bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center" data-enter>
      {sessionId ? (
        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
      ) : (
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      )}
      <h1 className="mt-5 text-2xl font-bold">Verifying your payment</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we confirm your ticket with Stripe.
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Verifying payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

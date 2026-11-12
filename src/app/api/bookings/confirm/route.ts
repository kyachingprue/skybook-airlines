import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { confirmStripeBooking } from "@/lib/payment-bookings";

const confirmationSchema = z.object({ sessionId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to confirm your booking." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = confirmationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A Stripe checkout session ID is required." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const checkout = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
    if (checkout.metadata?.userId !== userId || checkout.payment_status !== "paid") {
      return NextResponse.json({ error: "This payment could not be verified as complete." }, { status: 403 });
    }

    const booking = await confirmStripeBooking(checkout);
    if (booking.userId !== userId) {
      return NextResponse.json({ error: "This booking does not belong to your account." }, { status: 403 });
    }
    return NextResponse.json({ bookingId: booking.id, bookingRef: booking.bookingRef });
  } catch (error) {
    console.error("Could not verify Stripe payment.", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not verify this payment." },
      { status: 502 }
    );
  }
}

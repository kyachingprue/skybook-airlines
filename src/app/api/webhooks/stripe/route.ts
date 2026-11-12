import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { confirmStripeBooking, releaseStripeBooking } from "@/lib/payment-bookings";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed.", error);
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    if (
      (event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded") &&
      event.data.object.payment_status === "paid"
    ) {
      await confirmStripeBooking(event.data.object);
    } else if (event.type === "checkout.session.expired") {
      const checkout = event.data.object;
      const bookingId = checkout.metadata?.bookingId;
      if (bookingId) await releaseStripeBooking(bookingId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook event could not be processed.", error);
    return NextResponse.json({ error: "Stripe event processing failed." }, { status: 500 });
  }
}

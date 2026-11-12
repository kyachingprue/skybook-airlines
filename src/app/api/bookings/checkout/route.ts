import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateBookingRef } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";
import { releaseStripeBooking } from "@/lib/payment-bookings";

const checkoutSchema = z.object({
  flightId: z.string().min(1),
  passengerName: z.string().trim().min(2).max(100),
  passengerAge: z.number().int().min(0).max(120).optional(),
  passengerGender: z.string().trim().max(30).optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().trim().max(30).optional(),
});

class InventoryChangedError extends Error {}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in before booking a flight." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Booking details are invalid." },
      { status: 400 }
    );
  }

  const flight = await prisma.flight.findFirst({
    where: {
      id: parsed.data.flightId,
      status: "SCHEDULED",
      departureTime: { gt: new Date() },
      seatsAvailable: { gt: 0 },
    },
    select: {
      id: true,
      flightNumber: true,
      seatsAvailable: true,
      airline: { select: { code: true } },
      departureAirport: { select: { code: true } },
      arrivalAirport: { select: { code: true } },
      seats: {
        where: { isAvailable: true },
        orderBy: { price: "asc" },
        take: 1,
        select: { id: true, seatNumber: true, price: true },
      },
    },
  });

  const seat = flight?.seats[0];
  if (!flight || !seat) {
    return NextResponse.json({ error: "This flight has no available seats." }, { status: 409 });
  }

  const priceInCents = Math.round(Number(seat.price) * 100);
  if (!Number.isSafeInteger(priceInCents) || priceInCents < 50) {
    return NextResponse.json({ error: "This flight has an invalid payment amount." }, { status: 400 });
  }

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe is not configured." },
      { status: 503 }
    );
  }

  let booking: { id: string; bookingRef: string };
  try {
    booking = await prisma.$transaction(async (transaction) => {
      const reservedSeat = await transaction.seat.updateMany({
        where: { id: seat.id, flightId: flight.id, isAvailable: true },
        data: { isAvailable: false },
      });
      if (reservedSeat.count !== 1) throw new InventoryChangedError();

      const updatedFlight = await transaction.flight.updateMany({
        where: { id: flight.id, seatsAvailable: { gt: 0 } },
        data: { seatsAvailable: { decrement: 1 } },
      });
      if (updatedFlight.count !== 1) throw new InventoryChangedError();

      return transaction.booking.create({
        data: {
          bookingRef: generateBookingRef(),
          userId,
          flightId: flight.id,
          totalAmount: seat.price,
          passengersCount: 1,
          contactEmail: parsed.data.contactEmail,
          contactPhone: parsed.data.contactPhone || null,
          items: {
            create: {
              seatId: seat.id,
              passengerName: parsed.data.passengerName,
              passengerAge: parsed.data.passengerAge,
              passengerGender: parsed.data.passengerGender || null,
              price: seat.price,
            },
          },
        },
        select: { id: true, bookingRef: true },
      });
    });
  } catch (error) {
    if (error instanceof InventoryChangedError) {
      return NextResponse.json(
        { error: "That seat was just booked. Refresh the flight list and choose another flight." },
        { status: 409 }
      );
    }
    console.error("Could not reserve a flight seat for checkout.", error);
    return NextResponse.json({ error: "Could not reserve this flight. Please try again." }, { status: 500 });
  }

  let checkoutSessionId: string | null = null;
  try {
    const origin = process.env.NEXTAUTH_URL
      ? new URL(process.env.NEXTAUTH_URL).origin
      : new URL(request.url).origin;
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.contactEmail,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceInCents,
            product_data: {
              name: `${flight.airline.code} ${flight.flightNumber}: ${flight.departureAirport.code} to ${flight.arrivalAirport.code}`,
              description: `Seat ${seat.seatNumber} for ${parsed.data.passengerName}`,
            },
          },
        },
      ],
      metadata: { bookingId: booking.id, userId },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?flightId=${encodeURIComponent(flight.id)}&payment=cancelled`,
    });
    checkoutSessionId = checkout.id;
    if (!checkout.url) throw new Error("Stripe did not return a checkout URL.");

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: checkout.id },
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error("Could not create Stripe Checkout session.", error);

    if (checkoutSessionId) {
      try {
        await stripe.checkout.sessions.expire(checkoutSessionId);
      } catch (expireError) {
        console.error("Could not expire the unused Stripe Checkout session.", expireError);
      }
    }
    try {
      await releaseStripeBooking(booking.id);
    } catch (releaseError) {
      console.error("Could not release the reserved seat after checkout setup failed.", releaseError);
      return NextResponse.json(
        { error: "Payment setup failed and the seat reservation could not be released. Please contact support before retrying." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Could not start payment. Your seat reservation has been released; please try again." },
      { status: 502 }
    );
  }
}

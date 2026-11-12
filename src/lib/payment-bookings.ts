import type Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function confirmStripeBooking(checkoutSession: Stripe.Checkout.Session) {
  const bookingId = checkoutSession.metadata?.bookingId;
  const userId = checkoutSession.metadata?.userId;
  if (!bookingId || !userId || checkoutSession.payment_status !== "paid") {
    throw new Error("The Stripe checkout session is missing booking details or is not paid.");
  }

  return prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== userId) {
      throw new Error("The booking associated with this payment was not found.");
    }
    if (booking.stripeSessionId && booking.stripeSessionId !== checkoutSession.id) {
      throw new Error("The payment session does not match this booking.");
    }
    if (booking.status === "CANCELLED") {
      throw new Error("This booking was cancelled and cannot be confirmed.");
    }

    if (booking.status === "PENDING") {
      await transaction.booking.updateMany({
        where: { id: booking.id, status: "PENDING" },
        data: {
          status: "CONFIRMED",
          stripeSessionId: checkoutSession.id,
          notes: null,
        },
      });
    }

    const confirmedBooking = await transaction.booking.findUnique({
      where: { id: booking.id },
      select: { id: true, bookingRef: true, status: true, userId: true },
    });
    if (!confirmedBooking || confirmedBooking.status !== "CONFIRMED") {
      throw new Error("The booking could not be confirmed.");
    }

    return confirmedBooking;
  });
}

export async function releaseStripeBooking(bookingId: string) {
  return prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.findUnique({
      where: { id: bookingId },
      include: { items: { select: { seatId: true } } },
    });
    if (!booking || booking.status !== "PENDING") return false;

    const cancelled = await transaction.booking.updateMany({
      where: { id: booking.id, status: "PENDING" },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: "Stripe checkout expired or could not be initialized.",
      },
    });
    if (cancelled.count === 0) return false;

    for (const item of booking.items) {
      const released = await transaction.seat.updateMany({
        where: { id: item.seatId, isAvailable: false },
        data: { isAvailable: true },
      });
      if (released.count > 0) {
        await transaction.flight.update({
          where: { id: booking.flightId },
          data: { seatsAvailable: { increment: 1 } },
        });
      }
    }
    return true;
  });
}

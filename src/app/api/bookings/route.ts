import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to view bookings." }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      bookingRef: true,
      status: true,
      totalAmount: true,
      passengersCount: true,
      createdAt: true,
      flight: {
        select: {
          flightNumber: true,
          departureTime: true,
          arrivalTime: true,
          airline: { select: { name: true, code: true } },
          departureAirport: { select: { code: true, city: true } },
          arrivalAirport: { select: { code: true, city: true } },
        },
      },
    },
  });

  return NextResponse.json(bookings);
}

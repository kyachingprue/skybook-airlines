import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const flight = await prisma.flight.findFirst({
    where: {
      id,
      status: "SCHEDULED",
      departureTime: { gt: new Date() },
      seatsAvailable: { gt: 0 },
      seats: { some: { isAvailable: true } },
    },
    select: {
      id: true,
      flightNumber: true,
      departureTime: true,
      arrivalTime: true,
      duration: true,
      seatsAvailable: true,
      airline: { select: { name: true, code: true } },
      departureAirport: { select: { code: true, city: true } },
      arrivalAirport: { select: { code: true, city: true } },
      seats: {
        where: { isAvailable: true },
        orderBy: { price: "asc" },
        take: 1,
        select: { price: true },
      },
    },
  });

  if (!flight || !flight.seats[0]) {
    return NextResponse.json({ error: "This flight is no longer available." }, { status: 404 });
  }

  return NextResponse.json({
    id: flight.id,
    flightNumber: flight.flightNumber,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: flight.duration,
    seatsAvailable: flight.seatsAvailable,
    airline: flight.airline,
    departureAirport: flight.departureAirport,
    arrivalAirport: flight.arrivalAirport,
    price: flight.seats[0].price,
  });
}

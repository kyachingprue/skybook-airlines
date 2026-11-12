import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = params.get("from")?.trim();
  const to = params.get("to")?.trim();
  const date = params.get("date");

  let dateFilter: { gte: Date; lt: Date } | undefined;
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(start.getTime()) ||
      start.toISOString().slice(0, 10) !== date
    ) {
      return NextResponse.json({ error: "Departure date must use YYYY-MM-DD format." }, { status: 400 });
    }
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    dateFilter = { gte: start, lt: end };
  }

  const where: Prisma.FlightWhereInput = {
    status: "SCHEDULED",
    departureTime: { gt: new Date(), ...(dateFilter ?? {}) },
    seatsAvailable: { gt: 0 },
    seats: { some: { isAvailable: true } },
    ...(from
      ? {
          departureAirport: {
            OR: [
              { city: { contains: from, mode: "insensitive" } },
              { code: { contains: from, mode: "insensitive" } },
            ],
          },
        }
      : {}),
    ...(to
      ? {
          arrivalAirport: {
            OR: [
              { city: { contains: to, mode: "insensitive" } },
              { code: { contains: to, mode: "insensitive" } },
            ],
          },
        }
      : {}),
  };

  const flights = await prisma.flight.findMany({
    where,
    orderBy: { departureTime: "asc" },
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

  return NextResponse.json(
    flights.map((flight) => ({
      ...flight,
      price: flight.seats[0]?.price ?? 0,
      seats: undefined,
    }))
  );
}

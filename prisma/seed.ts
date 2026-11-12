import { PrismaClient, Role, SeatClass } from "@prisma/client";

const prisma = new PrismaClient();

const airports = [
  { code: "DAC", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
];

const flightSchedule = [
  { number: "DEMO101", from: "DAC", to: "DXB", daysAhead: 7, hour: 8, duration: 255, price: 320 },
  { number: "DEMO205", from: "DAC", to: "BKK", daysAhead: 8, hour: 14, duration: 200, price: 185 },
  { number: "DEMO583", from: "DAC", to: "DXB", daysAhead: 9, hour: 10, duration: 225, price: 410 },
  { number: "DEMO639", from: "DAC", to: "DOH", daysAhead: 10, hour: 1, duration: 195, price: 295 },
];

const demoAirline = { code: "DEMO", name: "SkyBook Demo Air" };

function futureDeparture(daysAhead: number, hour: number) {
  const date = new Date();
  date.setUTCHours(hour, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysAhead);
  return date;
}

async function seed() {
  const airportIds = new Map<string, string>();
  for (const airport of airports) {
    const record = await prisma.airport.upsert({
      where: { code: airport.code },
      update: airport,
      create: airport,
    });
    airportIds.set(airport.code, record.id);
  }

  const user = await prisma.user.upsert({
    where: { email: "seed-demo@skybook.local" },
    update: { name: "SkyBook Demo Account", role: Role.AIRLINE },
    create: {
      email: "seed-demo@skybook.local",
      name: "SkyBook Demo Account",
      role: Role.AIRLINE,
    },
  });
  const airline =
    (await prisma.airline.findUnique({ where: { code: demoAirline.code } })) ??
    (await prisma.airline.create({
      data: { ...demoAirline, userId: user.id },
    }));

  for (const scheduled of flightSchedule) {
    const departureAirportId = airportIds.get(scheduled.from);
    const arrivalAirportId = airportIds.get(scheduled.to);
    if (!departureAirportId || !arrivalAirportId) {
      throw new Error(`Missing seeded airport for ${scheduled.from} to ${scheduled.to}.`);
    }

    const existing = await prisma.flight.findFirst({
      where: {
        airlineId: airline.id,
        flightNumber: scheduled.number,
        departureTime: { gt: new Date() },
      },
      orderBy: { departureTime: "asc" },
    });
    const departureTime = existing?.departureTime ?? futureDeparture(scheduled.daysAhead, scheduled.hour);
    const flight =
      existing ??
      (await prisma.flight.create({
        data: {
          flightNumber: scheduled.number,
          airlineId: airline.id,
          departureAirportId,
          arrivalAirportId,
          departureTime,
          arrivalTime: new Date(departureTime.getTime() + scheduled.duration * 60_000),
          duration: scheduled.duration,
          basePrice: scheduled.price,
          seatsTotal: 24,
          seatsAvailable: 0,
        },
      }));

    const seats = Array.from({ length: 24 }, (_, index) => {
      const row = Math.floor(index / 4) + 1;
      const letter = String.fromCharCode(65 + (index % 4));
      return {
        flightId: flight.id,
        seatNumber: `${row}${letter}`,
        seatClass: SeatClass.ECONOMY,
        price: scheduled.price,
      };
    });
    const createdSeats = await prisma.seat.createMany({ data: seats, skipDuplicates: true });
    if (createdSeats.count > 0) {
      await prisma.flight.update({
        where: { id: flight.id },
        data: { seatsAvailable: { increment: createdSeats.count } },
      });
    }
  }
}

seed()
  .then(() => console.log("Demo airports, flights, and seats are ready."))
  .catch((error: unknown) => {
    console.error("Could not seed demo flight inventory.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

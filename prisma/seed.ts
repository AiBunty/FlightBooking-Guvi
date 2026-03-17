import bcrypt from "bcryptjs";
import { CabinClass, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.refund.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingPassenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.flightSegment.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.aircraft.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.airport.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.savedTraveler.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  await prisma.role.createMany({
    data: [
      { name: "CUSTOMER", description: "Can search and book flights" },
      { name: "ADMIN", description: "Can manage platform data" },
    ],
  });

  const airports = await Promise.all([
    prisma.airport.create({ data: { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA", timezone: "America/New_York" } }),
    prisma.airport.create({ data: { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA", timezone: "America/Los_Angeles" } }),
    prisma.airport.create({ data: { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA", timezone: "America/Los_Angeles" } }),
    prisma.airport.create({ data: { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA", timezone: "America/Chicago" } }),
  ]);

  const skyBlue = await prisma.airline.create({ data: { code: "SB", name: "SkyBlue Air" } });
  const northJet = await prisma.airline.create({ data: { code: "NJ", name: "NorthJet" } });

  const a321 = await prisma.aircraft.create({ data: { code: "A321", model: "A321neo", manufacturer: "Airbus", seatCapacity: 210 } });
  const b738 = await prisma.aircraft.create({ data: { code: "B738", model: "737-800", manufacturer: "Boeing", seatCapacity: 189 } });

  const now = new Date();
  const dep1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 15);
  const arr1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12, 5);
  const dep2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 45);
  const arr2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0);

  const flight1 = await prisma.flight.create({
    data: {
      flightNumber: "SB101",
      airlineId: skyBlue.id,
      originId: airports[0].id,
      destinationId: airports[1].id,
      aircraftId: a321.id,
      departureTime: dep1,
      arrivalTime: arr1,
      durationMinutes: 350,
      price: 320,
      currency: "USD",
      cabinClass: CabinClass.ECONOMY,
      seatsAvailable: 80,
      status: "SCHEDULED",
    },
  });

  await prisma.flight.create({
    data: {
      flightNumber: "NJ220",
      airlineId: northJet.id,
      originId: airports[0].id,
      destinationId: airports[2].id,
      aircraftId: b738.id,
      departureTime: dep2,
      arrivalTime: arr2,
      durationMinutes: 375,
      price: 360,
      currency: "USD",
      cabinClass: CabinClass.ECONOMY,
      seatsAvailable: 65,
      status: "SCHEDULED",
    },
  });

  await prisma.flight.create({
    data: {
      flightNumber: "SB330",
      airlineId: skyBlue.id,
      originId: airports[3].id,
      destinationId: airports[1].id,
      aircraftId: a321.id,
      departureTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 8, 0),
      arrivalTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 35),
      durationMinutes: 215,
      price: 240,
      currency: "USD",
      cabinClass: CabinClass.ECONOMY,
      seatsAvailable: 48,
      status: "SCHEDULED",
    },
  });

  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const userPasswordHash = await bcrypt.hash("User@1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@flightbooking.local",
      passwordHash: adminPasswordHash,
      firstName: "Platform",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "customer@flightbooking.local",
      passwordHash: userPasswordHash,
      firstName: "Ava",
      lastName: "Taylor",
      role: "CUSTOMER",
    },
  });

  await prisma.profile.create({
    data: {
      userId: user.id,
      phone: "+1-555-123-4567",
      city: "New York",
      country: "USA",
      nationality: "US",
    },
  });

  const booking = await prisma.booking.create({
    data: {
      reference: "AB12CD",
      userId: user.id,
      outboundFlightId: flight1.id,
      status: "CONFIRMED",
      tripType: "ONE_WAY",
      cabinClass: CabinClass.ECONOMY,
      passengerCount: 1,
      contactEmail: user.email,
      contactPhone: "+1-555-123-4567",
      totalPrice: 320,
      currency: "USD",
    },
  });

  const passenger = await prisma.bookingPassenger.create({
    data: {
      bookingId: booking.id,
      firstName: "Ava",
      lastName: "Taylor",
      dateOfBirth: new Date("1993-05-20"),
      nationality: "US",
      passportNumber: "P1234567",
      baggageKg: 15,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: 320,
      currency: "USD",
      status: "SUCCEEDED",
      paidAt: new Date(),
      stripePaymentIntentId: "pi_seed_demo_001",
      stripeCheckoutSessionId: "cs_seed_demo_001",
    },
  });

  await prisma.ticket.create({
    data: {
      bookingId: booking.id,
      passengerId: passenger.id,
      ticketNumber: "TKT-AB12CD-AV",
      issueDate: new Date(),
      status: "ACTIVE",
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Booking confirmed",
      message: "Your flight booking AB12CD is confirmed.",
      type: "BOOKING_CONFIRMED",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SEED_INITIALIZED",
      entity: "System",
      metadata: { seededAt: new Date().toISOString() },
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

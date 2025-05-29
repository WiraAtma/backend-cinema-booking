const { PrismaClient, LockType } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Seed Film
  const film1 = await prisma.film.create({ data: { title: 'Avengers' } });
  const film2 = await prisma.film.create({ data: { title: 'Interstellar' } });

  // Seed Schedule
  const schedule1 = await prisma.schedule.create({
    data: {
      filmId: film1.id,
      showTime: new Date('2025-05-28T14:00:00'),
      endTime: new Date('2025-05-28T16:30:00'),
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      filmId: film2.id,
      showTime: new Date('2025-05-28T18:00:00'),
      endTime: new Date('2025-05-28T20:45:00'),
    },
  });

  // Seed Seats
  const seatCodes = ['A1', 'A2', 'A3', 'B1', 'B2'];
  const seats = [];
  for (const code of seatCodes) {
    const seat = await prisma.seat.create({ data: { code } });
    seats.push(seat);
  }

  // ScheduleSeats (kombinasi nilai isLocked dan isBooked)
  const scheduleSeatsData = [
    // schedule 1
    { scheduleId: schedule1.id, seatId: seats[0].id, isLocked: true, lockType: 'TEMPORARY', lockTime: new Date('2025-05-28T13:50:00'), isBooked: false },
    { scheduleId: schedule1.id, seatId: seats[1].id, isLocked: false, lockTime: null, isBooked: true },
    { scheduleId: schedule1.id, seatId: seats[2].id, isLocked: true, lockType: 'PERMANENT', lockTime: new Date('2025-05-28T13:55:00'), isBooked: true },
    // schedule 2
    { scheduleId: schedule2.id, seatId: seats[3].id, isLocked: false, lockTime: null, isBooked: true },
    { scheduleId: schedule2.id, seatId: seats[4].id, isLocked: true, lockType: 'TEMPORARY', lockTime: new Date('2025-05-28T17:50:00'), isBooked: false },
  ];

  for (const data of scheduleSeatsData) {
    await prisma.scheduleSeat.create({ data });
  }

  // Bookings only for isBooked = true
  await prisma.booking.create({
    data: {
      scheduleSeatId: 2, // seat A2
      status: 'CONFIRMED',
      userName: 'budi',
      createdAt: new Date('2025-05-28T13:40:00'),
    },
  });

  await prisma.booking.create({
    data: {
      scheduleSeatId: 3, // seat A3
      status: 'PENDING',
      userName: 'maria',
      createdAt: new Date('2025-05-28T13:45:00'),
    },
  });

  await prisma.booking.create({
    data: {
      scheduleSeatId: 4, // seat B1
      status: 'CONFIRMED',
      userName: 'ryan',
      createdAt: new Date('2025-05-28T17:55:00'),
    },
  });
}

main()
  .then(() => {
    console.log('✅ Seeding completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // add Film
  const film = await prisma.film.create({
    data: {
      title: 'Avengers: End Game',
      schedules: {
        create: [
          {
            showTime: new Date('2025-06-01T19:00:00Z'),
            endTime: new Date('2025-06-01T21:30:00Z')
          },
        ],
      },
    },
  });

  // Add Seat (A1 - A5)
  const seatCodes = ['A1', 'A2', 'A3', 'A4', 'A5'];
  await Promise.all(
    seatCodes.map(code => prisma.seat.create({ data: { code } }))
  );

  console.log('Seeder selesai.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

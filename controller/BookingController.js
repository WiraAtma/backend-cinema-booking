const prisma = require('../config/db')

exports.postBooking = async (req, res) => {
  const { filmId, seatId, scheduleId, userName } = req.body;

  try {
    // Validasi jadwal
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: parseInt(scheduleId),
        filmId: parseInt(filmId)
      }
    });

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Jadwal tidak ditemukan'
      });
    }

    // Validasi seatId ada di tabel Seat
    const seatCheck = await prisma.seat.findUnique({
      where: { id: parseInt(seatId) }
    });

    if (!seatCheck) {
      return res.status(404).json({
        status: 'error',
        message: 'Kursi tidak ditemukan'
      });
    }

    // Transaksi aman dari race condition
    await prisma.$transaction(async (prismaTx) => {
      // Cek apakah kursi sudah terdaftar di tabel ScheduleSeat
      let seatEntry = await prismaTx.scheduleSeat.findFirst({
        where: {
          seatId: parseInt(seatId),
          scheduleId: parseInt(scheduleId)
        }
      });

      // Jika belum, buat baru
      if (!seatEntry) {
        seatEntry = await prismaTx.scheduleSeat.create({
          data: {
            seatId: parseInt(seatId),
            scheduleId: parseInt(scheduleId),
            isBooked: false,
            isLocked: false
          }
        });
      }

      // Lock baris ScheduleSeat
      const seats = await prismaTx.$queryRaw`
        SELECT * FROM \`ScheduleSeat\`
        WHERE \`id\` = ${seatEntry.id}
        FOR UPDATE
      `;

      if (!seats || seats.length === 0) {
        throw new Error('Kursi tidak ditemukan');
      }

      const seat = seats[0];

      if (seat.isBooked) {
        throw new Error('Kursi telah dipesan');
      }

      if (seat.isLocked && seat.lockTime) {
        const now = new Date();
        const expiredAt = new Date(seat.lockTime);
        expiredAt.setMinutes(expiredAt.getMinutes() + 5);

        if (now < expiredAt) {
          throw new Error('Kursi sedang dikunci oleh pengguna lain');
        }

        // Lock sudah expired, reset kursi dan hapus booking pending
        await prismaTx.scheduleSeat.update({
          where: { id: seat.id },
          data: {
            isLocked: false,
            lockTime: null,
            lockType: null
          }
        });

        await prismaTx.booking.deleteMany({
          where: {
            scheduleSeatId: seat.id,
            status: 'PENDING'
          }
        });
      }

      // Lock kursi untuk user ini
      const lockedSeat = await prismaTx.scheduleSeat.update({
        where: { id: seat.id },
        data: {
          isLocked: true,
          lockTime: new Date(),
          lockType: 'TEMPORARY'
        }
      });

      // Buat booking baru
      await prismaTx.booking.create({
        data: {
          scheduleSeatId: lockedSeat.id,
          userName,
          status: 'PENDING'
        }
      });
    });

    res.status(201).json({
      status: 'success',
      message: 'Kursi berhasil dikunci. Lanjutkan pembayaran dalam 5 menit.'
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan server.'
    });
  }
};



exports.confirmBooking = async (req, res) => {
    const { scheduleSeatId } = req.body;

    try {
        // Ambil kursi + booking PENDING
        const seat = await prisma.scheduleSeat.findUnique({
            where: { id: parseInt(scheduleSeatId) },
            include: {
                bookings: {
                    where: {
                        status: 'PENDING'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        // Mengecek apakah kursi ditemukan dan ada booking PENDING
        if (!seat) {
            return res.status(404).json({
                status: 'error',
                message: 'Kursi tidak ditemukan.'
            });
        }

        // cek apakah ada booking PENDING
        const pendingBooking = seat.bookings[0];
        if (!pendingBooking) {
            return res.status(400).json({
                status: 'error',
                message: 'Tidak ada booking tertunda untuk kursi ini.'
            });
        }

        if (!seat.isLocked || seat.lockType !== 'TEMPORARY') {
            return res.status(400).json({
                status: 'error',
                message: 'Kursi tidak dalam status terkunci.'
            });
        }

        // Cek apakah lock sudah expired
        const now = new Date();
        const expiredAt = new Date(seat.lockTime);
        expiredAt.setMinutes(expiredAt.getMinutes() + 5);

        if (now > expiredAt) {
            return res.status(400).json({
                status: 'error',
                message: 'Waktu konfirmasi habis. Silakan pesan ulang.'
            });
        }

        // Konfirmasi booking dan update seat dalam 1 transaksi
        await prisma.$transaction([
            prisma.booking.update({
                where: { id: pendingBooking.id },
                data: { status: 'CONFIRMED' }
            }),

            prisma.scheduleSeat.update({
                where: { id: seat.id },
                data: {
                    isBooked: true,
                    isLocked: false,
                    lockType: 'PERMANENT',
                    lockTime: null
                }
            })
        ]);

        res.status(200).json({
            status: 'success',
            message: 'Booking berhasil dikonfirmasi.'
        });

    } catch (error) {
        console.error('Error Confirm Booking', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};


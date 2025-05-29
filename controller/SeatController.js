const prisma = require('../config/db');
const { LockType } = require('../generated/prisma');

exports.getSeats = async (req, res) => {
    const { scheduleId } = req.params;

    try {
        const seats = await prisma.seat.findMany({
            include: {
                scheduleSeats: {
                where: { scheduleId: parseInt(scheduleId) },
                select: {
                    isLocked: true,
                    isBooked: true,
                    lockTime: true,
                    lockType: true,
                    bookings: {
                        select: {
                            status: true,
                            userName: true
                        }
                    }
                }
                }
            }
        });
    
        res.status(200).json({
            status: 'success',
            data: {
                seats
            }
        });
    } catch (error) {
        console.error('Error fetching Seats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }

    exports.lockSeat = async (req, res) => {
        const { scheduleId, seatId } = req.params;

        // check film id in schedule
        const schedule = await prisma.schedule.findFirst({
            where: {
                filmId: parseInt(filmId)
            }
        });

        if (!schedule) {
            return res.status(404).json({
                status: 'error',
                message: 'Jadwal tidak ditemukan'
            });
        }

        const existing = await prisma.scheduleSeat.findUnique({
            where: {
                scheduleId_seatId: {
                    scheduleId: parseInt(scheduleId),
                    seatId: parseInt(seatId)
                }
            }
        });

        if (existing && existing.isBooked) {
            return res.status(400).json({
                status: 'error',
                message: 'Mohon Maaf Kursi Telah Dipesan'
            });
        }

        let scheduleSeat = existing;
        if (!existing) {
            scheduleSeat = await prisma.scheduleSeat.create({
                data: {
                    scheduleId: parseInt(scheduleId),
                    seatId: parseInt(seatId),
                    isLocked: 1,    
                    lockTime: new Date.now(),
                    LockType: 'TEMPORARY'
                }
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Locking Posisi Kursi berhasil'
        });

    }
    
}
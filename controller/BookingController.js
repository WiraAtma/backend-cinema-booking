const prisma = require('../config/db')

exports.postBooking = async (req, res) => {
    const { filmId, seatId, scheduleId, userName } = req.body;

    try {
        // check schedule film availability
        const schedule = await prisma.schedule.findFirst({
            where: {
                filmId: parseInt(filmId)
            }
        });

        if(!schedule) {
            return res.status(404).json({
                status: 'error',
                message: 'Jadwal tidak ditemukan'
            });
        }

        // Check if the seat is already booked or locked
        const existing = await prisma.scheduleSeat.findUnique({
            where: {
                scheduleId_seatId: {
                    scheduleId: parseInt(scheduleId),
                    seatId: parseInt(seatId)
                }
            }
        });

        // If the seat is locked, return an error
        if (existing && existing.isBooked) {
            return res.status(400).json({
                status: 'error',
                message: 'Mohon Maaf Kursi Telah Dipesan'
            });
        }

        // If it doesn't exist, add it to ScheduleSeat and Booking
        let scheduleSeat = existing;
        if (!existing) {
            scheduleSeat = await prisma.scheduleSeat.create({
                data: {
                    scheduleId: parseInt(scheduleId),
                    seatId: parseInt(seatId),
                    isBooked: true
                }
            });
        } else {
            // If it already exists but not yet booked, update it to booked
            scheduleSeat = await prisma.scheduleSeat.update({
                where: {
                    scheduleId_seatId: {
                        scheduleId: parseInt(scheduleId),
                        seatId: parseInt(seatId)
                    }
                },
                data: {
                    isBooked: true
                }
                
            });
        }

        // Insert Booking
        await prisma.booking.create({
            data: {
                scheduleSeatId: scheduleSeat.id,
                status: 'CONFIRMED', // After Booking Automatically Confirmed
                userName
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Booking berhasil'
        });
    } catch (error) {
        console.error('Error booking:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
}

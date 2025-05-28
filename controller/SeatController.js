const prisma = require('../config/db')

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
}
const prisma = require('../config/db')

exports.getFilm = async (req, res) => {
    try {
        const films = await prisma.film.findMany({
            include: {
                schedules: true,
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                films
            }
        });
    } catch (error) {
        console.error('Error fetching films:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
}
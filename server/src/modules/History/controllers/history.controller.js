import History from '../models/History.js';

export const getHistoryByRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;
        const history = await History.find({ roomCode: roomCode.toUpperCase() }).sort({ createdAt: 1 });
        
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Internal server error fetching history' });
    }
};

export const getAllHistoryRooms = async (req, res) => {
    try {
        // Find distinct room codes that have history
        const rooms = await History.distinct('roomCode');
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching distinct history rooms:', error);
        res.status(500).json({ message: 'Internal server error fetching rooms' });
    }
};

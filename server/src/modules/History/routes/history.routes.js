import express from 'express';
import { getHistoryByRoom, getAllHistoryRooms } from '../controllers/history.controller.js';

const router = express.Router();

// Get list of rooms that have history
router.get('/', getAllHistoryRooms);

// Get history for a specific room (public access as requested)
router.get('/:roomCode', getHistoryByRoom);

export default router;

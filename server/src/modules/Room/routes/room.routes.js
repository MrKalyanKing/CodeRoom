import express from 'express';
import { createRoom, getRoomInfo, updateRoom } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/', createRoom);
router.get('/:code', getRoomInfo);
router.patch('/:code', updateRoom);

export default router;

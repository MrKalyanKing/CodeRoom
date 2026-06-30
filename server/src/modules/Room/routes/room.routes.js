import express from 'express';
import { createRoom, getRoomInfo, updateRoom, authRoom, joinRoom } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/', createRoom);
router.get('/:code', getRoomInfo);
router.patch('/:code', updateRoom);
router.post('/:code/auth', authRoom);
router.post('/:code/join', joinRoom);

export default router;

import express from 'express';
import { verifyRoomPassword, joinRoom } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/:code/auth', verifyRoomPassword);
router.post('/:code/join', joinRoom);

export default router;

import bcrypt from 'bcryptjs';
import Room from '../../Room/models/Room.js';
import { signRoomToken, verifyRoomToken } from '../../../utils/token.js';

export const authenticateRoom = async (code, password) => {
  const room = await Room.findOne({ code });
  if (!room) return { status: 404, error: 'Room not found' };

  if (!room.passwordHash) {
    return { status: 200, data: { roomToken: null } };
  }

  if (!password) {
    return { status: 400, error: 'Password is required' };
  }

  const match = await bcrypt.compare(password, room.passwordHash);
  if (!match) {
    return { status: 401, error: 'Incorrect password' };
  }

  const roomToken = signRoomToken(code);
  return { status: 200, data: { roomToken } };
};

export const joinRoomService = async (code, hostToken, roomToken) => {
  const room = await Room.findOne({ code });
  if (!room) {
    return { status: 404, error: 'Room not found. Check the code and try again.' };
  }

  if (room.passwordHash) {
    const isHost = hostToken && room.hostToken === hostToken;
    if (!isHost) {
      if (!roomToken) {
        return { status: 401, error: 'This room requires a password', requiresAuth: true };
      }
      try {
        verifyRoomToken(code, roomToken);
      } catch {
        return { status: 401, error: 'Invalid or expired room token', requiresAuth: true };
      }
    }
  }

  return { status: 200, data: room };
};

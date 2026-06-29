import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Room from '../models/Room.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-set-JWT_SECRET-in-env';

export function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function uniqueCode() {
  let code;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 20) throw new Error('Could not generate unique room code');
  } while (await Room.exists({ code }));
  return code;
}

export const createRoomService = async (name, password) => {
  if (!name || !name.trim()) {
    return { status: 400, error: 'Room name is required' };
  }

  const code = await uniqueCode();
  const hostToken = uuidv4();
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const room = await Room.create({
    code,
    name: name.trim(),
    hostToken,
    passwordHash,
    content: '',
    version: 0,
  });

  return { status: 201, data: room, hostToken, passwordHash };
};

export const getRoomInfoService = async (code) => {
  const room = await Room.findOne({ code });
  if (!room) return { status: 404, error: 'Room not found' };

  return { status: 200, data: room };
};

export const authRoomService = async (code, password) => {
  const room = await Room.findOne({ code });
  if (!room) return { status: 404, error: 'Room not found' };
  if (!room.passwordHash) return { status: 400, error: 'Room is not password protected' };

  const valid = await bcrypt.compare(password, room.passwordHash);
  if (!valid) return { status: 401, error: 'Incorrect password' };

  const roomToken = jwt.sign({ code }, JWT_SECRET, { expiresIn: '4h' });
  return { status: 200, roomToken };
};

export const joinRoomService = async (code, roomToken) => {
  const room = await Room.findOne({ code });
  if (!room) return { status: 404, error: 'Room not found' };

  if (room.passwordHash) {
    if (!roomToken) return { status: 403, error: 'This room requires a password' };
    try {
      const payload = jwt.verify(roomToken, JWT_SECRET);
      if (payload.code !== code) throw new Error('Token room mismatch');
    } catch {
      return { status: 403, error: 'Invalid or expired room token' };
    }
  }

  return { status: 200, data: room };
};

export const updateRoomService = async (code, hostToken, name, password, removePassword) => {
  const room = await Room.findOne({ code });
  if (!room) return { status: 404, error: 'Room not found' };
  
  if (room.hostToken !== hostToken) {
    return { status: 403, error: 'Only the host can update the room' };
  }

  if (name && name.trim()) room.name = name.trim();
  if (removePassword) room.passwordHash = null;
  else if (password) room.passwordHash = await bcrypt.hash(password, 10);

  await room.save();

  return { status: 200, data: room };
};

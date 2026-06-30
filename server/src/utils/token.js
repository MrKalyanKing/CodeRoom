import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-set-JWT_SECRET-in-env';
const ROOM_TOKEN_TTL = '4h';

export function signRoomToken(code) {
  return jwt.sign({ code, role: 'participant' }, JWT_SECRET, { expiresIn: ROOM_TOKEN_TTL });
}

export function verifyRoomToken(code, token) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.code !== code) throw new Error('Token room mismatch');
  return payload;
}

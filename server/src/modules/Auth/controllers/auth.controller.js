import { authenticateRoom, joinRoomService } from '../services/auth.service.js';
import { initRoom } from '../../../syncEngine.js';

export const verifyRoomPassword = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { password } = req.body;

    const result = await authenticateRoom(code, password);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result.data);
  } catch (err) {
    console.error('POST /api/rooms/:code/auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { hostToken, roomToken } = req.body;

    const result = await joinRoomService(code, hostToken, roomToken);
    if (result.error) {
      return res.status(result.status).json({ error: result.error, requiresAuth: result.requiresAuth });
    }

    const room = result.data;
    initRoom(code, room.content, room.version);

    res.json({
      code: room.code,
      name: room.name,
      content: room.content,
      version: room.version,
      isPasswordProtected: !!room.passwordHash,
    });
  } catch (err) {
    console.error('POST /api/rooms/:code/join error:', err);
    res.status(500).json({ error: 'Failed to join room' });
  }
};

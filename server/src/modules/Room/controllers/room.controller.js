import { createRoomService, getRoomInfoService, updateRoomService } from '../services/room.service.js';
import { initRoom } from '../../../SynEngine.js';

export const createRoom = async (req, res) => {
  try {
    const { name, password } = req.body;

    const result = await createRoomService(name, password);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    const { data: room, hostToken, passwordHash } = result;

    initRoom(room.code, '', 0);

    res.status(201).json({
      code: room.code,
      name: room.name,
      hostToken,
      isPasswordProtected: !!passwordHash,
    });
  } catch (err) {
    console.error('POST /api/rooms error:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRoomInfo = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const result = await getRoomInfoService(code);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    const room = result.data;
    res.json({
      code: room.code,
      name: room.name,
      isPasswordProtected: !!room.passwordHash,
    });
  } catch (err) {
    console.error('GET /api/rooms/:code error:', err);
    res.status(500).json({ error: 'Failed to fetch room info' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { hostToken, name, password, removePassword } = req.body;

    const result = await updateRoomService(code, hostToken, name, password, removePassword);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    const room = result.data;
    res.json({
      code: room.code,
      name: room.name,
      isPasswordProtected: !!room.passwordHash,
    });
  } catch (err) {
    console.error('PATCH /api/rooms/:code error:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

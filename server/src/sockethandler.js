/**
 * Domain C — Realtime & Presence
 * Domain B — Sync Engine integration
 *
 * Per-room participant registry is in-memory only (presence doesn't persist).
 * Format: participantsByRoom = Map<roomCode, Map<socketId, { handle, isHost }>>
 */

import jwt from 'jsonwebtoken';
import { receiveOp, initRoom, getContent } from './SynEngine.js';
import Room from './modules/Room/models/Room.js';
import History from './modules/History/models/History.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-set-JWT_SECRET-in-env';

const participantsByRoom = new Map();

// Debounce handles keyed by roomCode for persistence writes
const saveTimers = new Map();
const SAVE_DEBOUNCE_MS = 1500;

function scheduleSave(roomCode) {
    if (saveTimers.has(roomCode)) clearTimeout(saveTimers.get(roomCode));
    const timer = setTimeout(async () => {
        saveTimers.delete(roomCode);
        const state = getContent(roomCode);
        if (!state) return;
        try {
            await Room.findOneAndUpdate(
                { code: roomCode },
                { content: state.content, version: state.version },
                { new: true }
            );
            await History.create({
                roomCode: roomCode,
                content: state.content,
                version: state.version
            });
        } catch (err) {
            console.error(`Persist error for room ${roomCode}:`, err);
        }
    }, SAVE_DEBOUNCE_MS);
    saveTimers.set(roomCode, timer);
}

function getParticipantList(roomCode) {
    const map = participantsByRoom.get(roomCode);
    if (!map) return [];
    return Array.from(map.entries()).map(([socketId, info]) => ({
        socketId,
        handle: info.handle,
        isHost: info.isHost,
    }));
}

function registerSocket(io, socket) {
    // ── join-room ──────────────────────────────────────────────────────────────
    socket.on('join-room', async ({ roomCode, handle, hostToken, roomToken }) => {
        const code = roomCode.toUpperCase();

        let dbRoom;
        try {
            dbRoom = await Room.findOne({ code });
            if (!dbRoom) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }
            initRoom(code, dbRoom.content, dbRoom.version);
        } catch (err) {
            socket.emit('error', { message: 'Server error joining room' });
            return;
        }

        const isHost = !!(hostToken && dbRoom.hostToken === hostToken);

        // For password-protected rooms, non-hosts must present a valid room token
        if (dbRoom.passwordHash && !isHost) {
            if (!roomToken) {
                socket.emit('error', { message: 'This room requires a password', requiresAuth: true });
                return;
            }
            try {
                const payload = jwt.verify(roomToken, JWT_SECRET);
                if (payload.code !== code) throw new Error('Token room mismatch');
            } catch {
                socket.emit('error', { message: 'Invalid or expired room token', requiresAuth: true });
                return;
            }
        }

        socket.join(code);
        socket.data.roomCode = code;
        socket.data.handle = handle;
        socket.data.isHost = isHost;

        if (!participantsByRoom.has(code)) participantsByRoom.set(code, new Map());
        participantsByRoom.get(code).set(socket.id, { handle, isHost });

        // Send current doc state to the joining client
        const state = getContent(code);
        socket.emit('room-state', {
            content: state.content,
            version: state.version,
            participants: getParticipantList(code),
        });

        // Broadcast updated participant list to everyone in the room
        io.to(code).emit('participants-update', getParticipantList(code));

        console.log(`[join] ${handle} joined ${code} (host: ${isHost})`);
    });

    // ── text-op ───────────────────────────────────────────────────────────────
    // Client sends: { baseVersion, op: { from, to, insert } }
    socket.on('text-op', ({ baseVersion, op }) => {
        const code = socket.data.roomCode;
        if (!code) return;

        try {
            const result = receiveOp(code, baseVersion, op);
            // Broadcast the transformed op + new version to ALL clients in the room
            io.to(code).emit('remote-op', {
                op: result.op,
                version: result.version,
                senderSocketId: socket.id,
            });
            scheduleSave(code);
        } catch (err) {
            console.error(`text-op error in room ${code}:`, err);
            // Send current state back to the client so it can resync
            const state = getContent(code);
            if (state) socket.emit('resync', state);
        }
    });

    // ── typing presence ────────────────────────────────────────────────────────
    socket.on('typing', () => {
        const code = socket.data.roomCode;
        if (!code) return;
        socket.to(code).emit('user-typing', { handle: socket.data.handle, socketId: socket.id });
    });

    // ── host: kick participant ─────────────────────────────────────────────────
    socket.on('kick', ({ targetSocketId }) => {
        const code = socket.data.roomCode;
        if (!code || !socket.data.isHost) {
            socket.emit('error', { message: 'Only the host can kick participants' });
            return;
        }
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
            targetSocket.emit('kicked', { message: 'You have been removed from the room by the host.' });
            targetSocket.leave(code);
            participantsByRoom.get(code)?.delete(targetSocketId);
            io.to(code).emit('participants-update', getParticipantList(code));
        }
    });

    // ── host: rename room via socket ───────────────────────────────────────────
    socket.on('rename-room', async ({ name }) => {
        const code = socket.data.roomCode;
        if (!code || !name?.trim()) return;
        if (!socket.data.isHost) {
            socket.emit('error', { message: 'Only the host can rename the room' });
            return;
        }
        try {
            await Room.findOneAndUpdate({ code }, { name: name.trim() });
            io.to(code).emit('room-renamed', { name: name.trim() });
        } catch (err) {
            socket.emit('error', { message: 'Failed to rename room' });
        }
    });

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
        const code = socket.data.roomCode;
        if (!code) return;
        participantsByRoom.get(code)?.delete(socket.id);
        io.to(code).emit('participants-update', getParticipantList(code));
        console.log(`[leave] ${socket.data.handle} left ${code}`);
    });
}

export { registerSocket };

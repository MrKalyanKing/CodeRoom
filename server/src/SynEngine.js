/**
 * Domain B — Document & Sync Engine
 *
 * Each room keeps:
 *   content  : canonical document string
 *   version  : monotonic counter, incremented on every applied op
 *   opLog    : recent ops [{version, op}] used to transform late-arriving edits
 *
 * An op is: { from: number, to: number, insert: string }
 *   — meaning "replace content[from..to) with `insert`"
 *   — pure insert : to === from
 *   — pure delete : insert === ""
 *
 * Transformation rule (homegrown):
 *   To apply incomingOp on top of an already-applied refOp, shift the
 *   incoming op's from/to positions through the refOp's effect:
 *
 *   refOp inserted L chars at position p → shift positions ≥ p by +L
 *   refOp deleted   L chars at position p → shift positions ≥ p+L by -L,
 *                                           positions inside [p, p+L) → p
 */

const OP_LOG_LIMIT = 200;

// In-memory store keyed by roomCode
const rooms = new Map();

function getRoom(code) {
    return rooms.get(code);
}

function initRoom(code, content, version) {
    if (!rooms.has(code)) {
        rooms.set(code, { content, version, opLog: [] });
    }
    return rooms.get(code);
}

function applyOp(content, op) {
    return content.slice(0, op.from) + op.insert + content.slice(op.to);
}

/**
 * Transform `op` as if `refOp` was already applied to the document.
 * Returns a new op with adjusted positions.
 */
function transformOp(op, refOp) {
    const refInsertLen = refOp.insert.length;
    const refDeleteLen = refOp.to - refOp.from;
    const refNet = refInsertLen - refDeleteLen; // net character shift

    let { from, to, insert } = op;

    if (refInsertLen > 0 && refDeleteLen === 0) {
        // refOp was a pure insert at refOp.from
        const p = refOp.from;
        if (from >= p) from += refInsertLen;
        if (to >= p) to += refInsertLen;
    } else if (refDeleteLen > 0 && refInsertLen === 0) {
        // refOp was a pure delete of [refOp.from, refOp.to)
        const p = refOp.from;
        const L = refDeleteLen;
        // shift from
        if (from >= p + L) {
            from -= L;
        } else if (from > p) {
            from = p;
        }
        // shift to
        if (to >= p + L) {
            to -= L;
        } else if (to > p) {
            to = p;
        }
    } else {
        // replace: treat as delete then insert
        const p = refOp.from;
        const L = refDeleteLen;
        const I = refInsertLen;
        if (from >= p + L) {
            from = from - L + I;
        } else if (from > p) {
            from = p + I;
        }
        if (to >= p + L) {
            to = to - L + I;
        } else if (to > p) {
            to = p + I;
        }
    }

    // Guard: ensure from <= to and both are non-negative
    from = Math.max(0, from);
    to = Math.max(from, to);

    return { from, to, insert };
}

/**
 * Receive a client op, transform it against any ops applied since baseVersion,
 * apply it to the canonical content, and return the broadcast-ready op.
 *
 * Returns: { op: transformedOp, version: newVersion }
 */
function receiveOp(code, baseVersion, clientOp) {
    const room = rooms.get(code);
    if (!room) throw new Error(`Room ${code} not in memory`);

    // Collect ops applied since baseVersion
    const pendingOps = room.opLog.filter((entry) => entry.version > baseVersion);

    let op = { ...clientOp };
    for (const entry of pendingOps) {
        op = transformOp(op, entry.op);
    }

    // Clamp op positions to content length
    const len = room.content.length;
    op.from = Math.max(0, Math.min(op.from, len));
    op.to = Math.max(op.from, Math.min(op.to, len));

    room.content = applyOp(room.content, op);
    room.version += 1;

    const entry = { version: room.version, op };
    room.opLog.push(entry);
    if (room.opLog.length > OP_LOG_LIMIT) room.opLog.shift();

    return { op, version: room.version };
}

function getContent(code) {
    const room = rooms.get(code);
    return room ? { content: room.content, version: room.version } : null;
}

function removeRoom(code) {
    rooms.delete(code);
}

module.exports = { initRoom, receiveOp, getContent, getRoom, removeRoom };

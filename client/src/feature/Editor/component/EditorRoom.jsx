import { useEffect, useRef, useState, useCallback } from 'react';
// import { getSocket } from '../lib/socket';
import { getSocket } from '../../../lib/socket';
// import { diffToOp, applyOp, shiftCaret } from '../lib/delta';
import { diffToOp, applyOp, shiftCaret } from '../../../lib/delta';
// import ParticipantList from './ParticipantList';
import ParticipantList from '../../Participants/Components/ParticipantList';
// import HostControls from './HostControls';
import HostControls from '../../HostControl/component/HostControl';

const TYPING_THROTTLE_MS = 400;
const TYPING_CLEAR_MS = 1200;

export default function EditorRoom({ session, onLeave }) {
    const { code, handle, hostToken, isHost, roomToken, isPasswordProtected } = session;
    const [roomName, setRoomName] = useState(session.roomName);

    // Editor state
    const [content, setContent] = useState('');
    const versionRef = useRef(0);
    const contentRef = useRef(''); // mirrors content without re-render lag

    // Presence
    const [participants, setParticipants] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Map()); // socketId → handle
    const typingTimers = useRef(new Map());

    // Inflight op tracking to avoid echo-applying our own ops
    const pendingOps = useRef([]);

    const textareaRef = useRef(null);
    const lastTypingEmit = useRef(0);
    const socketRef = useRef(null);

    // ── Socket setup ────────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;

        if (!socket.connected) socket.connect();

        socket.emit('join-room', { roomCode: code, handle, hostToken, roomToken });

        socket.on('room-state', ({ content: c, version: v, participants: p }) => {
            contentRef.current = c;
            versionRef.current = v;
            setContent(c);
            setParticipants(p);
        });

        socket.on('remote-op', ({ op, version, senderSocketId }) => {
            if (senderSocketId === socket.id) {
                // This is the echo of our own op; just advance the version
                versionRef.current = version;
                return;
            }

            const textarea = textareaRef.current;
            const caret = textarea ? textarea.selectionStart : 0;

            const newContent = applyOp(contentRef.current, op);
            const newCaret = shiftCaret(caret, op);

            contentRef.current = newContent;
            versionRef.current = version;
            setContent(newContent);

            // Restore caret after React re-render
            if (textarea) {
                requestAnimationFrame(() => {
                    textarea.selectionStart = newCaret;
                    textarea.selectionEnd = newCaret;
                });
            }
        });

        socket.on('resync', ({ content: c, version: v }) => {
            contentRef.current = c;
            versionRef.current = v;
            setContent(c);
        });

        socket.on('participants-update', (list) => setParticipants(list));

        socket.on('user-typing', ({ handle: h, socketId }) => {
            setTypingUsers((prev) => new Map(prev).set(socketId, h));
            if (typingTimers.current.has(socketId)) {
                clearTimeout(typingTimers.current.get(socketId));
            }
            const t = setTimeout(() => {
                setTypingUsers((prev) => {
                    const next = new Map(prev);
                    next.delete(socketId);
                    return next;
                });
                typingTimers.current.delete(socketId);
            }, TYPING_CLEAR_MS);
            typingTimers.current.set(socketId, t);
        });

        socket.on('kicked', ({ message }) => {
            alert(message);
            onLeave();
        });

        socket.on('room-renamed', ({ name }) => setRoomName(name));

        socket.on('error', ({ message }) => console.error('Socket error:', message));

        return () => {
            socket.off('room-state');
            socket.off('remote-op');
            socket.off('resync');
            socket.off('participants-update');
            socket.off('user-typing');
            socket.off('kicked');
            socket.off('room-renamed');
            socket.off('error');
            socket.disconnect();
        };
    }, [code, handle, hostToken, roomToken, onLeave]);

    // ── Keystroke → delta op ────────────────────────────────────────────────────
    const handleInput = useCallback((e) => {
        const newVal = e.target.value;
        const oldVal = contentRef.current;
        const op = diffToOp(oldVal, newVal);

        contentRef.current = newVal;
        setContent(newVal);

        const socket = socketRef.current;
        if (socket && socket.connected) {
            socket.emit('text-op', { baseVersion: versionRef.current, op });

            // Throttled typing presence
            const now = Date.now();
            if (now - lastTypingEmit.current > TYPING_THROTTLE_MS) {
                socket.emit('typing');
                lastTypingEmit.current = now;
            }
        }
    }, []);

    // ── Copy room code ───────────────────────────────────────────────────────────
    function copyCode() {
        navigator.clipboard.writeText(code).catch(() => { });
    }

    const typingList = Array.from(typingUsers.values());
    const typingText =
        typingList.length === 1
            ? `${typingList[0]} is editing…`
            : typingList.length > 1
                ? `${typingList.slice(0, -1).join(', ')} and ${typingList[typingList.length - 1]} are editing…`
                : '';

    return (
        <div className="flex h-screen bg-[#0d1117] overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="w-56 bg-[#161b22] border-r border-[#30363d] flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-[#30363d]">
                    <h2 className="text-[#58a6ff] font-bold text-lg">CodeRoom</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-xs font-mono px-2 py-1 rounded font-bold tracking-widest">
                            {code}
                        </span>
                        <button
                            className="text-xs text-gray-400 border border-[#30363d] px-2 py-1 rounded hover:text-white hover:border-gray-500 transition-colors"
                            onClick={copyCode}
                            title="Copy room code"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <ParticipantList
                    participants={participants}
                    currentSocketId={socketRef.current?.id}
                    isHost={isHost}
                    onKick={(targetSocketId) => {
                        socketRef.current?.emit('kick', { targetSocketId });
                    }}
                />

                {isHost && (
                    <HostControls
                        code={code}
                        hostToken={hostToken}
                        isPasswordProtected={isPasswordProtected}
                        onRenamed={setRoomName}
                        socket={socketRef.current}
                    />
                )}

                <button
                    className="mx-3 mb-3 mt-auto border border-red-700 text-red-500 rounded px-4 py-2 text-sm hover:bg-red-900/20 transition-colors"
                    onClick={onLeave}
                >
                    Leave Room
                </button>
            </aside>

            {/* ── Editor ───────────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center justify-between">
                    <span className="text-gray-400 text-sm">main.js</span>
                    {typingText && <span className="text-yellow-400 text-xs italic">{typingText}</span>}
                </div>
                <textarea
                    ref={textareaRef}
                    className="flex-1 bg-[#0d1117] text-gray-300 font-mono text-sm p-4 resize-none outline-none leading-relaxed"
                    value={content}
                    onChange={handleInput}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder="// Start coding here…"
                />
            </main>
        </div>
    );
}

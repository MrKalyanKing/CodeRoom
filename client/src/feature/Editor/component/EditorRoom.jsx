import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../../../lib/socket';
import { diffToOp, applyOp, shiftCaret } from '../../../lib/delta';
import ParticipantList from '../../Participants/Components/ParticipantList';
import HostControls from '../../HostControl/component/HostControl';
import CodeEditor from './CodeEditor';
import {
    LogoIcon,
    PlayIcon,
    DotsIcon,
    ExitIcon,
    CodeFileIcon,
    ClockIcon,
    UserIcon,
    CopyIcon,
    NodeIcon,
    TerminalIcon,
} from '../../../components/Icons';

const TYPING_THROTTLE_MS = 400;
const TYPING_CLEAR_MS = 1200;

function formatRelative(ms) {
    if (ms == null) return '—';
    const seconds = Math.max(0, Math.floor((Date.now() - ms) / 1000));
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

export default function EditorRoom({ session, onLeave, onViewHistory }) {
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

    const textareaRef = useRef(null);
    const lastTypingEmit = useRef(0);
    const socketRef = useRef(null);

    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [, forceTick] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [outputOpen, setOutputOpen] = useState(false);
    const [copied, setCopied] = useState(false);

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
            setLastSavedAt(Date.now());
        });

        socket.on('remote-op', ({ op, version, senderSocketId }) => {
            if (senderSocketId === socket.id) {
                versionRef.current = version;
                setLastSavedAt(Date.now());
                return;
            }

            const textarea = textareaRef.current;
            const caret = textarea ? textarea.selectionStart : 0;

            const newContent = applyOp(contentRef.current, op);
            const newCaret = shiftCaret(caret, op);

            contentRef.current = newContent;
            versionRef.current = version;
            setContent(newContent);
            setLastSavedAt(Date.now());

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

    // Re-render every 30s so "Last saved: Xm ago" stays fresh
    useEffect(() => {
        const t = setInterval(() => forceTick((n) => n + 1), 30000);
        return () => clearInterval(t);
    }, []);

    // ── Keystroke → delta op ────────────────────────────────────────────────────
    const handleInput = useCallback((e) => {
        const newVal = e.target.value;
        const oldVal = contentRef.current;
        const op = diffToOp(oldVal, newVal);

        contentRef.current = newVal;
        setContent(newVal);
        setLastSavedAt(Date.now());

        const socket = socketRef.current;
        if (socket && socket.connected) {
            socket.emit('text-op', { baseVersion: versionRef.current, op });

            const now = Date.now();
            if (now - lastTypingEmit.current > TYPING_THROTTLE_MS) {
                socket.emit('typing');
                lastTypingEmit.current = now;
            }
        }
    }, []);

    function copyCode() {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    const typingList = Array.from(typingUsers.values());
    const typingText =
        typingList.length === 1
            ? `${typingList[0]} is editing…`
            : typingList.length > 1
                ? `${typingList.slice(0, -1).join(', ')} and ${typingList[typingList.length - 1]} are editing…`
                : '';

    return (
        <div className="flex flex-col h-screen bg-[#05080c] overflow-hidden">
            {/* ── Top nav ──────────────────────────────────────────────────── */}
            <header className="h-16 flex-shrink-0 bg-[#070a0f] border-b border-[#1c232c] flex items-center px-6 gap-8">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00dbe9]/10 border border-[#00dbe9]/40 flex items-center justify-center text-[#00dbe9]">
                        <LogoIcon />
                    </div>
                    <span className="text-[#00dbe9] font-bold text-lg tracking-tight">CodeRoom</span>
                </div>

                <nav className="hidden sm:flex items-center gap-7 flex-1 justify-center text-sm">
                    <span className="text-[#00dbe9] font-medium border-b-2 border-[#00dbe9] pb-5 -mb-5 cursor-default">
                        Editor
                    </span>
                    {/* <span className="text-gray-500 cursor-default" title="Coming soon">
                        Rooms
                    </span> */}
                    <span
                        className="text-gray-500 cursor-pointer hover:text-white transition"
                        onClick={onViewHistory}
                    >
                        History
                    </span>
                    {/* <span className="text-gray-500 cursor-default" title="Coming soon">
                        Settings
                    </span> */}
                </nav>

                <div className="w-9 h-9 rounded-full border border-[#1c232c] flex items-center justify-center text-gray-400 flex-shrink-0">
                    <UserIcon />
                </div>
            </header>

            <div className="flex flex-1 min-h-0 gap-5 p-5">
                {/* ── Sidebar ──────────────────────────────────────────────── */}
                <aside className="w-80 bg-[#0a0e14] border border-[#1c232c] rounded-2xl flex flex-col flex-shrink-0 overflow-hidden">
                    <div className="px-5 pt-5 pb-4 border-b border-[#1c232c]">
                        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-3">
                            <NodeIcon className="text-[#00dbe9]" />
                            Active Room
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-white font-semibold text-2xl truncate">{roomName}</h2>
                            <span className="text-[10px] font-semibold tracking-wide text-[#00dbe9] border border-[#00dbe9]/50 rounded-full px-2.5 py-1 flex-shrink-0">
                                {isPasswordProtected ? 'PRIVATE' : 'PUBLIC'}
                            </span>
                        </div>
                        <button
                            className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 font-mono transition-colors"
                            onClick={copyCode}
                            title="Copy room code"
                        >
                            <CopyIcon />
                            {copied ? 'Copied!' : code}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ParticipantList
                            participants={participants}
                            currentSocketId={socketRef.current?.id}
                            isHost={isHost}
                            onKick={(targetSocketId) => {
                                socketRef.current?.emit('kick', { targetSocketId });
                            }}
                        />
                    </div>

                    <button
                        className="mx-4 mb-4 mt-2 flex items-center justify-center gap-2 border border-red-900/60 text-red-500 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-red-900/20 hover:border-red-700 transition-colors"
                        onClick={onLeave}
                    >
                        <ExitIcon />
                        Leave Room
                    </button>
                </aside>

                {/* ── Editor ───────────────────────────────────────────────── */}
                <main className="flex-1 flex flex-col min-w-0 relative bg-[#070a0f] border border-[#1c232c] rounded-2xl overflow-hidden">
                    <div className="h-16 flex-shrink-0 bg-[#0a0e14] border-b border-[#1c232c] px-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <CodeFileIcon className="text-[#00dbe9] flex-shrink-0" />
                            <span className="text-gray-100 text-sm font-medium">main.js</span>
                            <span className="w-px h-4 bg-[#1c232c] flex-shrink-0" />
                            <span className="flex items-center gap-1.5 text-gray-500 text-xs flex-shrink-0">
                                <ClockIcon />
                                Last saved: {formatRelative(lastSavedAt)}
                            </span>
                            {typingText && (
                                <span className="hidden lg:inline text-amber-400 text-xs italic ml-2 truncate">
                                    {typingText}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                className="flex items-center gap-2 bg-[#00dbe9] text-[#04181c] text-xs font-bold tracking-wide rounded-full pl-4 pr-5 py-2.5 hover:bg-[#33e4ef] transition-colors"
                                onClick={() => setOutputOpen(true)}
                            >
                                <PlayIcon />
                                RUN CODE
                            </button>
                            <div className="relative">
                                <button
                                    className="w-9 h-9 rounded-full border border-[#1c232c] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                    onClick={() => setMenuOpen((v) => !v)}
                                >
                                    <DotsIcon />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-[#0c1117] border border-[#1c232c] rounded-lg shadow-xl z-20 py-2">
                                        <button
                                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                                            onClick={copyCode}
                                        >
                                            <CopyIcon />
                                            {copied ? 'Copied!' : `Copy room code (${code})`}
                                        </button>
                                        {isHost && (
                                            <div className="border-t border-[#1c232c] mt-2 pt-1">
                                                <HostControls
                                                    code={code}
                                                    hostToken={hostToken}
                                                    isPasswordProtected={isPasswordProtected}
                                                    onRenamed={setRoomName}
                                                    socket={socketRef.current}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <CodeEditor
                        value={content}
                        onChange={handleInput}
                        textareaRef={textareaRef}
                        placeholder="// Start coding here…"
                    />

                    {/* ── Output panel ─────────────────────────────────────── */}
                    <div
                        className={`absolute right-4 bottom-4 w-80 bg-[#0a0e14] border border-[#1c232c] rounded-lg shadow-2xl transition-all ${outputOpen ? 'h-56' : 'h-9'
                            } overflow-hidden`}
                    >
                        <button
                            className="w-full h-9 flex-shrink-0 flex items-center justify-between px-3 bg-[#0c1117] border-b border-[#1c232c]"
                            onClick={() => setOutputOpen((v) => !v)}
                        >
                            <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                <TerminalIcon className="text-[#00dbe9]" />
                                Output
                            </span>
                            <span className="text-gray-600 text-xs">{outputOpen ? '▾' : '▸'}</span>
                        </button>
                        {outputOpen && (
                            <div className="px-3 py-2 font-mono text-xs text-gray-500 h-[calc(100%-2.25rem)] overflow-y-auto">
                                No execution sandbox connected yet.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

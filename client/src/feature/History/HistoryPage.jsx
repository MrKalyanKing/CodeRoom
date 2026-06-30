import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

import { LogoIcon, UserIcon } from '../../../components/Icons';

export default function HistoryPage({ onBack }) {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [historyList, setHistoryList] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    async function loadRooms() {
        setLoading(true);
        try {
            const data = await api.getHistoryRooms();
            setRooms(data);
        } catch (err) {
            setError(err.message || 'Failed to load history rooms');
        } finally {
            setLoading(false);
        }
    }

    async function handleRoomSelect(code) {
        setSelectedRoom(code);
        setSelectedSnapshot(null);
        setLoading(true);
        try {
            const history = await api.getHistoryByRoom(code);
            setHistoryList(history);
            if (history.length > 0) {
                setSelectedSnapshot(history[history.length - 1]);
            }
        } catch (err) {
            setError(err.message || 'Failed to load room history');
        } finally {
            setLoading(false);
        }
    }

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
                    <span 
                        className="text-gray-500 cursor-pointer hover:text-white transition" 
                        onClick={onBack}
                    >
                        Editor
                    </span>
                    <span className="text-gray-500 cursor-default" title="Coming soon">
                        Rooms
                    </span>
                    <span className="text-[#00dbe9] font-medium border-b-2 border-[#00dbe9] pb-5 -mb-5 cursor-default">
                        History
                    </span>
                    <span className="text-gray-500 cursor-default" title="Coming soon">
                        Settings
                    </span>
                </nav>

                <div className="w-9 h-9 rounded-full border border-[#1c232c] flex items-center justify-center text-gray-400 flex-shrink-0">
                    <UserIcon />
                </div>
            </header>

            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <div className="w-full max-w-7xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Code Conversation History
                    </h1>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/4 flex flex-col gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4 text-purple-300">Select Room</h2>
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {rooms.length === 0 && !loading && (
                                    <p className="text-slate-400 text-sm">No history available yet.</p>
                                )}
                                {rooms.map(code => (
                                    <button
                                        key={code}
                                        onClick={() => handleRoomSelect(code)}
                                        className={`p-3 rounded-lg text-left transition-all ${selectedRoom === code ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                                    >
                                        <span className="font-mono">{code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedRoom && (
                            <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                                <h2 className="text-xl font-semibold mb-4 text-blue-300">Snapshots</h2>
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
                                    {historyList.map(item => (
                                        <button
                                            key={item._id}
                                            onClick={() => setSelectedSnapshot(item)}
                                            className={`p-3 rounded-lg text-left transition-all text-sm ${selectedSnapshot?._id === item._id ? 'bg-blue-500/30 border border-blue-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                                        >
                                            <div className="font-semibold text-slate-200">Version {item.version}</div>
                                            <div className="text-slate-400 text-xs mt-1">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Editor View */}
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                        {loading && !selectedSnapshot ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : selectedSnapshot ? (
                            <>
                                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-mono">Room: <span className="text-white">{selectedSnapshot.roomCode}</span></span>
                                    <span className="text-slate-400">Snapshot from: <span className="text-white">{new Date(selectedSnapshot.createdAt).toLocaleString()}</span></span>
                                </div>
                                <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed text-slate-300 custom-scrollbar whitespace-pre-wrap">
                                    {selectedSnapshot.content || <span className="text-slate-600 italic">Empty document</span>}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <p>Select a room and snapshot to view the code conversation</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}

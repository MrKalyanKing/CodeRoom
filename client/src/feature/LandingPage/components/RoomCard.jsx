import {
    User,
    KeyRound,
    Lock,
    Rocket,
} from "lucide-react";

export default function RoomCard({
    tab,
    switchTab,
    handle,
    setHandle,
    roomName,
    setRoomName,
    roomPassword,
    setRoomPassword,
    code,
    setCode,
    handleCreate,
    handleJoinForm,
    error,
    loading,
}) {

    const inputClass =
        "w-full bg-[#0a0a0d] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition";

    return (
        <div className="w-full max-w-lg rounded-[32px] border border-white/5 bg-[#09090B]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,255,.08)] overflow-hidden">

            {/* ---------------- Tabs ---------------- */}

            <div className="p-6">

                <div className="flex bg-[#111116] rounded-full p-1">

                    <button
                        type="button"
                        onClick={() => switchTab("join")}
                        className={`flex-1 py-3 rounded-full transition ${
                            tab === "join"
                                ? "bg-[#232329] text-cyan-400"
                                : "text-gray-400"
                        }`}
                    >
                        Join Room
                    </button>

                    <button
                        type="button"
                        onClick={() => switchTab("create")}
                        className={`flex-1 py-3 rounded-full transition ${
                            tab === "create"
                                ? "bg-[#232329] text-cyan-400"
                                : "text-gray-400"
                        }`}
                    >
                        Create Room
                    </button>

                </div>

            </div>

            {/* ---------------- Form ---------------- */}

            <form
                onSubmit={tab === "create" ? handleCreate : handleJoinForm}
                className="px-8 pb-8 space-y-6"
            >

                {/* NAME */}

                <div>

                    <label className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-3 block">
                        Identity
                    </label>

                    <div className="relative">

                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Alice"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className={inputClass}
                        />

                    </div>

                </div>

                {/* ---------------- CREATE ROOM ---------------- */}

                {tab === "create" && (
                    <>

                        {/* ROOM NAME */}

                        <div>

                            <label className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-3 block">
                                Room Name
                            </label>

                            <div className="relative">

                                <KeyRound
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Sprint Session"
                                    value={roomName}
                                    onChange={(e) =>
                                        setRoomName(e.target.value)
                                    }
                                    className={inputClass}
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-3 block">
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="password"
                                    placeholder="Optional"
                                    value={roomPassword}
                                    onChange={(e) =>
                                        setRoomPassword(e.target.value)
                                    }
                                    className={inputClass}
                                />

                            </div>

                        </div>

                    </>
                )}

                {/* ---------------- JOIN ROOM ---------------- */}

                {tab === "join" && (
                    <div>

                        <label className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-3 block">
                            Room Code
                        </label>

                        <div className="relative">

                            <KeyRound
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                type="text"
                                value={code}
                                placeholder="ABC123"
                                maxLength={6}
                                onChange={(e) =>
                                    setCode(e.target.value.toUpperCase())
                                }
                                className={inputClass}
                            />

                        </div>

                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* BUTTON */}

                <button
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 py-4 font-bold uppercase tracking-widest text-black shadow-[0_0_40px_rgba(0,255,255,.35)] transition hover:scale-[1.02]"
                >

                    <span className="flex items-center justify-center gap-3">

                        <Rocket size={18} />

                        {loading
                            ? tab === "join"
                                ? "Joining..."
                                : "Creating..."
                            : tab === "join"
                            ? "Join Room"
                            : "Create Room"}

                    </span>

                </button>

                 {/* Bottom Info */}

                <div className="flex items-center justify-center gap-8 pt-2 text-xs text-gray-500">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

                        <span>1,284 Active Rooms</span>

                    </div>

                    <div className="flex items-center gap-2">

                        <Lock size={12} />

                        <span>E2E Encrypted</span>

                    </div>

                </div>

            </form>

        </div>
    );
}               
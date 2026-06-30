export function PasswordStep({
    pendingRoom,
    roomPassword,
    setRoomPassword,
    handleJoinPassword,
    loading,
    error,
    resetJoin
}) {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-[#58a6ff] tracking-tight">CodeRoom</h1>
                <p className="text-gray-500 text-sm mt-1">Collaborative code editing — no frills, no lag.</p>
            </header>

            <div className="bg-[#161b22] rounded-xl w-full max-w-md shadow-2xl border border-[#30363d] overflow-hidden p-6">
                <div className="flex items-center gap-3 mb-5 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    <span className="text-xl" aria-hidden="true">🔒</span>
                    <div>
                        <p className="text-white font-medium text-sm">{pendingRoom.name}</p>
                        <p className="text-gray-500 text-xs">This room is password-protected</p>
                    </div>
                </div>

                <form onSubmit={handleJoinPassword} className="space-y-4">
                    <div>
                        <label htmlFor="roomPassword" className="block text-sm text-gray-400 mb-1.5">Room password</label>
                        <input
                            id="roomPassword"
                            type="password"
                            placeholder="Enter password"
                            value={roomPassword}
                            onChange={(e) => setRoomPassword(e.target.value)}
                            autoFocus
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#58a6ff] transition-colors text-sm"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        className="w-full bg-[#1f6feb] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#388bfd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Verifying…' : 'Enter Room'}
                    </button>
                </form>

                <button
                    className="mt-4 text-gray-500 text-sm hover:text-gray-300 transition-colors"
                    onClick={resetJoin}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}

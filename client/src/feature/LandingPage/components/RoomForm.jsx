export function RoomForm({
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
    loading
}) {
    const inputClass =
        'w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#58a6ff] transition-colors text-sm';

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-[#58a6ff] tracking-tight">CodeRoom</h1>
                <p className="text-gray-500 text-sm mt-1">Collaborative code editing — no frills, no lag.</p>
            </header>

            <div className="bg-[#161b22] rounded-xl w-full max-w-md shadow-2xl border border-[#30363d] overflow-hidden">
                <div className="flex border-b border-[#30363d]">
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                            tab === 'join'
                                ? 'border-[#58a6ff] text-[#58a6ff]'
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                        onClick={() => switchTab('join')}
                    >
                        Join Room
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                            tab === 'create'
                                ? 'border-[#58a6ff] text-[#58a6ff]'
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                        onClick={() => switchTab('create')}
                    >
                        Create Room
                    </button>
                </div>

                <form onSubmit={tab === 'create' ? handleCreate : handleJoinForm} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="handle" className="block text-sm text-gray-400 mb-1.5">Your name</label>
                        <input
                            id="handle"
                            type="text"
                            placeholder="e.g. Alice"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            maxLength={30}
                            autoFocus
                            className={inputClass}
                        />
                    </div>

                    {tab === 'create' && (
                        <>
                            <div>
                                <label htmlFor="roomName" className="block text-sm text-gray-400 mb-1.5">Room name</label>
                                <input
                                    id="roomName"
                                    type="text"
                                    placeholder="e.g. Sprint Session"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    maxLength={50}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="createPassword" className="block text-sm text-gray-400 mb-1.5">
                                    Password{' '}
                                    <span className="text-gray-600">(optional)</span>
                                </label>
                                <input
                                    id="createPassword"
                                    type="password"
                                    placeholder="Leave empty for open room"
                                    value={roomPassword}
                                    onChange={(e) => setRoomPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </>
                    )}

                    {tab === 'join' && (
                        <div>
                            <label htmlFor="code" className="block text-sm text-gray-400 mb-1.5">Room code</label>
                            <input
                                id="code"
                                type="text"
                                placeholder="E.G. ABC123"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}
                                className={inputClass}
                            />
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        className="w-full bg-[#1f6feb] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#388bfd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Loading…' : tab === 'create' ? 'Create Room' : 'Join Room'}
                    </button>
                </form>
            </div>
        </div>
    );
}

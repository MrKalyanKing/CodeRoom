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
    return (
        <div className="landing">
            <header className="landing-header">
                <h1 className="logo">CodeRoom</h1>
                <p className="tagline">Collaborative code editing — no frills, no lag.</p>
            </header>

            <div className="card">
                <div className="tab-row">
                    <button
                        className={`tab-btn ${tab === 'join' ? 'active' : ''}`}
                        onClick={() => switchTab('join')}
                    >
                        Join Room
                    </button>
                    <button
                        className={`tab-btn ${tab === 'create' ? 'active' : ''}`}
                        onClick={() => switchTab('create')}
                    >
                        Create Room
                    </button>
                </div>

                <form onSubmit={tab === 'create' ? handleCreate : handleJoinForm}>
                    <div className="field">
                        <label htmlFor="handle">Your name</label>
                        <input
                            id="handle"
                            type="text"
                            placeholder="e.g. Alice"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            maxLength={30}
                            autoFocus
                        />
                    </div>

                    {tab === 'create' && (
                        <>
                            <div className="field">
                                <label htmlFor="roomName">Room name</label>
                                <input
                                    id="roomName"
                                    type="text"
                                    placeholder="e.g. Sprint Session"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    maxLength={50}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="createPassword">
                                    Password{' '}
                                    <span className="optional-label">(optional)</span>
                                </label>
                                <input
                                    id="createPassword"
                                    type="password"
                                    placeholder="Leave empty for open room"
                                    value={roomPassword}
                                    onChange={(e) => setRoomPassword(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {tab === 'join' && (
                        <div className="field">
                            <label htmlFor="code">Room code</label>
                            <input
                                id="code"
                                type="text"
                                placeholder="e.g. ABC123"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}
                            />
                        </div>
                    )}

                    {error && <p className="error-msg">{error}</p>}

                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Loading…' : tab === 'create' ? 'Create Room' : 'Join Room'}
                    </button>
                </form>
            </div>
        </div>
    );
}

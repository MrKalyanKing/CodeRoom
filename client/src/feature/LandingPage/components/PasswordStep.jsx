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
        <div className="landing">
            <header className="landing-header">
                <h1 className="logo">CodeRoom</h1>
                <p className="tagline">Collaborative code editing — no frills, no lag.</p>
            </header>

            <div className="card">
                <div className="auth-room-header">
                    <span className="lock-icon" aria-hidden="true">🔒</span>
                    <div>
                        <p className="auth-room-name">{pendingRoom.name}</p>
                        <p className="auth-room-sub">This room is password-protected</p>
                    </div>
                </div>

                <form onSubmit={handleJoinPassword}>
                    <div className="field">
                        <label htmlFor="roomPassword">Room password</label>
                        <input
                            id="roomPassword"
                            type="password"
                            placeholder="Enter password"
                            value={roomPassword}
                            onChange={(e) => setRoomPassword(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Verifying…' : 'Enter Room'}
                    </button>
                </form>

                <button className="btn-ghost btn-back" onClick={resetJoin}>
                    ← Back
                </button>
            </div>
        </div>
    );
}

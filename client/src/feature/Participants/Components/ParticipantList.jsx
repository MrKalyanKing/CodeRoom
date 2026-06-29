export default function ParticipantList({ participants, currentSocketId, isHost, onKick }) {
    return (
        <div className="px-4 py-3 border-b border-[#30363d]">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Participants ({participants.length})
            </h3>
            <ul className="space-y-1.5">
                {participants.map((p) => (
                    <li key={p.socketId} className="flex items-center gap-2 group">
                        <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                p.isHost ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                        />
                        <span className="text-sm text-gray-300 flex-1 truncate">
                            {p.handle}
                            {p.socketId === currentSocketId && ' (you)'}
                            {p.isHost && ' ★'}
                        </span>
                        {isHost && p.socketId !== currentSocketId && (
                            <button
                                className="text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={() => onKick(p.socketId)}
                                title={`Kick ${p.handle}`}
                            >
                                ✕
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

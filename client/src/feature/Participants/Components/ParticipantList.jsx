import Avatar from '../../../components/Avatar';
import { EyeIcon, PencilIcon } from '../../../components/Icons';

export default function ParticipantList({ participants, currentSocketId, isHost, onKick }) {
    return (
        <div className="px-4 py-4">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                Participants ({participants.length})
            </h3>
            <ul className="space-y-2.5">
                {participants.map((p) => {
                    const isMe = p.socketId === currentSocketId;
                    return (
                        <li
                            key={p.socketId}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                                isMe
                                    ? 'bg-[#00dbe9]/10 border border-[#00dbe9]/40'
                                    : 'border border-transparent hover:bg-white/[0.03]'
                            }`}
                        >
                            <Avatar name={p.handle} size={44} />
                            <span className="text-[15px] text-gray-100 font-medium flex-1 truncate">
                                {p.handle}
                                {isMe && <span className="text-gray-500 font-normal"> (you)</span>}
                                {p.isHost && <span className="text-amber-400"> ★</span>}
                            </span>

                            {isMe ? (
                                <PencilIcon className="text-[#00dbe9] flex-shrink-0" />
                            ) : (
                                <EyeIcon className="text-gray-600 flex-shrink-0" />
                            )}

                            {isHost && !isMe && (
                                <button
                                    className="text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                    onClick={() => onKick(p.socketId)}
                                    title={`Kick ${p.handle}`}
                                >
                                    ✕
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

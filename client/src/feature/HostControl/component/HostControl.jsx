import { useState } from 'react';
import { api } from '../../../lib/api';

export default function HostControls({ code, hostToken, isPasswordProtected: initialPwProtected, onRenamed, socket }) {
    const [renaming, setRenaming] = useState(false);
    const [newName, setNewName] = useState('');
    const [renameError, setRenameError] = useState('');

    const [pwSection, setPwSection] = useState(null); // null | 'set' | 'change' | 'remove'
    const [newPassword, setNewPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwLoading, setPwLoading] = useState(false);
    const [isPasswordProtected, setIsPasswordProtected] = useState(initialPwProtected);

    function handleRename(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        setRenameError('');
        if (socket && socket.connected) {
            socket.emit('rename-room', { name: newName.trim() });
            onRenamed(newName.trim());
            setNewName('');
            setRenaming(false);
        } else {
            setRenameError('Not connected');
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();
        if (pwSection !== 'remove' && !newPassword.trim()) {
            return setPwError('Enter a password');
        }
        setPwError('');
        setPwLoading(true);
        try {
            if (pwSection === 'remove') {
                await api.updateRoom(code, hostToken, { removePassword: true });
                setIsPasswordProtected(false);
            } else {
                await api.updateRoom(code, hostToken, { password: newPassword.trim() });
                setIsPasswordProtected(true);
            }
            setNewPassword('');
            setPwSection(null);
        } catch (err) {
            setPwError(err.message);
        } finally {
            setPwLoading(false);
        }
    }

    const ghostBtnClass =
        'w-full text-left text-sm text-gray-300 border border-[#1c232c] rounded px-3 py-2 hover:border-gray-500 hover:text-white transition-colors';
    const inputClass =
        'w-full bg-[#05080c] border border-[#1c232c] rounded px-3 py-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00dbe9] text-sm transition-colors';

    return (
        <div className="px-4 py-2">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Host Controls</h3>

            {/* ── Rename ── */}
            {!renaming ? (
                <button className={`${ghostBtnClass} mb-2`} onClick={() => setRenaming(true)}>
                    Rename Room
                </button>
            ) : (
                <form onSubmit={handleRename} className="mb-2 space-y-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New room name"
                        maxLength={50}
                        autoFocus
                        className={inputClass}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-[#00dbe9] text-[#04181c] rounded px-2 py-1 text-xs font-bold hover:bg-[#33e4ef] transition-colors"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="flex-1 border border-[#1c232c] text-gray-400 rounded px-2 py-1 text-xs hover:text-white hover:border-gray-500 transition-colors"
                            onClick={() => { setRenaming(false); setRenameError(''); }}
                        >
                            Cancel
                        </button>
                    </div>
                    {renameError && <p className="text-red-400 text-xs">{renameError}</p>}
                </form>
            )}

            {/* ── Password management ── */}
            {pwSection === null ? (
                <div className="space-y-2">
                    {isPasswordProtected ? (
                        <>
                            <button className={ghostBtnClass} onClick={() => setPwSection('change')}>
                                Change Password
                            </button>
                            <button
                                className="w-full text-left text-sm text-red-400 border border-[#1c232c] rounded px-3 py-2 hover:border-red-700 hover:text-red-300 transition-colors"
                                onClick={() => setPwSection('remove')}
                            >
                                Remove Password
                            </button>
                        </>
                    ) : (
                        <button className={ghostBtnClass} onClick={() => setPwSection('set')}>
                            Set Password
                        </button>
                    )}
                </div>
            ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-2">
                    {pwSection === 'remove' ? (
                        <p className="text-gray-400 text-xs">Remove password? Anyone with the code can join.</p>
                    ) : (
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={pwSection === 'change' ? 'New password' : 'Room password'}
                            autoFocus
                            className={inputClass}
                        />
                    )}
                    {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-[#00dbe9] text-[#04181c] rounded px-2 py-1 text-xs font-bold hover:bg-[#33e4ef] transition-colors disabled:opacity-50"
                            disabled={pwLoading}
                        >
                            {pwLoading ? '…' : pwSection === 'remove' ? 'Confirm' : 'Save'}
                        </button>
                        <button
                            type="button"
                            className="flex-1 border border-[#1c232c] text-gray-400 rounded px-2 py-1 text-xs hover:text-white hover:border-gray-500 transition-colors"
                            onClick={() => { setPwSection(null); setNewPassword(''); setPwError(''); }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

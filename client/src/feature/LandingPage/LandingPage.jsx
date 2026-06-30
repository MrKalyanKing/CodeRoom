import { useState } from 'react';
import { api } from '../../lib/api';
import { PasswordStep } from './components/PasswordStep';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RoomCard from "./components/RoomCard";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function LandingPage({ onEnterRoom }) {
    const [tab, setTab] = useState('join'); // 'join' | 'create'
    const [handle, setHandle] = useState('');
    const [roomName, setRoomName] = useState('');
    const [code, setCode] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [joinStep, setJoinStep] = useState('form'); // 'form' | 'password'
    const [pendingRoom, setPendingRoom] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function resetJoin() {
        setJoinStep('form');
        setPendingRoom(null);
        setRoomPassword('');
        setError('');
    }

    function switchTab(t) {
        setTab(t);
        setError('');
        resetJoin();
        setRoomPassword('');
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!handle.trim()) return setError('Enter your name');
        if (!roomName.trim()) return setError('Enter a room name');
        setError('');
        setLoading(true);
        try {
            const room = await api.createRoom(roomName.trim(), roomPassword.trim() || undefined);
            onEnterRoom({
                code: room.code,
                roomName: room.name,
                handle: handle.trim(),
                hostToken: room.hostToken,
                isHost: true,
                isPasswordProtected: room.isPasswordProtected,
                roomToken: null,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleJoinForm(e) {
        e.preventDefault();
        if (!handle.trim()) return setError('Enter your name');
        if (!code.trim()) return setError('Enter a room code');
        setError('');
        setLoading(true);
        try {
            const roomInfo = await api.getRoomInfo(code.trim().toUpperCase());
            if (roomInfo.isPasswordProtected) {
                setPendingRoom(roomInfo);
                setJoinStep('password');
            } else {
                const room = await api.joinRoom(roomInfo.code);
                onEnterRoom({
                    code: room.code,
                    roomName: room.name,
                    handle: handle.trim(),
                    hostToken: null,
                    isHost: false,
                    isPasswordProtected: false,
                    roomToken: null,
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleJoinPassword(e) {
        e.preventDefault();
        if (!roomPassword.trim()) return setError('Enter the room password');
        setError('');
        setLoading(true);
        try {
            const { roomToken } = await api.authRoom(pendingRoom.code, roomPassword.trim());
            const room = await api.joinRoom(pendingRoom.code, { roomToken });
            onEnterRoom({
                code: room.code,
                roomName: room.name,
                handle: handle.trim(),
                hostToken: null,
                isHost: false,
                isPasswordProtected: true,
                roomToken,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (tab === 'join' && joinStep === 'password') {
        return (
            <PasswordStep 
                pendingRoom={pendingRoom}
                roomPassword={roomPassword}
                setRoomPassword={setRoomPassword}
                handleJoinPassword={handleJoinPassword}
                loading={loading}
                error={error}
                resetJoin={resetJoin}
            />
        );
    }

    return (
       <main className="relative min-h-screen bg-[#050608] text-white overflow-hidden">

    <Navbar />

    <Hero>
        <RoomCard
            tab={tab}
            switchTab={switchTab}
            handle={handle}
            setHandle={setHandle}
            roomName={roomName}
            setRoomName={setRoomName}
            roomPassword={roomPassword}
            setRoomPassword={setRoomPassword}
            code={code}
            setCode={setCode}
            handleCreate={handleCreate}
            handleJoinForm={handleJoinForm}
            error={error}
            loading={loading}
        />
    </Hero>

    <Features />

    <Footer />

</main>
    )
}

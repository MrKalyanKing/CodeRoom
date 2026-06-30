import { CircleUserRound } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#06070A]/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}

                <h1 className="text-3xl font-extrabold tracking-tight">
                    <span className="text-white">Code</span>
                    <span className="text-cyan-400">Room</span>
                </h1>

                {/* Navigation */}

                <ul className="hidden md:flex items-center gap-10">

                    <li>
                        <a
                            href="#"
                            className="text-cyan-400 border-b-2 border-cyan-400 pb-1 font-medium"
                        >
                            Editor
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Rooms
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                        >
                            History
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Settings
                        </a>
                    </li>

                </ul>

                {/* Profile */}

                <button className="text-cyan-400 hover:scale-110 transition">
                    <CircleUserRound size={26} />
                </button>

            </div>
        </nav>
    );
}
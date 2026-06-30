import { Code2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 mt-24">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Logo */}

                    <div>

                        <h2 className="text-3xl font-black">

                            <span className="text-white">
                                Code
                            </span>

                            <span className="text-cyan-400">
                                Room
                            </span>

                        </h2>

                        <p className="mt-3 text-gray-500 max-w-sm">

                            High-performance collaborative coding
                            built for modern engineering teams.

                        </p>

                    </div>

                    {/* Links */}

                    <div className="flex gap-8 text-gray-400">

                        <a href="#" className="hover:text-cyan-400 transition">
                            Editor
                        </a>

                        <a href="#" className="hover:text-cyan-400 transition">
                            Rooms
                        </a>

                        <a href="#" className="hover:text-cyan-400 transition">
                            Docs
                        </a>

                        <a href="#" className="hover:text-cyan-400 transition">
                            Contact
                        </a>

                    </div>

                    {/* Social */}

                    <div className="flex gap-4">

                        <button className="w-11 h-11 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition">

                            {/* <Github size={18}/> */}

                        </button>

                        <button className="w-11 h-11 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition">

                            {/* <Linkedin size={18}/> */}

                        </button>

                        <button className="w-11 h-11 rounded-full bg-[#0d1117] border border-white/10 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition">

                            {/* <Twitter size={18}/> */}

                        </button>

                    </div>

                </div>

                <div className="border-t border-white/5 mt-10 pt-8 text-center text-gray-500 text-sm">

                    © 2026 CodeRoom. Built for developers who love
                    beautiful software.

                </div>

            </div>

        </footer>
    );
}
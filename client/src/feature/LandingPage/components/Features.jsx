import {
    Shield,
    Zap,
    Infinity,
    Code2,
    MonitorSmartphone,
} from "lucide-react";

export default function Features() {
    return (
        <section className="relative overflow-hidden py-24">

            {/* Background Glow */}

            <div className="absolute left-[-200px] bottom-20 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[180px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Top Section */}

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Editor Preview */}

                    <div className="relative">

                        <div className="rounded-3xl border border-white/10 bg-[#0a0a0d] overflow-hidden shadow-2xl">

                            <img
                                src="https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29kZXxlbnwwfHwwfHx8MA%3D%3D"
                                alt="Editor"
                                className="w-full h-[330px] object-cover"
                            />

                            <div className="absolute bottom-8 left-8">

                                <span className="px-3 py-1  rounded-full bg-cyan-500/20 text-cyan-900 text-xs uppercase tracking-widest">
                                    Live Session
                                </span>

                                <h3 className="mt-3 text-2xl text-black font-semibold">
                                    Collaborative Code Session
                                </h3>

                                <p className="text-black mt-1">
                                    Building the next generation of web applications
                                </p>

                            </div>

                            <div className="absolute bottom-4 left-8 right-8 h-1 rounded-full bg-white/10">

                                <div className="h-full w-3/4 bg-cyan-400 rounded-full" />

                            </div>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div>

                        <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs uppercase tracking-widest">
                            Elite Engineering Experience
                        </span>

                        <h2 className="mt-8 text-5xl font-bold leading-tight">

                            The new gold standard

                            <br />

                            for

                            <span className="text-cyan-400">
                                {" "}remote pair programming.
                            </span>

                        </h2>

                        <p className="mt-6 text-gray-400 leading-8">

                            CodeRoom leverages ultra low-latency
                            synchronization so your cursor, code,
                            and ideas stay perfectly in sync.

                        </p>

                        <div className="grid sm:grid-cols-2 gap-8 mt-12">

                            <div className="flex gap-4">

                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                                    <Code2 className="text-cyan-400" />

                                </div>

                                <div>

                                    <h4 className="font-semibold">
                                        Instant Sharing
                                    </h4>

                                    <p className="text-gray-500 text-sm">
                                        Generate secure room codes
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                                    <MonitorSmartphone className="text-cyan-400" />

                                </div>

                                <div>

                                    <h4 className="font-semibold">
                                        Code History
                                    </h4>

                                    <p className="text-gray-500 text-sm">
                                        Time-travel through code changes
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Cards */}

                <div className="grid md:grid-cols-3 gap-8 mt-24">

                    <div className="rounded-3xl bg-[#09090b] border border-white/10 p-8 hover:border-cyan-500 transition">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">

                            <Zap className="text-cyan-400" />

                        </div>

                        <h3 className="text-2xl font-semibold">
                            Real-time Collaboration
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Experience zero-lag code synchronization. See your teammates' cursors and edits as they type.
                        </p>

                    </div>

                    <div className="rounded-3xl bg-[#09090b] border border-white/10 p-8 hover:border-cyan-500 transition">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">

                            <Shield className="text-cyan-400" />

                        </div>

                        <h3 className="text-2xl font-semibold">
                            Secure Rooms
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Protect your collaborative sessions with room passwords and explicit host controls.
                        </p>

                    </div>

                    <div className="rounded-3xl bg-[#09090b] border border-white/10 p-8 hover:border-cyan-500 transition">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">

                            <Infinity className="text-cyan-400" />

                        </div>

                        <h3 className="text-2xl font-semibold">
                            Code Snapshots
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Automatically save session history. Review past iterations and code discussions anytime.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}
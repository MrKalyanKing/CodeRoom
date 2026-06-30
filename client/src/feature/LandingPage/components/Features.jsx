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
                                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80"
                                alt="Editor"
                                className="w-full h-[330px] object-cover"
                            />

                            <div className="absolute bottom-8 left-8">

                                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs uppercase tracking-widest">
                                    Live Session
                                </span>

                                <h3 className="mt-3 text-2xl font-semibold">
                                    Alpha Project Core
                                </h3>

                                <p className="text-gray-400 mt-1">
                                    Refactoring the renderer for version 2.4
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
                                        VS Code Sync
                                    </h4>

                                    <p className="text-gray-500 text-sm">
                                        Direct plugin support
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                                    <MonitorSmartphone className="text-cyan-400" />

                                </div>

                                <div>

                                    <h4 className="font-semibold">
                                        HD Voice / Video
                                    </h4>

                                    <p className="text-gray-500 text-sm">
                                        Integrated communication
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
                            Liquid Latency
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Under 15ms global synchronization powered by our
                            liquid-state engine.
                        </p>

                    </div>

                    <div className="rounded-3xl bg-[#09090b] border border-white/10 p-8 hover:border-cyan-500 transition">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">

                            <Shield className="text-cyan-400" />

                        </div>

                        <h3 className="text-2xl font-semibold">
                            Obsidian Security
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Military-grade encryption keeps every room safe
                            and completely private.
                        </p>

                    </div>

                    <div className="rounded-3xl bg-[#09090b] border border-white/10 p-8 hover:border-cyan-500 transition">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">

                            <Infinity className="text-cyan-400" />

                        </div>

                        <h3 className="text-2xl font-semibold">
                            Infinite Canvas
                        </h3>

                        <p className="text-gray-400 mt-4 leading-7">
                            Sketch diagrams, architecture,
                            and ideas beside your code effortlessly.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}
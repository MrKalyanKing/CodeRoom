export default function Hero({ children }) {
    return (
        <section className="relative overflow-hidden">

            {/* Left Glow */}

            <div className="absolute left-[-250px] top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[180px]" />

            {/* Right Glow */}

            <div className="absolute right-[-200px] bottom-20 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[180px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

                <div className="text-center">

                    <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">

                        <span className="text-white">
                            Collaborate in
                        </span>{" "}

                        <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                            Flow.
                        </span>

                    </h1>

                    <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">

                        Step into a high-pressure coding environment designed
                        for elite engineering teams.

                        <br />

                        Secure, real-time, and built on liquid logic.

                    </p>

                </div>

                {/* Room Card */}

                <div className="mt-16 flex justify-center">

                    {children}

                </div>

            </div>

        </section>
    );
}
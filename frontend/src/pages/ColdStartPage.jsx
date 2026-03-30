export default function ColdStartPage({ error }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#38bdf8_0%,_#0f172a_48%,_#020617_100%)] px-6 py-16 text-white">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-xl rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    Kaarya
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Server is starting from cold start.
                </h1>

                <p className="mt-4 text-sm leading-6 text-white/75 sm:text-base">
                    Please wait a few seconds. The app will open automatically once the service is ready.
                </p>

                <div className="mt-8">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" />
                    </div>
                </div>

                {error ? (
                    <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                        {error}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

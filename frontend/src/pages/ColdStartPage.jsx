export default function ColdStartPage({ attempt, error }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#38bdf8_0%,_#0f172a_48%,_#020617_100%)] px-6 py-16 text-white">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-2xl rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                    Waking up the Kaarya backend
                </div>

                <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    Kaarya is starting up. This can take a few seconds on the first request.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                    The frontend is ready. We are waiting for the backend service to respond so your board data can load smoothly.
                </p>

                <div className="mt-8">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" />
                    </div>
                    <div className="mt-3 text-sm text-white/70">
                        Health check attempts: {attempt}
                    </div>
                </div>

                <div className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                        <div className="font-medium text-white">Frontend</div>
                        <div className="mt-1">Ready and waiting</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                        <div className="font-medium text-white">Backend</div>
                        <div className="mt-1">Checking `/health`</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                        <div className="font-medium text-white">Database</div>
                        <div className="mt-1">Will connect after API wake-up</div>
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

const startupLines = [
    'INCOMING REQUEST DETECTED...',
    'SERVICE WAKING UP...',
    'ALLOCATING COMPUTE RESOURCES...',
    'PREPARING INSTANCE FOR INITIALIZATION...',
];

export default function ColdStartPage({ error }) {
    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b0c] px-4 py-4 text-[#e8e5df] sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col rounded-[24px] border border-white/8 bg-[#111112] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-white/90" />
                        <span className="text-lg font-semibold tracking-tight text-white">Kaarya</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55 sm:text-[11px]">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full border border-white/30" />
                        <span>Application Loading</span>
                    </div>
                </div>

                <div className="px-5 py-5 sm:px-7 sm:py-6">
                    <div className="space-y-5 font-mono">
                        <div className="space-y-2 text-[10px] uppercase tracking-[0.18em] text-white/36 sm:text-[11px]">
                            {startupLines.map((line, index) => (
                                <div key={line} className="flex gap-3">
                                    <span className="w-18 shrink-0 text-white/22">
                                        12:41:{20 + index * 3}
                                    </span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-[18px] border border-white/8 bg-[#0d0d0e] px-4 py-5 shadow-inner sm:px-5 sm:py-6">
                            <div className="rounded-[16px] border border-dashed border-white/10 px-4 py-6 text-center sm:px-5 sm:py-7">
                                <div className="font-mono text-[clamp(2.2rem,8vw,4.75rem)] font-semibold uppercase tracking-[0.18em] text-white/86 [text-shadow:0_0_18px_rgba(255,255,255,0.08)]">
                                    KAARYA
                                </div>
                                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-white/28 sm:text-[10px]">
                                    warming the workspace
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-px bg-white/8" />
                            <div className="h-px w-3/4 bg-white/6" />
                        </div>

                        <div>
                            <p className="font-sans text-lg font-medium tracking-tight text-white sm:text-xl">
                                Server is starting from cold start.
                            </p>
                            <p className="mt-2 max-w-lg font-sans text-sm leading-6 text-white/56 sm:text-[15px]">
                                Please wait a few seconds. Kaarya will open automatically once the service is ready.
                            </p>
                        </div>

                        {error ? (
                            <div className="rounded-2xl border border-[#6c5540] bg-[#1a1511] px-4 py-3 font-sans text-sm text-[#e5c8a7]">
                                {error}
                            </div>
                        ) : null}

                        <div className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8b79cc] sm:text-[11px]">
                            Cold start in progress
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"


import {useState } from 'react'
import axios from 'axios'




export default function loginRegister(){ 
    const [email, setEmail ] = useState<string>('')
    const [password, setPassword ] = useState<string>('')
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)


    const handleLogin = async(e:any) => { 
        e.preventDefault(); 
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login/lender`, { 
                email:email,
                password:password
            })
       
            localStorage.setItem("user_id", res.data.id)
            setNotice({ type: 'success', message: 'Welcome back! Redirecting you to your lender workspace...' })
            setTimeout(() => { window.location.href = '/loginLender' }, 1200)

        }
        catch(err){ 
            console.error("Failed to login", err)
            let message = 'Login failed. Please check your details and try again.'
            if (axios.isAxiosError(err)) {
                const data = err.response?.data as { message?: string; error?: string; detail?: string } | undefined
                const serverMessage = data?.message || data?.error || data?.detail
                if (serverMessage) {
                    message = String(serverMessage)
                } else if (!err.response) {
                    message = 'Network error. Please check your connection and try again.'
                }
            }
            setNotice({ type: 'error', message })
            setTimeout(() => setNotice(null), 6000)
        }
    }
    return(
        <div className="flex min-h-screen flex-col bg-white lg:flex-row">
            {notice && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-[0_18px_45px_-18px_rgba(12,74,110,0.55)] backdrop-blur-2xl backdrop-saturate-150 ${
                        notice.type === 'success'
                            ? 'border-cyan-300/60 bg-[linear-gradient(180deg,rgba(236,254,255,0.95)_0%,rgba(207,250,254,0.88)_100%)] text-cyan-950'
                            : 'border-red-300/60 bg-[linear-gradient(180deg,rgba(254,242,242,0.95)_0%,rgba(254,226,226,0.88)_100%)] text-red-900'
                    }`}
                >
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_8px_-2px_rgba(12,74,110,0.45)] ${notice.type === 'success' ? 'bg-cyan-600' : 'bg-red-600'}`}>
                        {notice.type === 'success' ? (
                            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3 text-white">
                                <path d="M4 10.5l3.5 3.5L16 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3 text-white">
                                <path d="M10 5v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                <circle cx="10" cy="14.5" r="1.2" fill="currentColor" />
                            </svg>
                        )}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                            {notice.type === 'success' ? 'Signing you in...' : 'Login error'}
                        </p>
                        <p className="mt-0.5 text-sm opacity-80">{notice.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setNotice(null)}
                        aria-label="Dismiss notification"
                        className="shrink-0 rounded-full p-1 opacity-60 transition hover:bg-white/60 hover:opacity-100"
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Left half: what MIZANI offers lenders */}
            <section className="relative flex w-full flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#040815_0%,#0a1230_45%,#0b1d3f_100%)] p-8 text-white lg:w-1/2 lg:p-12">
                {/* Animated background */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="lender-aurora absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                    <div className="lender-aurora-reverse absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="lender-pulse absolute left-1/3 top-1/3 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2">
                        <div className="lender-orbit h-full w-full rounded-full border border-cyan-300/15" />
                    </div>
                    <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2">
                        <div className="lender-orbit-reverse h-full w-full rounded-full border border-dashed border-indigo-200/15" />
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lender-float absolute left-[12%] top-[18%] h-8 w-8 text-cyan-300/30">
                        <path d="M3 21h18" />
                        <path d="M5 21V7l7-4 7 4v14" />
                        <path d="M9 21v-6h6v6" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lender-float-slow absolute right-[14%] top-[30%] h-10 w-10 text-indigo-200/25" style={{ animationDelay: '1.4s' }}>
                        <path d="M3 3v18h18" />
                        <path d="M7 15l4-4 3 3 5-6" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lender-float absolute bottom-[20%] left-[22%] h-6 w-6 text-sky-200/30" style={{ animationDelay: '0.7s' }}>
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M3 12h18" />
                    </svg>
                    <span className="lender-pulse absolute left-[30%] top-[32%] h-2 w-2 rounded-full bg-cyan-300/70" style={{ animationDelay: '0.4s' }} />
                    <span className="lender-float-slow absolute right-[26%] bottom-[24%] h-1.5 w-1.5 rounded-full bg-indigo-200/70" style={{ animationDelay: '1.8s' }} />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 ring-1 ring-cyan-300/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-cyan-300">
                                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                <path d="M7 21h10" />
                                <path d="M12 3v18" />
                                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold tracking-tight">MIZANI</span>
                    </div>

                    <p className="mt-10 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan-200 ring-1 ring-cyan-300/25">
                        Lender &amp; Finance Intelligence
                    </p>

                    <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        Deploy capital with confidence, backed by evidence.
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-slate-100/80">
                        MIZANI gives lenders the intelligence to assess contractors, track infrastructure delivery and
                        price risk with data that reflects what is actually happening on the ground.
                    </p>

                    <ul className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            "Contractor Risk Scoring",
                            "Project Delivery Tracking",
                            "Portfolio Visibility",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-cyan-300">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 max-w-md text-sm leading-relaxed text-slate-100/70">
                        Score contractors on real delivery evidence, monitor project milestones as they happen, and keep
                        a clear view of exposure across your entire lending portfolio.
                    </p>
                </div>

                <p className="relative mt-10 text-xs text-cyan-100/40">
                    © MIZANI. Turning procurement data into commercial advantage.
                </p>
            </section>

            {/* Right half: lender login form */}
            <section className="relative flex w-full items-center justify-center overflow-hidden bg-slate-50 p-6 sm:p-10 lg:w-1/2">
                {/* Soft light behind the glass card */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="lender-pulse absolute -left-16 top-12 h-64 w-64 rounded-full bg-cyan-200/50 blur-3xl" />
                    <div className="lender-aurora absolute -right-20 bottom-4 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/60 blur-3xl" />
                </div>

                <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.92)_0%,rgba(239,246,255,0.75)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_-30px_60px_-40px_rgba(6,182,212,0.18),0_24px_60px_-24px_rgba(12,74,110,0.35)] backdrop-blur-[18px] backdrop-saturate-[140%] sm:p-12">
                    {/* Glass sheen */}
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-0 top-0 h-px bg-white/95" />
                        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_70%)]" />
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,rgba(6,182,212,0)_70%)]" />
                    </div>

                    <div className="relative">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/70 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cyan-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.15)]" />
                            Lender access
                        </span>

                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Sign in to your MIZANI lender workspace.
                        </p>

                        <form onSubmit={handleLogin} className="mt-9 space-y-5">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        required
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(12,74,110,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-slate-400/90 focus:border-cyan-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(6,182,212,0.5),0_0_0_2px_rgba(6,182,212,0.25),0_8px_20px_-10px_rgba(12,74,110,0.3)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <rect x="4" y="10" width="16" height="11" rx="2" />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                            <path d="M12 15v2" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        required
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(12,74,110,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-slate-400/90 focus:border-cyan-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(6,182,212,0.5),0_0_0_2px_rgba(6,182,212,0.25),0_8px_20px_-10px_rgba(12,74,110,0.3)]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full overflow-hidden rounded-2xl border border-white/40 bg-[linear-gradient(180deg,rgba(34,211,238,0.92)_0%,rgba(37,99,235,0.94)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(29,78,216,0.35),0_8px_22px_-10px_rgba(37,99,235,0.55)] backdrop-blur-[14px] backdrop-saturate-150 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(29,78,216,0.4),0_14px_30px_-10px_rgba(37,99,235,0.7),0_0_0_4px_rgba(34,211,238,0.12)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 active:translate-y-0"
                            >
                                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_100%)]" />
                                <span aria-hidden className="lender-shimmer pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-white/20 blur-md" />
                                <span className="relative">Sign in</span>
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-cyan-600">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            Bank-grade security for every lending account.
                        </div>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            New to MIZANI?{' '}
                            <a href="/registerLender" className="font-semibold text-cyan-700 hover:text-cyan-800">
                                Create a lender account
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

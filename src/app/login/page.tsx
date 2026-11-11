"use client"
import {useState} from 'react'
import axios from 'axios'



export default function Login(){ 
    const [email, setEmail ] = useState<string>('')
    const [password, setPassword ] = useState<string>('')
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)


    const handleLogin = async(e:any) => { 
        e.preventDefault(); 
        try{ 
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login/user`, { 
                email:email, 
                password:password
            })
            console.log(res.data)
            const name = res.data?.first_name ? `, ${res.data.first_name}` : ''
            setNotice({ type: 'success', message: `Welcome back${name}! Redirecting you to your dashboard...` })
            setTimeout(() => { window.location.href = "/" }, 1200)
        }
        catch (err){ 
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
                    className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xl ${
                        notice.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50/90 text-emerald-900'
                            : 'border-red-200 bg-red-50/90 text-red-900'
                    }`}
                >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${notice.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
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
                        className="shrink-0 rounded-full p-1 opacity-60 transition hover:opacity-100"
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Left half: what MIZANI is about */}
            <section className="relative flex w-full flex-col justify-between overflow-hidden bg-emerald-950 p-8 text-white lg:w-1/2 lg:p-12">
                {/* Animated background */}
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-drift absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="animate-drift-reverse absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />
                    <div className="animate-glow absolute left-1/3 top-1/3 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2">
                        <div className="animate-spin-slow h-full w-full rounded-full border border-emerald-300/15" />
                    </div>
                    <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2">
                        <div className="animate-spin-slow-reverse h-full w-full rounded-full border border-dashed border-lime-200/15" />
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-float absolute left-[12%] top-[18%] h-8 w-8 text-emerald-300/30">
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5" />
                        <path d="M9 13h6" />
                        <path d="M9 17h4" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-float-slow absolute right-[14%] top-[30%] h-10 w-10 text-lime-200/25" style={{ animationDelay: '1.2s' }}>
                        <path d="M3 3v18h18" />
                        <path d="M7 15l4-4 3 3 5-6" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-float absolute bottom-[20%] left-[22%] h-6 w-6 text-teal-200/30" style={{ animationDelay: '0.6s' }}>
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M3 12h18" />
                    </svg>
                    <span className="animate-float absolute left-[30%] top-[32%] h-2 w-2 rounded-full bg-lime-300/60" style={{ animationDelay: '0.4s' }} />
                    <span className="animate-float-slow absolute right-[26%] bottom-[24%] h-1.5 w-1.5 rounded-full bg-emerald-200/60" style={{ animationDelay: '1.8s' }} />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-lime-300">
                                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                                <path d="M7 21h10" />
                                <path d="M12 3v18" />
                                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold tracking-tight">MIZANI</span>
                    </div>

                    <p className="mt-10 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-lime-300 ring-1 ring-emerald-400/20">
                        Procurement &amp; Business Intelligence
                    </p>

                    <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        Helping businesses make better commercial decisions.
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-100/80">
                        MIZANI helps you identify opportunities, evaluate suppliers, assess procurement risks and act
                        on intelligence that drives better commercial decisions.
                    </p>

                    <ul className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            "Tender Intelligence",
                            "Contractor Intelligence",
                            "Project Intelligence",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-emerald-50 ring-1 ring-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-lime-300">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 max-w-md text-sm leading-relaxed text-emerald-100/70">
                        Tender Intelligence surfaces relevant opportunities, Contractor Intelligence builds
                        evidence-based supplier profiles, and Project Intelligence tracks infrastructure delivery.
                    </p>
                </div>

                <p className="relative mt-10 text-xs text-emerald-200/50">
                    © MIZANI. Turning procurement data into commercial advantage.
                </p>
            </section>

            {/* Right half: login form */}
            <section className="flex w-full items-center justify-center bg-stone-50 p-6 sm:p-10 lg:w-1/2">
                <div className="liquid-form w-full max-w-md rounded-3xl p-8 ring-1 ring-white/60 sm:p-12">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">Welcome back</h2>
                    <p className="mt-1.5 text-sm text-stone-500">
                        Sign in to continue to your MIZANI account.
                    </p>

                    <form onSubmit={handleLogin} className="mt-9 space-y-6">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="liquid-input w-full rounded-xl border border-white/70 bg-white/60 px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="liquid-input w-full rounded-xl border border-white/70 bg-white/60 px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="liquid-button w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-stone-500">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
                            Create one
                        </a>
                    </p>
                </div>
            </section>
        </div>
    )
}

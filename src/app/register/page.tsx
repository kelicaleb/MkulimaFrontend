"use client"

import {useState } from 'react'
import axios from 'axios';





export default function register(){ 
    


    const [firstName, setFirstName ] = useState<string>(''); 
    const [lastName, setLastName ] = useState<string>('')
    const [email, setEmail ] = useState<string>('')
    const[password, setPassword]  = useState<string>('')
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const handleRegister = async(e:any) => { 
        e.preventDefault()
        try{ 
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register/user`, { 
                first_name:firstName, 
                last_name:lastName, 
                password:password, 
                email:email
            })
            .then((res) => console.log(res.data))
            setNotice({ type: 'success', message: 'Registration successful! Redirecting you to the login page...' })
            setTimeout(() => { window.location.href = '/login' }, 1200)
        }
        catch(err){ 
            console.error("Failed to register user", err)
            let message = 'Registration failed. Please check your details and try again.'
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
                            {notice.type === 'success' ? 'Redirecting...' : 'Registration error'}
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
            {/* Left half: what Mkulima Ledger is about */}
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
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-float-slow absolute right-[14%] top-[30%] h-10 w-10 text-lime-200/25" style={{ animationDelay: '1.2s' }}>
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-float absolute bottom-[20%] left-[22%] h-6 w-6 text-teal-200/30" style={{ animationDelay: '0.6s' }}>
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <span className="animate-float absolute left-[30%] top-[32%] h-2 w-2 rounded-full bg-lime-300/60" style={{ animationDelay: '0.4s' }} />
                    <span className="animate-float-slow absolute right-[26%] bottom-[24%] h-1.5 w-1.5 rounded-full bg-emerald-200/60" style={{ animationDelay: '1.8s' }} />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-lime-300">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold tracking-tight">Mkulima Ledger</span>
                    </div>

                    <p className="mt-10 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-lime-300 ring-1 ring-emerald-400/20">
                        Farm-to-market intelligence
                    </p>

                    <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        A farm-to-market intelligence and transparency platform.
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-emerald-100/80">
                        Agriculture is the backbone of Kenya&apos;s economy and its food security — and it is where
                        corruption does the most damage to ordinary people.
                    </p>

                    <ul className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            "Fake inputs",
                            "Subsidy leakage",
                            "Exploitative middlemen",
                            "Unpredictable prices",
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
                        Mkulima Ledger brings transparency and fair pricing to every link in the chain, from the
                        farm gate to the market.
                    </p>
                </div>

                <p className="relative mt-10 text-xs text-emerald-200/50">
                    © Mkulima Ledger. Cultivating trust in Kenyan agriculture.
                </p>
            </section>

            {/* Right half: registration form */}
            <section className="flex w-full items-center justify-center bg-stone-50 p-6 sm:p-10 lg:w-1/2">
                <div className="liquid-form w-full max-w-md rounded-3xl p-8 ring-1 ring-white/60 sm:p-12">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">Create your account</h2>
                    <p className="mt-1.5 text-sm text-stone-500">
                        Join the platform bringing transparency to Kenya&apos;s food chain.
                    </p>

                    <form onSubmit={handleRegister} className="mt-9 space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName"                                     className="mb-2 block text-sm font-medium text-stone-700">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Jane"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="liquid-input w-full rounded-xl border border-white/70 bg-white/60 px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName"                                     className="mb-2 block text-sm font-medium text-stone-700">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Wanjiku"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="liquid-input w-full rounded-xl border border-white/70 bg-white/60 px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email"                                     className="mb-2 block text-sm font-medium text-stone-700">
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
                            <label htmlFor="password"                                     className="mb-2 block text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a secure password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="liquid-input w-full rounded-xl border border-white/70 bg-white/60 px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="liquid-button w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        >
                            Register
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-stone-500">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                            Sign in
                        </a>
                    </p>
                </div>
            </section>
        </div>
    )
}

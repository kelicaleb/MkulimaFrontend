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
                    className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-[0_18px_45px_-18px_rgba(6,78,59,0.55)] backdrop-blur-2xl backdrop-saturate-150 ${
                        notice.type === 'success'
                            ? 'border-emerald-300/60 bg-[linear-gradient(180deg,rgba(236,253,245,0.94)_0%,rgba(209,250,229,0.86)_100%)] text-emerald-900'
                            : 'border-red-300/60 bg-[linear-gradient(180deg,rgba(254,242,242,0.95)_0%,rgba(254,226,226,0.88)_100%)] text-red-900'
                    }`}
                >
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_8px_-2px_rgba(6,78,59,0.45)] ${notice.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
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
                        className="shrink-0 rounded-full p-1 opacity-60 transition hover:bg-white/60 hover:opacity-100"
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

            {/* Right half: registration form */}
            <section className="relative flex w-full items-center justify-center overflow-hidden bg-stone-50 p-6 sm:p-10 lg:w-1/2">
                {/* Soft light behind the glass card */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
                    <div className="absolute -right-20 bottom-4 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/60 blur-3xl" />
                </div>

                <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.92)_0%,rgba(236,253,245,0.72)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_-30px_60px_-40px_rgba(16,185,129,0.18),0_24px_60px_-24px_rgba(6,78,59,0.35)] backdrop-blur-[18px] backdrop-saturate-[140%] sm:p-12">
                    {/* Glass sheen */}
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-0 top-0 h-px bg-white/95" />
                        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_70%)]" />
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18)_0%,rgba(16,185,129,0)_70%)]" />
                    </div>

                    <div className="relative">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
                            Get started
                        </span>

                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900">Create your account</h2>
                        <p className="mt-1.5 text-sm text-stone-500">
                            Join the platform turning procurement data into commercial intelligence.
                        </p>

                        <form onSubmit={handleRegister} className="mt-9 space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-stone-700">
                                        First name
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                            </svg>
                                        </span>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Jane"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(6,78,59,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-stone-400/90 focus:border-emerald-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(16,185,129,0.5),0_0_0_2px_rgba(16,185,129,0.25),0_8px_20px_-10px_rgba(6,78,59,0.3)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-stone-700">
                                        Last name
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                            </svg>
                                        </span>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Wanjiku"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(6,78,59,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-stone-400/90 focus:border-emerald-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(16,185,129,0.5),0_0_0_2px_rgba(16,185,129,0.25),0_8px_20px_-10px_rgba(6,78,59,0.3)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(6,78,59,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-stone-400/90 focus:border-emerald-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(16,185,129,0.5),0_0_0_2px_rgba(16,185,129,0.25),0_8px_20px_-10px_rgba(6,78,59,0.3)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <rect x="4" y="10" width="16" height="11" rx="2" />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                            <path d="M12 15v2" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Create a secure password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.66)_100%)] py-3.5 pl-11 pr-4 text-sm text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(6,78,59,0.25)] outline-none backdrop-blur-[12px] backdrop-saturate-[140%] transition placeholder:text-stone-400/90 focus:border-emerald-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(16,185,129,0.5),0_0_0_2px_rgba(16,185,129,0.25),0_8px_20px_-10px_rgba(6,78,59,0.3)]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full overflow-hidden rounded-2xl border border-white/40 bg-[linear-gradient(180deg,rgba(52,211,153,0.92)_0%,rgba(5,150,105,0.94)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(4,120,87,0.35),0_8px_22px_-10px_rgba(5,150,105,0.55)] backdrop-blur-[14px] backdrop-saturate-150 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(4,120,87,0.4),0_14px_30px_-10px_rgba(5,150,105,0.7),0_0_0_4px_rgba(52,211,153,0.12)] focus:outline-none focus:ring-2 focus:ring-emerald-400/40 active:translate-y-0"
                            >
                                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_100%)]" />
                                <span aria-hidden className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
                                <span className="relative">Register</span>
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-2 text-xs text-stone-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-600">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            Your information is encrypted and kept secure.
                        </div>

                        <p className="mt-7 text-center text-sm text-stone-500">
                            Already have an account?{' '}
                            <a href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

"use client"

import {useState } from 'react'
import axios from 'axios';





export default function register(){ 
    


    const [firstName, setFirstName ] = useState<string>(''); 
    const [lastName, setLastName ] = useState<string>('')
    const [email, setEmail ] = useState<string>('')
    const[password, setPassword]  = useState<string>('')

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
            window.location.href = '/login'
        }
        catch(err){ 
            console.error("Failed to register user", err)
        }
    }
    
    return(
        <div className="flex min-h-screen flex-col bg-white lg:flex-row">
            {/* Left half: what Mkulima Ledger is about */}
            <section className="relative flex w-full flex-col justify-between overflow-hidden bg-emerald-950 p-8 text-white lg:w-1/2 lg:p-12">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />

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
                <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm ring-1 ring-stone-200 sm:p-9">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">Create your account</h2>
                    <p className="mt-1.5 text-sm text-stone-500">
                        Join the platform bringing transparency to Kenya&apos;s food chain.
                    </p>

                    <form onSubmit={handleRegister} className="mt-7 space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-stone-700">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Jane"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-stone-700">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Wanjiku"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a secure password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:bg-emerald-800"
                        >
                            Register
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
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

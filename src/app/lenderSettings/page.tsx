'use client'


import {useState, useEffect } from 'react'
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from 'axios'; 
import ThemeToggle from "@/components/ThemeToggle"


interface User{ 
    id:number, 
    first_name:string, 
    last_name:string, 
    phone_number:string, 
    password:string, 
    role:string, 
    create_at:string, 
    email:string
}

const ICONS: Record<string, ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  pie: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M21 12A9 9 0 1 1 12 3v9h9Z" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </svg>
  ),
}

const NAV_ITEMS: { label: string; href: string; icon: ReactNode; active?: boolean }[] = [
  { label: "Overview", href: "/lenderHomepage", icon: ICONS.grid },
  { label: "Portfolio", href: "/lenderHomepage#portfolio", icon: ICONS.pie },
  { label: "Tenders", href: "/lenderTender", icon: ICONS.file },
  { label: "Add Tender", href: "/addTender", icon: ICONS.plus },
  { label: "Settings", href: "/lenderSettings", icon: ICONS.settings, active: true },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "MI"
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("")
}

function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-[#f3f6fa] to-indigo-50 dark:from-[#040815] dark:via-[#070d1f] dark:to-[#08162f]" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(6,182,212,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.14) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 80% 60% at 40% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 40% 0%, #000 35%, transparent 100%)",
        }}
      />
      <div className="animate-drift absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl dark:bg-cyan-500/15" />
      <div className="animate-drift-reverse absolute right-0 top-24 h-96 w-96 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/10" />
      <div className="animate-glow absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
    </div>
  )
}

function Sidebar({
  lenderName,
  lenderId,
  onSignOut,
}: {
  lenderName: string
  lenderId: string | null
  onSignOut: () => void
}) {
  return (
    <aside className="relative z-20 hidden w-[272px] shrink-0 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <div className="liquid-glass flex h-full flex-col overflow-hidden rounded-[30px] p-4">
          <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/60 dark:ring-white/10">
              <Image src="/mizani-logo.svg" alt="MIZANI" width={40} height={40} className="h-10 w-10" priority />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">MIZANI</span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-700/70 dark:text-cyan-300/70">
                Lender workspace
              </span>
            </span>
          </Link>

          <nav className="mt-6 flex-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Menu
            </p>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                      item.active
                        ? "bg-cyan-500/10 text-cyan-800 ring-1 ring-cyan-500/20 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20"
                        : "text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    <span className="opacity-80">{item.icon}</span>
                    {item.label}
                    {item.active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.18)]" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-2.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-inner">
                {getInitials(lenderName)}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {lenderName || "Lender"}
                </span>
                <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                  ID {lenderId ?? "—"}
                </span>
              </span>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/60 hover:text-rose-500 dark:hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5M21 12H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}


export default function lenderSettings(){
    const [user, setUser ] = useState<User | null>(null) 
    const [password, setPassword ] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => { 
        const fetchUserDetails = async()=> { 
            try{ 
                const user_id = localStorage.getItem("user_id")
               const res =  await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/details/${user_id}`)
               setUser(res.data)
                
            }
            catch(err){ 
                console.error("Failed to fetch user details", err)
                setNotice({ type: "error", message: "Failed to load user details. Please try again." })
                setTimeout(() => setNotice(null), 5000)
            }
            finally{
                setLoading(false)
            }
        }
        fetchUserDetails()
    },[])

    const handleChangePassword = async(data:User) => { 
        try{ 
            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/changePassword/${data.id}`,  {
                password:password, 
                confirmPassword:confirmPassword
            })
            .then((res) => console.log(res.data))
            setNotice({ type: "success", message: "Password updated successfully. Redirecting to login..." })
            setTimeout(() => { window.location.href = '/loginLender' }, 1200)
        }
        catch(err){ 
            console.error("Failed to update password", err)
            let message = "Failed to update password. Please try again."
            if (axios.isAxiosError(err)) {
                const dataErr = err.response?.data as { message?: string; error?: string; detail?: string } | undefined
                const serverMessage = dataErr?.message || dataErr?.error || dataErr?.detail
                if (serverMessage) message = String(serverMessage)
                else if (!err.response) message = "Network error. Please check your connection and try again."
            }
            setNotice({ type: "error", message })
            setTimeout(() => setNotice(null), 6000)
        }
    }

    const handleSignOut = () => {
      try {
        localStorage.removeItem("user_id")
        localStorage.removeItem("lender_id")
      } catch {
        /* ignore storage errors */
      }
      router.push("/loginLender")
    }

    const lenderId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null
    const lenderName = user ? `${user.first_name} ${user.last_name}`.trim() : ""
    
    return( 
        <div className="relative flex min-h-screen">
            <AmbientBackground />
            <Sidebar lenderName={lenderName} lenderId={lenderId} onSignOut={handleSignOut} />

            <div className="relative z-10 flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-3 pt-3 lg:hidden">
                <div className="liquid-glass flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/mizani-logo.svg" alt="MIZANI" width={30} height={30} className="h-8 w-8 rounded-lg" priority />
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">MIZANI</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <a href="/lenderHomepage" className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-cyan-700 dark:text-slate-300">
                      Overview
                    </a>
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {notice && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-[0_18px_45px_-18px_rgba(12,74,110,0.55)] backdrop-blur-2xl backdrop-saturate-150 ${
                    notice.type === "success"
                      ? "border-cyan-300/60 bg-[linear-gradient(180deg,rgba(236,254,255,0.95)_0%,rgba(207,250,254,0.88)_100%)] text-cyan-950 dark:border-cyan-400/30 dark:bg-[linear-gradient(180deg,rgba(8,47,73,0.92)_0%,rgba(14,116,144,0.55)_100%)] dark:text-cyan-50"
                      : "border-red-300/60 bg-[linear-gradient(180deg,rgba(254,242,242,0.95)_0%,rgba(254,226,226,0.88)_100%)] text-red-900 dark:border-red-400/30 dark:bg-[linear-gradient(180deg,rgba(69,10,10,0.92)_0%,rgba(127,29,29,0.55)_100%)] dark:text-red-50"
                  }`}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/20" />
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${notice.type === "success" ? "bg-cyan-600" : "bg-red-600"}`}>
                    <span className="text-[11px] font-bold text-white">{notice.type === "success" ? "✓" : "!"}</span>
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-medium">{notice.message}</p>
                  <button
                    type="button"
                    onClick={() => setNotice(null)}
                    aria-label="Dismiss notification"
                    className="shrink-0 rounded-full p-1 opacity-60 transition hover:bg-white/60 hover:opacity-100 dark:hover:bg-white/10"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}

              <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
                <div className="mx-auto w-full max-w-[1200px]">
                  <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="liquid-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                          Settings
                        </span>
                        {user && (
                          <span className="rounded-full border border-white/60 bg-white/40 px-3 py-1 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                            {user.email}
                          </span>
                        )}
                      </div>
                      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Account settings
                      </h1>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Manage your lender profile, keep your credentials secure, and get a quick overview of your MIZANI workspace.
                      </p>
                    </div>
                    <div className="hidden xl:block">
                      <ThemeToggle />
                    </div>
                  </header>

                  {loading ? (
                    <section className="mt-6 liquid-glass-panel rounded-3xl p-8">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Loading account details...</p>
                    </section>
                  ) : user ? (
                    <>
                      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="liquid-glass-panel rounded-3xl p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Account</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white capitalize">{user.role || "lender"}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Active lender workspace access</p>
                        </div>
                        <div className="liquid-glass-panel rounded-3xl p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">User ID</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{user.id}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Linked to your portfolio and tenders</p>
                        </div>
                        <div className="liquid-glass-panel rounded-3xl p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Profile</p>
                          <p className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-white">{user.first_name} {user.last_name}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Primary account holder</p>
                        </div>
                        <div className="liquid-glass-panel rounded-3xl p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Security</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Password</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Update credentials from this page</p>
                        </div>
                      </section>

                      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
                        <section className="liquid-glass-panel overflow-hidden rounded-3xl p-6 sm:p-8 xl:col-span-7">
                          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Profile details</h2>
                          <div className="mt-5 flex items-center gap-4">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-lg font-bold text-white shadow-inner">
                              {getInitials(`${user.first_name} ${user.last_name}`)}
                            </span>
                            <div>
                              <p className="text-lg font-semibold text-slate-900 dark:text-white">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role || "lender"}</p>
                            </div>
                          </div>
                          <dl className="mt-6 grid grid-cols-1 gap-4">
                            <div className="rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Email</dt>
                              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white break-all">{user.email}</dd>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">First name</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{user.first_name}</dd>
                              </div>
                              <div className="rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Last name</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{user.last_name}</dd>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Phone number</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{user.phone_number || "—"}</dd>
                              </div>
                              <div className="rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">User ID</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{user.id}</dd>
                              </div>
                            </div>
                          </dl>
                        </section>

                        <div className="space-y-6 xl:col-span-5">
                          <section className="liquid-glass-panel overflow-hidden rounded-3xl p-6 sm:p-8">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Change password</h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Enter a new password and confirm it to update your account credentials.</p>
                            <div className="mt-6 space-y-5">
                              <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                                  New password
                                </label>
                                <input
                                  id="password"
                                  type="password"
                                  placeholder="Enter new password"
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  className="w-full rounded-2xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.5)_100%)] px-4 py-3.5 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04),0_10px_24px_-14px_rgba(12,74,110,0.35)] backdrop-blur-xl backdrop-saturate-150 outline-none transition placeholder:text-slate-400/90 focus:border-cyan-500/70 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_0_0_2px_rgba(6,182,212,0.22)] dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_100%)] dark:text-white dark:placeholder:text-slate-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25),0_12px_28px_-16px_rgba(0,0,0,0.6)] dark:focus:border-cyan-400/50"
                                />
                              </div>
                              <div>
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                                  Confirm password
                                </label>
                                <input
                                  id="confirmPassword"
                                  type="password"
                                  placeholder="Confirm new password"
                                  value={confirmPassword}
                                  onChange={e => setConfirmPassword(e.target.value)}
                                  className="w-full rounded-2xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.5)_100%)] px-4 py-3.5 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04),0_10px_24px_-14px_rgba(12,74,110,0.35)] backdrop-blur-xl backdrop-saturate-150 outline-none transition placeholder:text-slate-400/90 focus:border-cyan-500/70 focus:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_0_0_2px_rgba(6,182,212,0.22)] dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_100%)] dark:text-white dark:placeholder:text-slate-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25),0_12px_28px_-16px_rgba(0,0,0,0.6)] dark:focus:border-cyan-400/50"
                                />
                              </div>
                              <div className="pt-2">
                                <button
                                  type="button"
                                  className="group relative w-full overflow-hidden rounded-2xl border border-white/40 bg-[linear-gradient(180deg,rgba(34,211,238,0.88)_0%,rgba(37,99,235,0.9)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(29,78,216,0.35),0_10px_24px_-12px_rgba(37,99,235,0.55)] backdrop-blur-xl backdrop-saturate-150 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 active:translate-y-0 dark:border-white/20"
                                  onClick={()=>handleChangePassword(user)}
                                >
                                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_100%)]" />
                                  <span className="relative">Change Password</span>
                                </button>
                              </div>
                            </div>
                          </section>

                          <section className="liquid-glass-panel overflow-hidden rounded-3xl p-6 sm:p-8">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 16v-4" />
                                  <path d="M12 8h.01" />
                                </svg>
                              </span>
                              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Help & overview</h2>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                              MIZANI gives lenders a clear view of procurement opportunities, funded tenders, and portfolio exposure so you can make informed decisions.
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                              <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                <span><span className="font-medium text-slate-900 dark:text-white">Profile:</span> your account details are used to identify you across the lender workspace.</span>
                              </li>
                              <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                <span><span className="font-medium text-slate-900 dark:text-white">Security:</span> update your password regularly and avoid reusing old credentials.</span>
                              </li>
                              <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                <span><span className="font-medium text-slate-900 dark:text-white">Workspace:</span> use Overview, Tenders, and Add Tender to monitor and manage your funded activity.</span>
                              </li>
                            </ul>
                            <div className="mt-5 rounded-2xl border border-white/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Need more help?</p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">More detailed support and guidance can be added here later.</p>
                            </div>
                          </section>
                        </div>
                      </div>
                    </>
                  ) : (
                    <section className="mt-6 liquid-glass-panel rounded-3xl p-8">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unable to display user details.</p>
                    </section>
                  )}
                </div>
              </main>
            </div>
        </div>
    )
}

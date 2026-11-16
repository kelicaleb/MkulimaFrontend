"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import ThemeToggle from "@/components/ThemeToggle"

type RawTender = {
  id: number
  lender_id: number
  title: string
  description: string
  budget: number | string
  deadline: string | null
  created_at?: string | null
  category: string
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
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M16 7h4v4" />
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
  { label: "Tenders", href: "/lenderTender", icon: ICONS.file, active: true },
  { label: "Add Tender", href: "/addTender", icon: ICONS.plus },
  { label: "Settings", href: "/lenderSettings", icon: ICONS.settings },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "MI"
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("")
}

function formatDate(value: string | Date | null): string {
  if (!value) return "No deadline"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "No deadline"
  return date.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
}

function moneyExact(value: number | string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value ?? "—")
  return `KSh ${Math.round(n).toLocaleString()}`
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
            <div className="rounded-2xl border border-white/60 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Portfolio scope</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Tenders linked by <span className="font-mono text-cyan-700 dark:text-cyan-300">lender_id</span>{" "}
                to <span className="font-mono text-cyan-700 dark:text-cyan-300">users.id</span>
              </p>
            </div>

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

export default function LenderTenderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LenderTenderContent />
    </Suspense>
  )
}

function LenderTenderContent() {
  const [rows, setRows] = useState<RawTender[]>([])
  const [lenderName, setLenderName] = useState("")
  const [lenderId, setLenderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"insights" | "tender" | null>(null)

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL
  const router = useRouter()

  const load = useCallback(
    async (manual = false) => {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("user_id") || localStorage.getItem("lender_id") : null
      const fromUrl =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("lender_id") : null
      const id = fromUrl || stored
      setLenderId(id)

      if (!id) {
        setRows([])
        setLoading(false)
        return
      }

      if (manual) setRefreshing(true)
      else setLoading(true)
      setError(null)

      try {
        const res = await axios.get(`${backend}/insights/lender/${id}`)
        const payload = res.data as { tenders?: RawTender[]; lender?: { first_name?: string; last_name?: string } } | RawTender[]
        const list: RawTender[] = Array.isArray(payload) ? payload : Array.isArray(payload?.tenders) ? payload.tenders : []
        if (!Array.isArray(payload) && payload?.lender) {
          const name = [payload.lender.first_name, payload.lender.last_name].filter(Boolean).join(" ")
          setLenderName(name)
        }
        setRows(list)
        setSource("insights")
      } catch {
        try {
          const res = await axios.get(`${backend}/tender/${id}`)
          setRows(Array.isArray(res.data) ? (res.data as RawTender[]) : [])
          setSource("tender")
        } catch (err) {
          console.error("Failed to load lender portfolio", err)
          setError("We could not load your tenders. Confirm the API is running and try again.")
          setRows([])
        }
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [backend],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const total = useMemo(() => rows.reduce((sum, r) => sum + (Number(r.budget) || 0), 0), [rows])

  const handleSignOut = () => {
    try {
      localStorage.removeItem("user_id")
      localStorage.removeItem("lender_id")
    } catch {
      /* ignore storage errors */
    }
    router.push("/loginLender")
  }

  return (
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

        <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="liquid-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    Tenders
                  </span>
                  <span className="rounded-full border border-white/60 bg-white/40 px-3 py-1 font-mono text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    lender_id: {lenderId ?? "—"}
                  </span>
                  {source && (
                    <span className="rounded-full border border-white/60 bg-white/40 px-3 py-1 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                      {source === "insights" ? "/insights/lender/:lender_id" : "/tender/:lender_id"}
                    </span>
                  )}
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  Funded tenders
                </h1>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  A detailed view of tenders linked to your lender account.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => load(true)}
                  className="liquid-pill inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  >
                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                    <path d="M21 3v6h-6" />
                  </svg>
                  Refresh
                </button>
                <div className="hidden xl:block">
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {!lenderId && (
              <div
                role="alert"
                className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 rounded-2xl border border-amber-300/60 bg-[linear-gradient(180deg,rgba(255,251,235,0.96)_0%,rgba(254,243,199,0.9)_100%)] p-4 text-amber-900 shadow-[0_18px_45px_-18px_rgba(146,64,14,0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-amber-400/30 dark:bg-[linear-gradient(180deg,rgba(69,26,3,0.92)_0%,rgba(120,53,15,0.55)_100%)] dark:text-amber-100"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">!</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">No lender session found</p>
                    <p className="mt-1 text-xs opacity-80">
                      Sign in as a lender, or open this page with <span className="font-mono">?lender_id=1</span> to preview.
                    </p>
                  </div>
                </div>
                <Link href="/loginLender" className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-cyan-500">
                  Sign in as lender
                </Link>
              </div>
            )}

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className={`fixed right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden rounded-2xl border border-red-300/60 bg-[linear-gradient(180deg,rgba(254,242,242,0.95)_0%,rgba(254,226,226,0.88)_100%)] p-4 text-red-900 shadow-[0_18px_45px_-18px_rgba(12,74,110,0.55)] backdrop-blur-2xl backdrop-saturate-150 dark:border-red-400/30 dark:bg-[linear-gradient(180deg,rgba(69,10,10,0.92)_0%,rgba(127,29,29,0.55)_100%)] dark:text-red-50 ${!lenderId ? "top-[10.5rem]" : "top-4"}`}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/20" />
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">!</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Could not load tenders</p>
                  <p className="mt-0.5 text-xs opacity-80">{error}</p>
                </div>
              </div>
            )}

            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="liquid-glass-panel rounded-3xl p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Total tenders</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{rows.length}</p>
              </div>
              <div className="liquid-glass-panel rounded-3xl p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Total budget</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{moneyExact(total)}</p>
              </div>
              <div className="liquid-glass-panel rounded-3xl p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Lender</p>
                <p className="mt-2 truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{lenderName || "—"}</p>
              </div>
            </section>

            <section className="mt-6 liquid-glass-panel overflow-hidden rounded-3xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/60 px-5 py-4 dark:border-white/10">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tender details</h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Based on RawTender fields</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/40 text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">ID</th>
                      <th className="px-5 py-3 font-semibold">Title</th>
                      <th className="px-5 py-3 font-semibold">Category</th>
                      <th className="px-5 py-3 font-semibold">Description</th>
                      <th className="px-5 py-3 font-semibold">Budget</th>
                      <th className="px-5 py-3 font-semibold">Deadline</th>
                      <th className="px-5 py-3 font-semibold">Created</th>
                      <th className="px-5 py-3 font-semibold">Lender ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/60 dark:divide-white/10">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                          Loading tenders...
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                          No tenders found for this lender.
                        </td>
                      </tr>
                    ) : (
                      rows.map((tender) => (
                        <tr key={tender.id} className="align-top transition hover:bg-white/30 dark:hover:bg-white/5">
                          <td className="px-5 py-4 font-mono text-xs text-slate-700 dark:text-slate-200">{tender.id}</td>
                          <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{tender.title}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-500/20 dark:text-cyan-300">
                              {tender.category || "Uncategorised"}
                            </span>
                          </td>
                          <td className="max-w-md px-5 py-4 text-slate-600 dark:text-slate-300">
                            <p className="line-clamp-3">{tender.description}</p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">{moneyExact(tender.budget)}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(tender.deadline)}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">{formatDate(tender.created_at ?? null)}</td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-700 dark:text-slate-200">{tender.lender_id}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

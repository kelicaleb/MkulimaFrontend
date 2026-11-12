"use client"


import {useState, useEffect } from 'react'
import Navbar from "@/components/Navbar";
import axios from 'axios'

interface Tender{
    id:number, 
    lender_id:number, 
    title:string, 
    description:string, 
    budget:number, 
    deadline:string, 
    category:string
}

const PALETTE = [
  {
    chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    glow: "shadow-[0_0_0_3px_rgba(16,185,129,0.14)]",
  },
  {
    chip: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-400/20",
    bar: "bg-cyan-500",
    dot: "bg-cyan-500",
    glow: "shadow-[0_0_0_3px_rgba(6,182,212,0.14)]",
  },
  {
    chip: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20",
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
    glow: "shadow-[0_0_0_3px_rgba(99,102,241,0.14)]",
  },
  {
    chip: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    glow: "shadow-[0_0_0_3px_rgba(245,158,11,0.14)]",
  },
  {
    chip: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    glow: "shadow-[0_0_0_3px_rgba(244,63,94,0.14)]",
  },
  {
    chip: "bg-teal-500/10 text-teal-700 ring-teal-500/20 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-400/20",
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    glow: "shadow-[0_0_0_3px_rgba(20,184,166,0.14)]",
  },
]

function categoryStyle(category: string) {
  let hash = 0
  const value = category || "Uncategorised"
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

function money(value: number) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "KSh —"
  if (amount >= 1_000_000_000) return `KSh ${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `KSh ${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `KSh ${(amount / 1_000).toFixed(1)}K`
  return `KSh ${Math.round(amount).toLocaleString()}`
}

function formatDeadline(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "No deadline"
  return date.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
}

const GLASS_CARD =
  "border border-white/60 bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.5)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_44px_-22px_rgba(6,78,59,0.35)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[linear-gradient(170deg,rgba(24,36,31,0.85)_0%,rgba(10,17,14,0.7)_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_48px_-20px_rgba(0,0,0,0.8)]"

const GLASS_PANEL =
  "border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.55)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_40px_-16px_rgba(6,78,59,0.35)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(24,36,31,0.9)_0%,rgba(10,17,14,0.85)_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_44px_-16px_rgba(0,0,0,0.8)]"



export default function Tenders(){
    const [applications, setApplications ] = useState<Tender[]>([])
    useEffect(() => { 
        const fetchData = async()=> { 
            try{ 
                await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tender`)
                .then((res) => setApplications(res.data))
            }
            catch(err){ 
                console.error("Failed to fecth tenders", err)
            }
        }
        fetchData()
    },[])

    const totalBudget = applications.reduce((sum, tender) => sum + Number(tender.budget || 0), 0)
    const averageBudget = applications.length > 0 ? totalBudget / applications.length : 0
    const maxBudget = Math.max(...applications.map((tender) => Number(tender.budget || 0)), 1)

    const categoryStats = Object.entries(
        applications.reduce<Record<string, { count: number; total: number }>>((acc, tender) => {
            const key = tender.category || "Uncategorised"
            acc[key] ??= { count: 0, total: 0 }
            acc[key].count += 1
            acc[key].total += Number(tender.budget || 0)
            return acc
        }, {})
    )
        .map(([category, value]) => ({
            category,
            ...value,
            share: totalBudget > 0 ? (value.total / totalBudget) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total)

    const topTenders = [...applications]
        .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
        .slice(0, 3)

    return(
        <>
        <Navbar/>
        <div className="relative min-h-screen overflow-hidden">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-[#f5f7f3] to-[#f5f7f3] dark:from-emerald-950/30 dark:via-[#070d0a] dark:to-[#070d0a]" />
                <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(16,185,129,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] dark:opacity-[0.16]" />
                <div className="absolute -left-24 top-10 h-80 w-80 animate-pulse rounded-full bg-emerald-400/25 blur-3xl [animation-duration:14s] dark:bg-emerald-500/15" />
                <div className="absolute -right-20 top-32 h-96 w-96 animate-pulse rounded-full bg-teal-300/25 blur-3xl [animation-duration:18s] dark:bg-teal-500/10" />
                <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 animate-pulse rounded-full bg-lime-300/20 blur-3xl [animation-duration:22s] dark:bg-lime-400/10" />
            </div>

            <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
                <section className={`relative overflow-hidden rounded-[2rem] p-6 sm:p-10 ${GLASS_PANEL}`}>
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/20" />
                    <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/15" />
                    <span aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" />

                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-300">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </span>
                            Live tender marketplace
                        </span>

                        <div className="mt-6 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <h1 className="text-balance text-3xl font-bold leading-[1.08] tracking-tight text-stone-900 sm:text-4xl md:text-5xl dark:text-white">
                                    Opportunities{" "}
                                    <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent dark:from-emerald-300 dark:via-emerald-400 dark:to-lime-300">
                                        worth funding.
                                    </span>
                                </h1>
                                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-300">
                                    A live view of every tender on MIZANI. Compare capital, categories and deadlines
                                    before you deploy.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Open tenders</p>
                                    <p className="mt-1 text-xl font-bold tracking-tight text-stone-900 dark:text-white">{applications.length}</p>
                                </div>
                                <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Capital tracked</p>
                                    <p className="mt-1 text-xl font-bold tracking-tight text-stone-900 dark:text-white">{money(totalBudget)}</p>
                                </div>
                                <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Sectors</p>
                                    <p className="mt-1 text-xl font-bold tracking-tight text-stone-900 dark:text-white">{categoryStats.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: "Open tenders", value: String(applications.length), hint: "Published listings" },
                        { label: "Capital tracked", value: money(totalBudget), hint: "Across all tenders" },
                        { label: "Average ticket", value: money(averageBudget), hint: "Per tender" },
                        { label: "Category mix", value: String(categoryStats.length), hint: "Sectors in play" },
                    ].map((stat) => (
                        <div key={stat.label} className={`relative overflow-hidden rounded-2xl p-4 ${GLASS_PANEL}`}>
                            <span aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/25" />
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">{stat.label}</p>
                            <p className="mt-1.5 truncate text-lg font-bold tracking-tight text-stone-900 sm:text-xl dark:text-white">{stat.value}</p>
                            <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">{stat.hint}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className={`relative overflow-hidden rounded-3xl p-5 lg:col-span-5 ${GLASS_CARD}`}>
                        <span aria-hidden className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/25" />
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Category mix</h2>
                                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Capital share by sector</p>
                            </div>
                            <span className="rounded-full border border-white/60 bg-white/50 px-2.5 py-1 text-[10px] font-semibold text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                                {categoryStats.length} sectors
                            </span>
                        </div>

                        <ul className="mt-4 space-y-3">
                            {categoryStats.length === 0 && (
                                <li className="rounded-2xl bg-white/40 px-4 py-6 text-center text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                                    No category data yet
                                </li>
                            )}
                            {categoryStats.slice(0, 6).map((stat) => {
                                const style = categoryStyle(stat.category)
                                return (
                                    <li key={stat.category}>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="flex min-w-0 items-center gap-2">
                                                <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                                                <span className="truncate text-xs font-medium text-stone-700 dark:text-stone-200">{stat.category}</span>
                                            </span>
                                            <span className="shrink-0 text-xs font-semibold text-stone-900 dark:text-white">{money(stat.total)}</span>
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                                                <span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${Math.max(stat.share, 2)}%` }} />
                                            </span>
                                            <span className="w-9 text-right text-[10px] font-medium text-stone-400 dark:text-stone-500">{stat.share.toFixed(0)}%</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className={`relative overflow-hidden rounded-3xl p-5 lg:col-span-7 ${GLASS_CARD}`}>
                        <span aria-hidden className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/25" />
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Largest opportunities</h2>
                                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Top budgets on the board</p>
                            </div>
                            <span className="rounded-full border border-white/60 bg-white/50 px-2.5 py-1 text-[10px] font-semibold text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                                Top {topTenders.length}
                            </span>
                        </div>

                        <ul className="mt-4 space-y-3">
                            {topTenders.length === 0 && (
                                <li className="rounded-2xl bg-white/40 px-4 py-6 text-center text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                                    No tenders published yet
                                </li>
                            )}
                            {topTenders.map((tender, index) => {
                                const style = categoryStyle(tender.category)
                                const width = (Number(tender.budget || 0) / maxBudget) * 100
                                return (
                                    <li key={tender.id}>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-white/50 text-[11px] font-bold text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <p className="truncate text-xs font-semibold text-stone-800 dark:text-stone-100">{tender.title}</p>
                                                    <p className="shrink-0 text-xs font-semibold text-stone-900 dark:text-white">{money(Number(tender.budget))}</p>
                                                </div>
                                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                                                    <span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${Math.max(width, 3)}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </section>

                <section className="mt-8">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl dark:text-white">Opportunity feed</h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Every tender currently listed on MIZANI.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-stone-600 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </span>
                            {applications.length} live
                        </span>
                    </div>

                    {applications.length > 0 && (
                        <div className={`mt-5 overflow-hidden rounded-3xl ${GLASS_PANEL}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/60 bg-white/30 dark:border-white/10 dark:bg-white/5">
                                            <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Tender</th>
                                            <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Category</th>
                                            <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Lender</th>
                                            <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Budget</th>
                                            <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Deadline</th>
                                            <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Capital share</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/50 dark:divide-white/5">
                                        {applications.map((app, index) => {
                                            const style = categoryStyle(app.category)
                                            const share = totalBudget > 0 ? (Number(app.budget || 0) / totalBudget) * 100 : 0
                                            return (
                                                <tr key={app.id} className="group transition-colors hover:bg-white/40 dark:hover:bg-white/[0.04]">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/50 text-[10px] font-bold text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                                                                {String(index + 1).padStart(2, "0")}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{app.title}</p>
                                                                <p className="mt-0.5 line-clamp-1 max-w-[280px] text-[11px] text-stone-500 dark:text-stone-400">{app.description || "No description provided."}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.chip}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                                            {app.category || "Uncategorised"}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <span className="flex items-center gap-2">
                                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-stone-700 to-stone-900 text-[10px] font-bold text-white dark:from-emerald-500 dark:to-cyan-600">L{app.lender_id}</span>
                                                            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">#{app.lender_id}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4 text-right">
                                                        <p className="text-sm font-semibold text-stone-900 dark:text-white">{money(Number(app.budget))}</p>
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <p className="text-xs font-medium text-stone-700 dark:text-stone-200">{formatDeadline(app.deadline)}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                                                                <span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${Math.max(share, 2)}%` }} />
                                                            </span>
                                                            <span className="w-10 text-right text-[11px] font-semibold text-stone-500 dark:text-stone-400">{share.toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {applications.length === 0 && (
                        <div className={`mt-5 flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center ${GLASS_PANEL}`}>
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                                    <path d="M14 3v5h5" />
                                    <path d="M9 13h6M9 17h4" />
                                </svg>
                            </span>
                            <p className="mt-4 text-sm font-semibold text-stone-800 dark:text-stone-100">No tenders published yet</p>
                            <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                New opportunities will appear here as soon as they are listed. Check back shortly.
                            </p>
                        </div>
                    )}
                </section>

                <footer className="mt-10 flex flex-col gap-1 border-t border-white/60 px-1 pt-5 text-[11px] text-stone-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-stone-500">
                    <p>© MIZANI — Turning procurement data into commercial advantage.</p>
                    <p>
                        {applications.length} tenders · {money(totalBudget)} tracked
                    </p>
                </footer>
            </main>
        </div>
        </>
    )
}

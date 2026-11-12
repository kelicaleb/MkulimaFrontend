"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import ThemeToggle from "@/components/ThemeToggle"

const DAY = 1000 * 60 * 60 * 24
const MONTHS_BACK = [6, 12, 24] as const

const PALETTE = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899", "#84cc16", "#14b8a6", "#8b5cf6"]

type Urgency = "overdue" | "closing_soon" | "this_month" | "later"

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

type EnrichedTender = RawTender & {
  budgetValue: number
  deadlineDate: Date | null
  daysRemaining: number | null
  urgency: Urgency
  share: number
}

type CategoryStat = {
  category: string
  count: number
  total: number
  average: number
  share: number
  color: string
}

type BucketStat = {
  key: Urgency
  label: string
  hint: string
  color: string
  count: number
  total: number
}

type MonthStat = {
  key: string
  label: string
  total: number
  count: number
}

type Insight = {
  tone: "positive" | "warning" | "neutral"
  title: string
  detail: string
}

type Dashboard = {
  lenderName: string
  tenders: EnrichedTender[]
  byCategory: CategoryStat[]
  buckets: BucketStat[]
  insights: Insight[]
  total: number
  average: number
  active: number
  closingSoon: number
  overdue: number
  nextDeadline: EnrichedTender | null
  largest: EnrichedTender | null
}

const BUCKET_META: Record<Urgency, { label: string; hint: string; color: string }> = {
  overdue: { label: "Overdue", hint: "Needs attention", color: "#f43f5e" },
  closing_soon: { label: "Closing in 7 days", hint: "Act soon", color: "#f59e0b" },
  this_month: { label: "Due within 30 days", hint: "On the radar", color: "#06b6d4" },
  later: { label: "Beyond 30 days", hint: "Comfortable", color: "#10b981" },
}

const ACCENTS = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-300", stroke: "#10b981" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-300", stroke: "#06b6d4" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-300", stroke: "#6366f1" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-300", stroke: "#f59e0b" },
}

const ICONS: Record<string, ReactNode> = {
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13h2" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
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
  { label: "Overview", href: "#overview", icon: ICONS.grid, active: true },
  { label: "Portfolio", href: "#portfolio", icon: ICONS.pie },
  { label: "Tenders", href: "/tenders", icon: ICONS.file },
  { label: "Add Tender", href: "/addTender", icon: ICONS.plus },
  { label: "Insights", href: "#insights", icon: ICONS.spark },
  { label: "Settings", href: "#settings", icon: ICONS.settings },
]

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function startOfDay(value: Date): Date {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function money(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `KSh ${(value / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `KSh ${(value / 1_000).toFixed(1)}K`
  return `KSh ${Math.round(value).toLocaleString()}`
}

function moneyExact(value: number): string {
  return `KSh ${Math.round(value).toLocaleString()}`
}

function formatDate(value: string | Date | null): string {
  if (!value) return "No deadline"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "No deadline"
  return date.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
}

function deadlineLabel(days: number | null): string {
  if (days === null) return "No deadline"
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return "Due today"
  return `${days}d left`
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "MI"
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("")
}

function enrichTender(row: RawTender, total: number, today: Date): EnrichedTender {
  const budgetValue = toNumber(row.budget)
  const deadlineDate = row.deadline ? new Date(row.deadline) : null
  const validDeadline = deadlineDate instanceof Date && !Number.isNaN(deadlineDate.getTime())
  const daysRemaining = validDeadline
    ? Math.ceil((startOfDay(deadlineDate as Date).getTime() - today.getTime()) / DAY)
    : null

  let urgency: Urgency = "later"
  if (daysRemaining !== null) {
    if (daysRemaining < 0) urgency = "overdue"
    else if (daysRemaining <= 7) urgency = "closing_soon"
    else if (daysRemaining <= 30) urgency = "this_month"
  }

  return {
    ...row,
    budgetValue,
    deadlineDate: validDeadline ? (deadlineDate as Date) : null,
    daysRemaining,
    urgency,
    share: total > 0 ? (budgetValue / total) * 100 : 0,
  }
}

function computeDashboard(rows: RawTender[], lenderName: string): Dashboard {
  const today = startOfDay(new Date())
  const total = rows.reduce((sum, row) => sum + toNumber(row.budget), 0)
  const tenders = rows
    .map((row) => enrichTender(row, total, today))
    .sort((a, b) => b.budgetValue - a.budgetValue)

  const categoryMap = new Map<string, { category: string; count: number; total: number }>()
  const bucketStats: Record<Urgency, { count: number; total: number }> = {
    overdue: { count: 0, total: 0 },
    closing_soon: { count: 0, total: 0 },
    this_month: { count: 0, total: 0 },
    later: { count: 0, total: 0 },
  }

  for (const tender of tenders) {
    const category = tender.category || "Uncategorised"
    const current = categoryMap.get(category) ?? { category, count: 0, total: 0 }
    current.count += 1
    current.total += tender.budgetValue
    categoryMap.set(category, current)
    bucketStats[tender.urgency].count += 1
    bucketStats[tender.urgency].total += tender.budgetValue
  }

  const byCategory: CategoryStat[] = [...categoryMap.values()]
    .map((entry, index) => ({
      ...entry,
      average: entry.count > 0 ? entry.total / entry.count : 0,
      share: total > 0 ? (entry.total / total) * 100 : 0,
      color: PALETTE[index % PALETTE.length],
    }))
    .sort((a, b) => b.total - a.total)

  const buckets: BucketStat[] = (Object.keys(BUCKET_META) as Urgency[]).map((key) => ({
    key,
    ...BUCKET_META[key],
    ...bucketStats[key],
  }))

  const overdue = tenders.filter((tender) => tender.urgency === "overdue").length
  const closingSoon = tenders.filter((tender) => tender.urgency === "closing_soon").length
  const active = tenders.length - overdue
  const average = tenders.length > 0 ? total / tenders.length : 0
  const nextDeadline =
    [...tenders]
      .filter((tender) => tender.daysRemaining !== null && tender.daysRemaining >= 0)
      .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0))[0] ?? null
  const largest = tenders[0] ?? null

  const insights: Insight[] = []
  if (tenders.length === 0) {
    insights.push({
      tone: "neutral",
      title: "No funded tenders yet",
      detail: "Once you commit capital to a tender it will appear here with exposure, deadline and category analytics.",
    })
  } else {
    if (largest) {
      insights.push({
        tone: "neutral",
        title: "Largest single commitment",
        detail: `${largest.title} accounts for ${largest.share.toFixed(1)}% of committed capital.`,
      })
    }
    if (byCategory.length > 0) {
      const top = byCategory[0]
      insights.push({
        tone: top.share >= 60 ? "warning" : "positive",
        title: "Sector concentration",
        detail: `${top.category} represents ${top.share.toFixed(1)}% of the portfolio across ${top.count} tender${top.count === 1 ? "" : "s"}.`,
      })
    }
    if (overdue > 0) {
      insights.push({
        tone: "warning",
        title: "Overdue exposure",
        detail: `${overdue} commitment${overdue === 1 ? " is" : "s are"} past deadline. Review delivery before committing more capital.`,
      })
    } else if (closingSoon > 0) {
      insights.push({
        tone: "warning",
        title: "Deadlines approaching",
        detail: `${closingSoon} commitment${closingSoon === 1 ? "" : "s"} close within the next 7 days.`,
      })
    } else {
      insights.push({
        tone: "positive",
        title: "Deadlines under control",
        detail: "No commitments are overdue and none close within the next 7 days.",
      })
    }
    if (byCategory.length > 1) {
      insights.push({
        tone: "positive",
        title: "Diversification",
        detail: `Capital is spread across ${byCategory.length} categories, reducing single-sector risk.`,
      })
    }
  }

  return {
    lenderName,
    tenders,
    byCategory,
    buckets,
    insights,
    total,
    average,
    active,
    closingSoon,
    overdue,
    nextDeadline,
    largest,
  }
}

function buildMonthly(tenders: EnrichedTender[], monthsBack: number): MonthStat[] {
  const now = new Date()
  const slots = new Map<string, MonthStat>()
  const series: MonthStat[] = []

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const stat: MonthStat = {
      key,
      label: date.toLocaleString("en", { month: "short" }),
      total: 0,
      count: 0,
    }
    slots.set(key, stat)
    series.push(stat)
  }

  for (const tender of tenders) {
    if (!tender.created_at) continue
    const date = new Date(tender.created_at)
    if (Number.isNaN(date.getTime())) continue
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const slot = slots.get(key)
    if (slot) {
      slot.total += tender.budgetValue
      slot.count += 1
    }
  }

  return series
}

function allocationDisplay(byCategory: CategoryStat[]): CategoryStat[] {
  if (byCategory.length <= 6) return byCategory
  const top = byCategory.slice(0, 5)
  const rest = byCategory.slice(5)
  const otherTotal = rest.reduce((sum, entry) => sum + entry.total, 0)
  const otherCount = rest.reduce((sum, entry) => sum + entry.count, 0)
  return [
    ...top,
    {
      category: "Other",
      count: otherCount,
      total: otherTotal,
      average: otherCount > 0 ? otherTotal / otherCount : 0,
      share: rest.reduce((sum, entry) => sum + entry.share, 0),
      color: "#94a3b8",
    },
  ]
}

function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#f5f7f3] to-cyan-50 dark:from-[#050b09] dark:via-[#070d0a] dark:to-[#04120f]" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16,185,129,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.14) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 80% 60% at 40% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 40% 0%, #000 35%, transparent 100%)",
        }}
      />
      <div className="animate-drift absolute -left-24 top-0 h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/15" />
      <div className="animate-drift-reverse absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-500/10" />
      <div className="animate-glow absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl dark:bg-teal-500/10" />
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
              <Image src="/mkulima-logo.svg" alt="MIZANI" width={40} height={40} className="h-10 w-10" priority />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-stone-900 dark:text-white">MIZANI</span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-700/70 dark:text-emerald-300/70">
                Lender workspace
              </span>
            </span>
          </Link>

          <nav className="mt-6 flex-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              Menu
            </p>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                      item.active
                        ? "bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20"
                        : "text-stone-600 hover:bg-white/50 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    <span className="opacity-80">{item.icon}</span>
                    {item.label}
                    {item.active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/60 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-200">Portfolio scope</p>
              <p className="mt-1 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                Tenders linked by <span className="font-mono text-emerald-700 dark:text-emerald-300">lender_id</span>{" "}
                to <span className="font-mono text-emerald-700 dark:text-emerald-300">users.id</span>
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-2.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 text-xs font-bold text-white shadow-inner">
                {getInitials(lenderName)}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-xs font-semibold text-stone-800 dark:text-stone-100">
                  {lenderName || "Lender"}
                </span>
                <span className="block truncate text-[10px] text-stone-500 dark:text-stone-400">
                  ID {lenderId ?? "—"}
                </span>
              </span>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="rounded-full p-1.5 text-stone-400 transition hover:bg-white/60 hover:text-rose-500 dark:hover:bg-white/10"
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

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  const safe = data.length > 1 ? data : [0, 0]
  const width = 100
  const height = 32
  const max = Math.max(...safe, 1)
  const min = Math.min(...safe, 0)
  const span = max - min || 1
  const points = safe
    .map((value, index) => {
      const x = safe.length === 1 ? width / 2 : (index / (safe.length - 1)) * width
      const y = height - 3 - ((value - min) / span) * (height - 6)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-24 shrink-0 overflow-visible" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
  spark,
  delta,
}: {
  label: string
  value: string
  hint: string
  icon: ReactNode
  accent: { bg: string; text: string; stroke: string }
  spark: number[]
  delta?: number | null
}) {
  return (
    <div className="liquid-glass-panel glass-hover relative overflow-hidden rounded-3xl p-5">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/25"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-stone-900 dark:text-white">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/50 dark:ring-white/10 ${accent.bg} ${accent.text}`}>
          {icon}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-[11px] leading-snug text-stone-500 dark:text-stone-400">{hint}</p>
        <Sparkline data={spark} stroke={accent.stroke} />
      </div>
      {typeof delta === "number" && (
        <span
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            delta >= 0
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
          }`}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}% vs last month
        </span>
      )}
    </div>
  )
}

function DonutChart({ data, total }: { data: CategoryStat[]; total: number }) {
  const size = 232
  const thickness = 26
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  const segments = data
    .reduce<{ segments: { id: string; color: string; dash: number; offset: number }[]; cursor: number }>(
      (acc, entry) => {
        const fraction = total > 0 ? entry.total / total : 0
        const raw = fraction * circumference
        const dash = Math.max(raw - (data.length > 1 ? 3 : 0), 0)
        return {
          segments: [...acc.segments, { id: entry.category, color: entry.color, dash, offset: acc.cursor }],
          cursor: acc.cursor + raw,
        }
      },
      { segments: [], cursor: 0 },
    )
    .segments

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" role="img" aria-label="Portfolio allocation by category">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-stone-900/10 dark:stroke-white/10"
        />
        {segments.map((segment) => (
          <circle
            key={segment.id}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          Committed
        </span>
        <span className="mt-1 text-xl font-bold tracking-tight text-stone-900 dark:text-white">{money(total)}</span>
        <span className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
          {data.reduce((sum, entry) => sum + entry.count, 0)} tenders
        </span>
      </div>
    </div>
  )
}

function TrendChart({ data }: { data: MonthStat[] }) {
  const width = 760
  const height = 264
  const padLeft = 8
  const padRight = 8
  const padTop = 20
  const padBottom = 34
  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom
  const max = Math.max(...data.map((entry) => entry.total), 1)

  const x = (index: number) => (data.length <= 1 ? padLeft + innerW / 2 : padLeft + (index / (data.length - 1)) * innerW)
  const y = (value: number) => padTop + innerH - (value / max) * innerH

  const line = data
    .map((entry, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(entry.total).toFixed(1)}`)
    .join(" ")
  const area = data.length
    ? `${line} L${x(data.length - 1).toFixed(1)},${padTop + innerH} L${x(0).toFixed(1)},${padTop + innerH} Z`
    : ""
  const grid = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Monthly funding trend">
      <defs>
        <linearGradient id="lender-trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {grid.map((fraction, index) => (
        <line
          key={index}
          x1={padLeft}
          x2={width - padRight}
          y1={padTop + innerH * fraction}
          y2={padTop + innerH * fraction}
          className="stroke-stone-900/10 dark:stroke-white/10"
          strokeDasharray="4 8"
        />
      ))}
      {area && <path d={area} fill="url(#lender-trend-fill)" />}
      {line && (
        <path d={line} fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {data.map((entry, index) => (
        <g key={entry.key}>
          <circle cx={x(index)} cy={y(entry.total)} r="3.5" fill="#10b981" className="stroke-white dark:stroke-[#0b1310]" strokeWidth="1.6">
            <title>{`${entry.label}: ${money(entry.total)}`}</title>
          </circle>
          {(data.length <= 12 || index % 2 === 0 || index === data.length - 1) && (
            <text x={x(index)} y={height - 12} textAnchor="middle" className="fill-stone-400 text-[10px] dark:fill-stone-500">
              {entry.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

function StatusPill({ urgency }: { urgency: Urgency }) {
  const styles: Record<Urgency, { label: string; className: string }> = {
    overdue: { label: "Overdue", className: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300" },
    closing_soon: { label: "Closing soon", className: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-300" },
    this_month: { label: "Active", className: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-300" },
    later: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300" },
  }
  const style = styles[urgency]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${style.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  )
}

export default function LenderHomepage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <LenderHomepageContent />
    </Suspense>
  )
}

function DashboardFallback() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <AmbientBackground />
      <div className="liquid-glass relative flex flex-col items-center gap-3 rounded-3xl px-10 py-10 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/25 border-t-emerald-500" />
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">Loading lender portfolio</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Scoping tenders by{" "}
          <span className="font-mono text-emerald-700/80 dark:text-emerald-300/80">lender_id</span>
        </p>
      </div>
    </div>
  )
}

function LenderHomepageContent() {
  const [rows, setRows] = useState<RawTender[]>([])
  const [lenderName, setLenderName] = useState("")
  const [lenderId, setLenderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"insights" | "tender" | null>(null)
  const [range, setRange] = useState<6 | 12 | 24>(12)
  const [filter, setFilter] = useState("all")

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
          setError("We could not load your portfolio. Confirm the API is running and try again.")
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

  const dashboard = useMemo(() => computeDashboard(rows, lenderName), [rows, lenderName])
  const monthly = useMemo(() => buildMonthly(dashboard.tenders, range), [dashboard.tenders, range])
  const allocation = useMemo(() => allocationDisplay(dashboard.byCategory), [dashboard.byCategory])

  const filteredTenders = useMemo(() => {
    if (filter === "all") return dashboard.tenders
    return dashboard.tenders.filter((tender) => (tender.category || "Uncategorised") === filter)
  }, [dashboard.tenders, filter])

  const monthDelta = useMemo(() => {
    if (monthly.length < 2) return null
    const previous = monthly[monthly.length - 2].total
    const last = monthly[monthly.length - 1].total
    if (previous <= 0) return null
    return ((last - previous) / previous) * 100
  }, [monthly])

  const handleSignOut = () => {
    try {
      localStorage.removeItem("user_id")
      localStorage.removeItem("lender_id")
    } catch {
      /* ignore storage errors */
    }
    router.push("/loginLender")
  }

  const committedSpark = monthly.map((entry) => entry.total)
  const countSpark = monthly.map((entry) => entry.count)
  const averageSpark = monthly.map((entry) => (entry.count > 0 ? entry.total / entry.count : 0))
  const riskSpark = useMemo(
    () => [dashboard.overdue, dashboard.closingSoon, dashboard.active - dashboard.closingSoon, dashboard.tenders.length - dashboard.active],
    [dashboard],
  )

  const totalCount = dashboard.tenders.length
  const bucketTotalCount = dashboard.buckets.reduce((sum, bucket) => sum + bucket.count, 0)
  const topCommitments = dashboard.tenders.slice(0, 5)
  const maxCommitment = topCommitments[0]?.budgetValue ?? 1

  const toneStyles: Record<Insight["tone"], { ring: string; bg: string; text: string; dot: string }> = {
    positive: {
      ring: "ring-emerald-500/20",
      bg: "bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    warning: {
      ring: "ring-amber-500/20",
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    neutral: {
      ring: "ring-stone-500/15",
      bg: "bg-stone-500/10",
      text: "text-stone-600 dark:text-stone-300",
      dot: "bg-stone-400",
    },
  }

  return (
    <div className="relative flex min-h-screen">
      <AmbientBackground />

      <Sidebar lenderName={dashboard.lenderName || lenderName} lenderId={lenderId} onSignOut={handleSignOut} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-3 pt-3 lg:hidden">
          <div className="liquid-glass flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/mkulima-logo.svg" alt="MIZANI" width={30} height={30} className="h-8 w-8 rounded-lg" priority />
              <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-white">MIZANI</span>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="#tenders"
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-700 dark:text-stone-300"
              >
                Tenders
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="overview" className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Header */}
            <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="liquid-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-200">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live portfolio
                  </span>
                  <span className="rounded-full border border-white/60 bg-white/40 px-3 py-1 font-mono text-[10px] font-medium text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400">
                    lender_id: {lenderId ?? "—"}
                  </span>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                  Portfolio overview
                </h1>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {dashboard.lenderName || lenderName
                    ? `Welcome back, ${dashboard.lenderName || lenderName}. `
                    : "Welcome back. "}
                  A live read on the tenders you have funded, their exposure and upcoming deadlines.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="liquid-pill inline-flex rounded-full p-1">
                  {MONTHS_BACK.map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setRange(months)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        range === months
                          ? "bg-emerald-600 text-white shadow-[0_6px_14px_-6px_rgba(5,150,105,0.7)]"
                          : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white"
                      }`}
                    >
                      {months}M
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => load(true)}
                  className="liquid-pill inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition hover:text-emerald-700 dark:text-stone-200 dark:hover:text-emerald-200"
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

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="liquid-button inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                  Sign out
                </button>
              </div>
            </header>

            {/* Notices */}
            {!lenderId && (
              <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5 text-amber-900 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:text-amber-200">
                <div>
                  <p className="text-sm font-semibold">No lender session found</p>
                  <p className="mt-1 text-xs opacity-80">
                    Sign in as a lender, or open this page with <span className="font-mono">?lender_id=1</span> to preview
                    a portfolio.
                  </p>
                </div>
                <Link href="/loginLender" className="liquid-button inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white">
                  Sign in as lender
                </Link>
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-900 backdrop-blur-xl dark:text-rose-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                  !
                </span>
                <div>
                  <p className="text-sm font-semibold">Could not refresh portfolio</p>
                  <p className="mt-0.5 text-xs opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* KPI cards */}
            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="liquid-glass-panel h-[152px] rounded-3xl p-5">
                    <div className="skeleton h-3 w-24 rounded-full" />
                    <div className="skeleton mt-4 h-7 w-32 rounded-lg" />
                    <div className="skeleton mt-5 h-3 w-40 rounded-full" />
                  </div>
                ))
              ) : (
                <>
                  <StatCard
                    label="Total committed"
                    value={money(dashboard.total)}
                    hint={`${totalCount} funded tender${totalCount === 1 ? "" : "s"} in scope`}
                    icon={ICONS.wallet}
                    accent={ACCENTS.emerald}
                    spark={committedSpark}
                    delta={monthDelta}
                  />
                  <StatCard
                    label="Average ticket"
                    value={money(dashboard.average)}
                    hint={dashboard.largest ? `Largest: ${money(dashboard.largest.budgetValue)}` : "No tickets yet"}
                    icon={ICONS.receipt}
                    accent={ACCENTS.cyan}
                    spark={averageSpark}
                  />
                  <StatCard
                    label="Active commitments"
                    value={String(dashboard.active)}
                    hint={`${dashboard.closingSoon} closing within 7 days`}
                    icon={ICONS.layers}
                    accent={ACCENTS.indigo}
                    spark={countSpark}
                  />
                  <StatCard
                    label="Deadline risk"
                    value={String(dashboard.overdue + dashboard.closingSoon)}
                    hint={`${dashboard.overdue} overdue / ${dashboard.closingSoon} this week`}
                    icon={ICONS.clock}
                    accent={ACCENTS.amber}
                    spark={riskSpark}
                  />
                </>
              )}
            </section>

            {/* Charts */}
            <section id="portfolio" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
              {/* Trend */}
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Funding trend</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Capital committed across the last {range} months
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Monthly commitment
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {money(monthly.reduce((sum, entry) => sum + entry.total, 0))}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <TrendChart data={monthly} />
                </div>
                <div className="mt-1 grid grid-cols-3 gap-2 border-t border-white/60 pt-3 dark:border-white/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">This period</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                      {money(monthly.reduce((sum, entry) => sum + entry.total, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Tenders added</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                      {monthly.reduce((sum, entry) => sum + entry.count, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Momentum</p>
                    <p className={`mt-1 text-sm font-semibold ${monthDelta !== null && monthDelta < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-300"}`}>
                      {monthDelta === null ? "—" : `${monthDelta >= 0 ? "+" : ""}${monthDelta.toFixed(1)}%`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Donut */}
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Portfolio allocation</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Capital by category</p>
                  </div>
                  <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-stone-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                    {dashboard.byCategory.length} sectors
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <DonutChart data={allocation} total={dashboard.total} />
                  <ul className="w-full space-y-2">
                    {allocation.length === 0 && (
                      <li className="rounded-xl bg-white/40 px-3 py-2 text-center text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                        No allocation data yet
                      </li>
                    )}
                    {allocation.map((entry) => (
                      <li key={entry.category} className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="min-w-0 flex-1 truncate text-xs font-medium text-stone-700 dark:text-stone-200">
                          {entry.category}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 dark:text-white">{money(entry.total)}</span>
                        <span className="w-10 text-right text-[11px] text-stone-400 dark:text-stone-500">
                          {entry.share.toFixed(0)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Deadline exposure */}
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Deadline exposure</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Where your commitments sit in time</p>
                  </div>
                  {dashboard.overdue > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Attention
                    </span>
                  )}
                </div>

                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                  {bucketTotalCount === 0 ? (
                    <span className="h-full w-full bg-stone-300/50 dark:bg-white/10" />
                  ) : (
                    dashboard.buckets
                      .filter((bucket) => bucket.count > 0)
                      .map((bucket) => (
                        <span
                          key={bucket.key}
                          className="h-full transition-all"
                          style={{ width: `${(bucket.count / bucketTotalCount) * 100}%`, backgroundColor: bucket.color }}
                        />
                      ))
                  )}
                </div>

                <ul className="mt-5 space-y-3">
                  {dashboard.buckets.map((bucket) => (
                    <li key={bucket.key} className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: bucket.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{bucket.label}</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500">{bucket.hint}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-stone-900 dark:text-white">{bucket.count}</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500">{money(bucket.total)}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-2xl border border-white/60 bg-white/40 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">Next deadline</p>
                  <p className="mt-1 truncate text-xs font-semibold text-stone-800 dark:text-stone-100">
                    {dashboard.nextDeadline ? dashboard.nextDeadline.title : "Nothing upcoming"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                    {dashboard.nextDeadline
                      ? `${formatDate(dashboard.nextDeadline.deadline)} · ${deadlineLabel(dashboard.nextDeadline.daysRemaining)}`
                      : "Add a tender to start tracking deadlines"}
                  </p>
                </div>
              </div>

              {/* Top commitments */}
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-7">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Largest commitments</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Your biggest capital deployments</p>
                  </div>
                  <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-stone-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                    Top {topCommitments.length}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {topCommitments.length === 0 && (
                    <li className="rounded-2xl bg-white/40 px-4 py-6 text-center text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                      No commitments recorded yet.
                    </li>
                  )}
                  {topCommitments.map((tender, index) => {
                    const category = dashboard.byCategory.find(
                      (entry) => entry.category === (tender.category || "Uncategorised"),
                    )
                    const color = category?.color ?? PALETTE[index % PALETTE.length]
                    const width = maxCommitment > 0 ? (tender.budgetValue / maxCommitment) * 100 : 0
                    return (
                      <li key={tender.id}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/60 text-[11px] font-bold text-stone-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="truncate text-xs font-semibold text-stone-800 dark:text-stone-100">
                                {tender.title}
                              </p>
                              <p className="shrink-0 text-xs font-semibold text-stone-900 dark:text-white">
                                {money(tender.budgetValue)}
                              </p>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                              <span className="block h-full rounded-full" style={{ width: `${Math.max(width, 3)}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/60 pt-3 dark:border-white/10">
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Average ticket {money(dashboard.average)} across {totalCount} tenders
                  </p>
                  <a href="#tenders" className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
                    View tender register
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Analyst notes */}
              <div id="insights" className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Analyst notes</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Automated portfolio read-out</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-white/50 dark:text-emerald-300 dark:ring-white/10">
                    {ICONS.spark}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {dashboard.insights.map((insight) => {
                    const tone = toneStyles[insight.tone]
                    return (
                      <li key={insight.title} className={`rounded-2xl p-3 ring-1 ${tone.bg} ${tone.ring}`}>
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                          <p className={`text-[11px] font-semibold ${tone.text}`}>{insight.title}</p>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                          {insight.detail}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Category performance */}
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl p-5 xl:col-span-8">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Category performance</h2>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Exposure, average ticket and share</p>
                  </div>
                  <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-stone-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                    {dashboard.byCategory.length} categories
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto scrollbar-none">
                  <div className="min-w-[520px]">
                    <div className="grid grid-cols-12 gap-3 border-b border-white/60 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 dark:border-white/10 dark:text-stone-500">
                      <span className="col-span-4">Category</span>
                      <span className="col-span-2 text-right">Tenders</span>
                      <span className="col-span-2 text-right">Avg ticket</span>
                      <span className="col-span-2 text-right">Committed</span>
                      <span className="col-span-2 text-right">Share</span>
                    </div>
                    <ul className="divide-y divide-white/50 dark:divide-white/5">
                      {dashboard.byCategory.length === 0 && (
                        <li className="py-6 text-center text-xs text-stone-500 dark:text-stone-400">No category data yet</li>
                      )}
                      {dashboard.byCategory.map((entry) => (
                        <li key={entry.category} className="grid grid-cols-12 items-center gap-3 py-2.5">
                          <span className="col-span-4 flex items-center gap-2 truncate text-xs font-medium text-stone-700 dark:text-stone-200">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="truncate">{entry.category}</span>
                          </span>
                          <span className="col-span-2 text-right text-xs text-stone-600 dark:text-stone-300">{entry.count}</span>
                          <span className="col-span-2 text-right text-xs text-stone-600 dark:text-stone-300">{money(entry.average)}</span>
                          <span className="col-span-2 text-right text-xs font-semibold text-stone-900 dark:text-white">{money(entry.total)}</span>
                          <span className="col-span-2 flex items-center justify-end gap-2">
                            <span className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-stone-900/5 sm:block dark:bg-white/10">
                              <span className="block h-full rounded-full" style={{ width: `${entry.share}%`, backgroundColor: entry.color }} />
                            </span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">{entry.share.toFixed(0)}%</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Tender register */}
            <section id="tenders" className="mt-4">
              <div className="liquid-glass-panel relative overflow-hidden rounded-3xl">
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Tender register</h2>
                      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                        Every tender linked to your lender profile
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-stone-500 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                        {filteredTenders.length} of {totalCount}
                      </span>
                      <Link
                        href="/tenders"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-[11px] font-semibold text-stone-700 transition hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:text-emerald-200"
                      >
                        Browse marketplace
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                        filter === "all"
                          ? "bg-emerald-600 text-white shadow-[0_6px_14px_-6px_rgba(5,150,105,0.7)]"
                          : "bg-white/50 text-stone-600 ring-1 ring-white/60 hover:text-stone-900 dark:bg-white/5 dark:text-stone-300 dark:ring-white/10 dark:hover:text-white"
                      }`}
                    >
                      All categories
                    </button>
                    {dashboard.byCategory.map((entry) => (
                      <button
                        key={entry.category}
                        type="button"
                        onClick={() => setFilter(entry.category)}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                          filter === entry.category
                            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                            : "bg-white/50 text-stone-600 ring-1 ring-white/60 hover:text-stone-900 dark:bg-white/5 dark:text-stone-300 dark:ring-white/10 dark:hover:text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden grid-cols-12 gap-4 border-y border-white/60 bg-white/30 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 lg:grid dark:border-white/10 dark:bg-white/5 dark:text-stone-500">
                  <span className="col-span-4">Tender</span>
                  <span className="col-span-2">Category</span>
                  <span className="col-span-2">Budget</span>
                  <span className="col-span-2">Deadline</span>
                  <span className="col-span-2">Portfolio share</span>
                </div>

                <div className="divide-y divide-white/50 dark:divide-white/5">
                  {loading &&
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-12 lg:items-center lg:gap-4">
                        <div className="lg:col-span-4">
                          <div className="skeleton h-3 w-48 rounded-full" />
                          <div className="skeleton mt-2 h-2.5 w-32 rounded-full" />
                        </div>
                        <div className="skeleton h-3 w-20 rounded-full lg:col-span-2" />
                        <div className="skeleton h-3 w-20 rounded-full lg:col-span-2" />
                        <div className="skeleton h-3 w-24 rounded-full lg:col-span-2" />
                        <div className="skeleton h-2 w-24 rounded-full lg:col-span-2" />
                      </div>
                    ))}

                  {!loading && filteredTenders.length === 0 && (
                    <div className="px-5 py-12 text-center">
                      <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {totalCount === 0 ? "No tenders linked to this lender yet" : "No tenders in this category"}
                      </p>
                      <p className="mx-auto mt-1 max-w-sm text-xs text-stone-500 dark:text-stone-400">
                        {totalCount === 0
                          ? "Tenders are scoped by lender_id. Add a tender against this lender to populate the portfolio."
                          : "Choose another category filter to see the rest of your portfolio."}
                      </p>
                    </div>
                  )}

                  {!loading &&
                    filteredTenders.map((tender) => {
                      const category = dashboard.byCategory.find(
                        (entry) => entry.category === (tender.category || "Uncategorised"),
                      )
                      const color = category?.color ?? PALETTE[0]
                      return (
                        <div
                          key={tender.id}
                          className="grid grid-cols-1 gap-3 px-5 py-4 transition hover:bg-white/40 lg:grid-cols-12 lg:items-center lg:gap-4 dark:hover:bg-white/5"
                        >
                          <div className="lg:col-span-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{tender.title}</p>
                              <StatusPill urgency={tender.urgency} />
                            </div>
                            <p className="mt-1 line-clamp-1 text-[11px] text-stone-500 dark:text-stone-400">
                              {tender.description || "No description provided"}
                            </p>
                          </div>

                          <div className="lg:col-span-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-semibold text-stone-600 ring-1 ring-white/70 dark:bg-white/10 dark:text-stone-300 dark:ring-white/10">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                              {tender.category || "Uncategorised"}
                            </span>
                          </div>

                          <div className="lg:col-span-2">
                            <p className="text-xs font-semibold text-stone-900 dark:text-white">{money(tender.budgetValue)}</p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500">{moneyExact(tender.budgetValue)}</p>
                          </div>

                          <div className="lg:col-span-2">
                            <p className="text-xs font-medium text-stone-700 dark:text-stone-200">{formatDate(tender.deadline)}</p>
                            <p
                              className={`text-[10px] font-semibold ${
                                tender.urgency === "overdue"
                                  ? "text-rose-500"
                                  : tender.urgency === "closing_soon"
                                    ? "text-amber-600 dark:text-amber-300"
                                    : "text-stone-400 dark:text-stone-500"
                              }`}
                            >
                              {deadlineLabel(tender.daysRemaining)}
                            </p>
                          </div>

                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-2">
                              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-900/5 dark:bg-white/10">
                                <span
                                  className="block h-full rounded-full"
                                  style={{ width: `${Math.max(tender.share, 2)}%`, backgroundColor: color }}
                                />
                              </span>
                              <span className="w-9 text-right text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                                {tender.share.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </section>

            <footer className="mt-6 flex flex-col gap-2 px-1 pb-4 text-[11px] text-stone-400 sm:flex-row sm:items-center sm:justify-between dark:text-stone-500">
              <p>
                Portfolio scoped by <span className="font-mono text-emerald-700/80 dark:text-emerald-300/80">lender_id</span>{" "}
                to <span className="font-mono text-emerald-700/80 dark:text-emerald-300/80">users.id</span>.
              </p>
              <p>
                {source ? (
                  <>
                    Source:{" "}
                    <span className="font-mono">
                      {source === "insights" ? "/insights/lender/:lender_id" : "/tender/:lender_id"}
                    </span>
                  </>
                ) : (
                  "Awaiting data"
                )}
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

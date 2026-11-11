import Link from "next/link";
import Navbar from "@/components/Navbar";

const categories = ["Construction", "ICT & Software", "Supply & Delivery", "Consultancy"];

const tenders = [
  {
    title: "Supply of Solar Water Pumps — Phase II",
    buyer: "Ministry of Water & Sanitation",
    location: "Nairobi",
    tag: "Supply",
    closes: "Closes in 3 days",
  },
  {
    title: "Construction of County Access Roads",
    buyer: "Kiambu County Government",
    location: "Kiambu",
    tag: "Works",
    closes: "Closes in 6 days",
  },
  {
    title: "Enterprise Data Analytics Platform",
    buyer: "Kenya Revenue Authority",
    location: "Nairobi",
    tag: "ICT",
    closes: "Closes in 9 days",
  },
];

const stats = [
  { value: "12,480", label: "Open tenders" },
  { value: "KSh 84B", label: "Contract value tracked" },
  { value: "1,200+", label: "Verified buyers" },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-[#f5f7f3] to-[#f5f7f3] dark:from-emerald-950/40 dark:via-[#070d0a] dark:to-[#070d0a]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(16,185,129,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.14) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div className="animate-drift absolute -left-24 top-10 h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/15" />
        <div className="animate-drift-reverse absolute -right-20 top-32 h-96 w-96 rounded-full bg-lime-300/25 blur-3xl dark:bg-lime-400/10" />
        <div className="animate-glow absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />
      </div>

      <Navbar />

      <main className="flex-1 px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <span className="liquid-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Tender intelligence for businesses that move first
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl md:text-6xl dark:text-white">
            Find the tenders
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent dark:from-emerald-300 dark:via-emerald-400 dark:to-lime-300">
              worth winning.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
            MIZANI surfaces relevant public and private tenders the moment they are published, matches them
            to what you actually deliver, and keeps every deadline in view.
          </p>

          {/* Search */}
          <div className="liquid-glass mt-9 flex w-full max-w-2xl flex-col gap-2 rounded-[24px] p-2 sm:flex-row sm:items-center sm:rounded-full">
            <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5 shrink-0 text-stone-400 dark:text-stone-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search tenders, buyers, categories…"
                aria-label="Search tenders"
                className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 outline-none dark:text-white dark:placeholder-stone-500"
              />
            </div>
            <Link
              href="#tenders"
              className="liquid-button flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              Search tenders
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="liquid-pill rounded-full px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-200"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="liquid-glass-panel rounded-2xl px-5 py-4 text-center"
            >
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Live tenders */}
        <section id="tenders" className="mx-auto mt-16 w-full max-w-5xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                Live tenders, matched to you
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                A live feed of opportunities your business can actually pursue.
              </p>
            </div>
            <Link
              href="#tenders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              View all tenders
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {tenders.map((tender) => (
              <article
                key={tender.title}
                className="liquid-glass-panel group flex flex-col rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
                    {tender.tag}
                  </span>
                  <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                    {tender.closes}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug text-stone-900 dark:text-white">
                  {tender.title}
                </h3>
                <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{tender.buyer}</p>
                <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-stone-500 dark:text-stone-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {tender.location}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 px-4 py-6 text-center text-xs text-stone-500 dark:border-white/10 dark:text-stone-500">
        © MIZANI — Turning procurement data into commercial advantage.
      </footer>
    </div>
  );
}

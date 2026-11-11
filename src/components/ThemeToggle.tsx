"use client";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextIsDark);
    try {
      localStorage.setItem("mizani-theme", nextIsDark ? "dark" : "light");
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title="Toggle dark and light mode"
      className="theme-toggle group relative inline-flex h-9 w-[70px] shrink-0 items-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <span className="theme-toggle__thumb pointer-events-none absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-amber-500 dark:hidden"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hidden h-4 w-4 text-emerald-950 dark:block"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-1 hidden h-3.5 w-3.5 text-stone-400 transition-colors duration-300 group-hover:text-amber-500 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-auto mr-1 block h-3.5 w-3.5 text-stone-400 transition-colors duration-300 group-hover:text-emerald-600 dark:hidden"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}

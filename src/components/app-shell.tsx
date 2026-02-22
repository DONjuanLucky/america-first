"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  Bot,
  ChartColumnIncreasing,
  Compass,
  Handshake,
  Home,
  Landmark,
  Moon,
  Newspaper,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAppState } from "@/components/providers/app-provider";
import { useTheme } from "next-themes";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/explorer", label: "Explorer", icon: Compass },
  { href: "/perspectives", label: "Perspectives", icon: Landmark },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/forum", label: "Forum", icon: Users },
  { href: "/action", label: "Action", icon: Handshake },
  { href: "/assistant", label: "Assistant", icon: Bot },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, preferences, signOut } = useAppState();
  const { theme, setTheme } = useTheme();
  const navItems = user?.isAdmin
    ? [...baseNavItems, { href: "/admin/perspectives", label: "Admin", icon: BadgeCheck }]
    : baseNavItems;
  const initials = user?.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-4 py-5 md:px-8 md:py-8">
      <aside className="glass-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 rounded-3xl p-5 lg:flex lg:flex-col">
        <Link href="/" className="rounded-2xl border border-[#d7e3f0] bg-white p-4">
          <p className="text-xs font-bold tracking-[0.16em] text-[#5f6f84]">AMERICA FIRST</p>
          <p className="font-heading mt-1 text-2xl leading-tight text-[#11294a]">Civic Intelligence</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Informed citizens. Stronger democracy.</p>
        </Link>

        <div className="mt-3 rounded-2xl bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#1a3a6b] text-xs font-bold text-white">
              {initials || "AF"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#11294a]">{user?.name || "Guest"}</p>
              <p className="text-xs text-[#5f6f84]">{user?.email || "No email set"}</p>
            </div>
          </div>
          {user?.isAdmin && (
            <p className="mt-2 inline-flex rounded-full bg-[#fff2ee] px-2 py-1 text-[10px] font-bold tracking-wide text-[#9b352b]">
              ADMIN ACCESS
            </p>
          )}
          <p className="mt-2 text-xs text-[#5f6f84]">
            Tracking {preferences.trackedIssues.length} issues and {preferences.trackedReps.length} representatives.
          </p>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#d4deeb] px-3 py-2 text-xs font-semibold text-[#11294a] hover:bg-[#f4f8fd]"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full rounded-lg border border-[#d4deeb] px-3 py-2 text-xs font-semibold text-[#11294a] hover:bg-[#f4f8fd]"
          >
            Sign out
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "text-white" : "text-[#11294a] hover:bg-white/80"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-xl bg-[#1a3a6b]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#0a1628] p-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4 text-[#d4a017]" />
            Notifications
          </div>
          <p className="mt-2 text-xs text-[#d2deed]">3 hearings, 2 bills, and 1 voter deadline near you.</p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#c0392b] px-3 py-2 text-xs font-bold"
          >
            <ChartColumnIncreasing className="h-3.5 w-3.5" />
            Open activity
          </button>
        </div>
      </aside>

      <div className="flex-1 pb-20 lg:pb-0">{children}</div>

      <nav className="glass-card fixed inset-x-4 bottom-3 z-30 flex items-center gap-1 overflow-x-auto rounded-2xl px-2 py-1.5 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[66px] flex-col items-center rounded-xl py-2 text-[11px] font-medium ${
                active ? "bg-[#1a3a6b] text-white" : "text-[#5f6f84]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

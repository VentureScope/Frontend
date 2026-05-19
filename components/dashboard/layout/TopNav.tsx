"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type TopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

const DASHBOARD_SEARCH_ITEMS = [
  { label: "Dashboard Overview", path: "/dashboard" },
  { label: "Learning Path", path: "/dashboard/learning-path" },
  { label: "New Roadmap", path: "/dashboard/learning-path/new-roadmap" },
  { label: "AI Advisor", path: "/dashboard/ai-advisor" },
  { label: "Resume Builder", path: "/dashboard/resume-builder" },
  { label: "New Resume", path: "/dashboard/resume-builder/new-resume" },
  { label: "Data Hub", path: "/dashboard/data-hub" },
  { label: "Market Trends", path: "/dashboard/market-trends" },
  { label: "Settings", path: "/dashboard/settings" },
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Organizations", path: "/dashboard/organization" },
  { label: "Create Organization", path: "/dashboard/organization/new" },
  { label: "My Org Profile", path: "/dashboard/organization/profile" },
  { label: "Org Advisor", path: "/dashboard/organization/advisor" },
  { label: "Pending Invites", path: "/dashboard/organization/invites" },
];

export default function TopNav({ breadcrumb, onMenuClick }: TopNavProps) {
  const router = useRouter();
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!searchRef.current) return;
      const target = event.target as Node;
      if (!searchRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return DASHBOARD_SEARCH_ITEMS.slice(0, 6);
    return DASHBOARD_SEARCH_ITEMS.filter((item) =>
      `${item.label} ${item.path}`.toLowerCase().includes(trimmed),
    ).slice(0, 6);
  }, [query]);

  const showResults = isOpen;

  function handleSelect(path: string) {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-label hidden text-primary sm:block">
            VentureScope
          </p>
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {breadcrumb}
          </h1>
        </div>

        <div
          ref={searchRef}
          className="relative hidden max-w-md flex-1 md:block md:max-w-xs lg:max-w-sm xl:max-w-md"
        >
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search resources.."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && matches[0]) {
                event.preventDefault();
                handleSelect(matches[0].path);
              }
            }}
            className="h-9 w-full rounded-md border border-border bg-muted pl-10 pr-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20"
          />
          {showResults && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-border bg-card shadow-lg"
              onMouseDown={(event) => event.preventDefault()}
            >
              {matches.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                matches.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(item.path)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.path}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <button
          type="button"
          className="relative hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>
        <Link
          href="/dashboard/profile"
          className={cn(
            "ml-1 flex h-9 w-9 overflow-hidden rounded-full border border-border sm:h-10 sm:w-10",
            "ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30",
          )}
        >
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-full w-full object-cover bg-muted"
          />
        </Link>
      </div>
    </header>
  );
}

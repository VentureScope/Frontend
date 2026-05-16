"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import Link from "next/link";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "@/components/theme-toggle";

type TopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

export default function TopNav({ breadcrumb, onMenuClick }: TopNavProps) {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-10 backdrop-blur-md">
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:block text-sm font-bold text-primary">
          {breadcrumb}
        </div>

        <div className="relative w-48 sm:w-80 max-w-[40vw] hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search career insights..."
            className="h-10 sm:h-11 w-full rounded-full bg-muted pl-11 pr-4 text-xs sm:text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <ThemeToggle />
        <button className="hidden sm:block relative text-muted-foreground hover:text-foreground transition-colors">
          <Search size={20} />
        </button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-background bg-primary"></span>
        </button>
        <button className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle size={20} />
        </button>
        <Link href="/dashboard/profile">
          <div className="h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-border">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-full w-full object-cover bg-muted"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VentureScopeLogo } from "@/components/brand/VentureScopeLogo";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { performClientLogout } from "@/lib/client-logout";
import { useLandingAuth } from "@/hooks/useLandingAuth";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Market Insights", href: "/market-insight" },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    isHydrated,
    isAuthenticated,
    dashboardHref,
    signInHref,
    registerHref,
  } = useLandingAuth();
  const isLoggingOut = useAppStore((state) => state.isLoggingOut);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("overflow-hidden", isMobileMenuOpen);
    return () => {
      root.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  async function handleLogout() {
    setIsMobileMenuOpen(false);
    await performClientLogout();
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <VentureScopeLogo size={28} />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              VentureScope
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex pb-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-btn relative pb-1 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:rounded-lg after:bg-primary after:transition-opacity",
                    isActive
                      ? "font-medium text-primary after:w-full after:opacity-100"
                      : "text-muted-foreground after:w-full after:opacity-0 hover:text-foreground",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {!isHydrated ? (
              <div className="h-10 w-44 rounded-lg bg-muted" aria-hidden />
            ) : isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-primary/50 px-6 text-foreground hover:bg-muted hover:text-foreground"
                >
                  <Link href={dashboardHref}>Dashboard</Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="rounded-lg border-border px-6 text-foreground hover:bg-muted"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={signInHref}
                  className="text-btn font-medium text-foreground hover:text-primary"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className="rounded-lg bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  <Link href={registerHref}>Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground focus:outline-none p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-6 w-6 shrink-0" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 flex h-dvh w-4/5 max-w-sm flex-col bg-card shadow-2xl transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <VentureScopeLogo size={24} />
            <span className="font-bold tracking-tight text-foreground">
              VentureScope
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80 transition-colors"
            aria-label="Close Mobile Menu"
          >
            <X className="h-5 w-5 shrink-0" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center border-l-2 py-1 pl-3 text-base transition-colors ${
                    isActive
                      ? "border-primary font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggle variant="pill" />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8">
            {!isHydrated ? (
              <div className="h-24 w-full rounded-lg bg-muted" aria-hidden />
            ) : isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center rounded-lg border-primary/50 py-6 text-base font-medium hover:bg-muted"
                >
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="w-full justify-center rounded-full py-6 text-base font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center rounded-lg border-border py-6 text-base font-bold text-foreground hover:bg-muted"
                >
                  <Link
                    href={signInHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center rounded-lg bg-primary py-6 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Link
                    href={registerHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Market Insights", href: "/market-insight" },
];

export default function Navbar() {
  const pathname = usePathname();
  const token = useAppStore((state) => state.authData.token);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const isAuthenticated = Boolean(token);
  // const isAuthenticated = true;
  const navLinks = NAV_LINKS;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Calculate sliding underline indicator styles for active desktop nav link
  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => link.href === pathname);

    // Slight delay to ensure refs are firmly mounted before calc
    const timer = setTimeout(() => {
      if (activeIndex !== -1 && linksRef.current[activeIndex]) {
        const activeTab = linksRef.current[activeIndex];
        if (activeTab) {
          setIndicatorStyle({
            left: activeTab.offsetLeft,
            width: activeTab.offsetWidth,
            opacity: 1,
          });
        }
      } else {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, navLinks]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Always clear local auth so users can exit even if backend logout fails.
    } finally {
      clearAuth();
      setIsMobileMenuOpen(false);
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="VentureScope Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
              VentureScope
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex relative pb-1">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  ref={(el) => {
                    linksRef.current[index] = el;
                  }}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "font-bold text-primary"
                      : "font-medium text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Animated Sliding Underline for Desktop */}
            <span
              className="absolute -bottom-1 h-0.75 rounded-full bg-primary transition-all duration-500 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border px-6 font-bold text-foreground hover:bg-muted"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-full bg-primary px-6 font-bold text-white hover:bg-primary/90"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-foreground hover:text-primary"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className="bg-primary font-bold hover:bg-primary/90 rounded-full px-6"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground focus:outline-none p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-6 w-6 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Slide-out */}
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
            <Image
              src="/logo.png"
              alt="VentureScope Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg transition-colors flex items-center ${
                    isActive
                      ? "font-bold text-primary"
                      : "font-medium text-muted-foreground hover:text-primary"
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
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center rounded-full border-border py-6 text-base font-bold text-foreground hover:bg-muted"
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-center rounded-full bg-primary py-6 text-base font-bold text-white hover:bg-primary/90"
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
                  className="w-full justify-center rounded-full border-border py-6 text-base font-bold text-foreground hover:bg-muted"
                >
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center rounded-full bg-primary py-6 text-base font-bold text-white hover:bg-primary/90"
                >
                  <Link
                    href="/register"
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

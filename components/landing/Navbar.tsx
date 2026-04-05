"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, LogOut } from "lucide-react";
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
      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
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
                      ? "font-bold text-blue-600"
                      : "font-medium text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Animated Sliding Underline for Desktop */}
            <span
              className="absolute -bottom-1 h-0.75 rounded-full bg-blue-600 transition-all duration-500 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-200 px-6 font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-full bg-[#1d59db] px-6 font-bold text-white hover:bg-blue-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-slate-700 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  className="bg-[#1d59db] font-bold hover:bg-blue-700 rounded-full px-6"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-900 focus:outline-none p-2 -mr-2"
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
        className={`fixed top-0 right-0 z-50 flex h-dvh w-4/5 max-w-sm flex-col bg-white shadow-2xl transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Sparkles className="h-5 w-5 text-blue-600 fill-blue-600" />
            <span className="font-bold tracking-tight text-slate-900">
              VentureScope
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors"
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
                      ? "font-bold text-blue-600"
                      : "font-medium text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-8">
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center rounded-full border-slate-200 py-6 text-base font-bold text-slate-700 hover:bg-slate-50"
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
                  className="w-full justify-center rounded-full bg-[#1d59db] py-6 text-base font-bold text-white hover:bg-blue-700"
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
                  className="w-full justify-center rounded-full border-slate-200 py-6 text-base font-bold text-slate-700 hover:bg-slate-50"
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
                  className="w-full justify-center rounded-full bg-[#1d59db] py-6 text-base font-bold text-white hover:bg-blue-700"
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

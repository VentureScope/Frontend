import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}

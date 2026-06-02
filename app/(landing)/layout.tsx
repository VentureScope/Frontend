import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      <main className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/25 selection:text-foreground">
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
}

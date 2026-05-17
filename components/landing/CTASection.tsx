import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="vs-band relative mx-auto max-w-7xl overflow-hidden rounded-xl p-8 sm:p-12 lg:p-24">
        <div
          className="pointer-events-none absolute -left-1/10 -top-1/5 h-75 w-75 rounded-lg bg-primary/20 blur-[80px] sm:h-125 sm:w-125 sm:blur-[120px]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center sm:space-y-10">
          <h2 className="text-h1 leading-tight">Ready to upgrade your professional intelligence?</h2>
          <p className="text-body vs-band-muted">
            Join thousands of Ethiopian tech professionals who are using
            VentureScope to navigate their career paths.
          </p>
          <div className="flex flex-col flex-wrap justify-center gap-3 pt-4 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-md px-8 font-semibold sm:h-14 sm:w-auto sm:px-10"
            >
              <Link href="/register">Create Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 px-8 font-semibold text-inverse-foreground hover:bg-inverse-foreground/15 sm:h-14 sm:w-auto sm:px-10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


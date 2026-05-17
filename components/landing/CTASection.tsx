import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-foreground p-8 sm:rounded-xl sm:p-12 lg:p-24">
        {/* Background glow */}
        <div className="absolute -left-1/10 -top-1/5 h-75 w-75 rounded-lg bg-muted-foreground/10 blur-[80px] sm:h-125 sm:w-125 sm:blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-6 sm:space-y-10">
          <h2 className="text-h1 text-background leading-tight">
            Ready to upgrade your professional intelligence?
          </h2>
          <p className="text-body text-background/70">
            Join thousands of Ethiopian tech professionals who are using
            VentureScope to navigate their career paths.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4">
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
              className="h-12 w-full rounded-xl border-background/20 bg-background/10 px-8 font-bold text-background hover:bg-background/20 sm:h-14 sm:w-auto sm:px-10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminLogin, getApiErrorMessage } from "@/lib/admin-auth-api";
import { isAdminDemoEnabled } from "@/lib/admin-utils";
import { resolveAdminReturnPath } from "@/lib/auth-redirect";
import { useAdminStore } from "@/store/useAdminStore";
import type { AdminSignInPayload } from "@/types/admin-auth";

const schema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(1, "Password is required"),
});

function AdminSignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postAuthPath = resolveAdminReturnPath(searchParams);
  const setAuthData = useAdminStore((s) => s.setAuthData);
  const token = useAdminStore((s) => s.authData.token);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const form = useForm<AdminSignInPayload>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => setIsHydrated(true), []);
  useEffect(() => {
    if (isHydrated && token) router.replace(postAuthPath);
  }, [isHydrated, token, postAuthPath, router]);

  async function onSubmit(values: AdminSignInPayload) {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const session = await adminLogin(values);
      setAuthData(session);
      router.push(postAuthPath);
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-linear-to-b from-primary/5 via-background to-background p-4 sm:p-8">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="VentureScope"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div>
              <p className="text-label text-primary">VentureScope</p>
              <h1 className="text-xl font-semibold text-foreground">Admin sign in</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Platform administration. Separate from the member dashboard.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-6 py-6 sm:px-8 sm:py-8"
        >
          <Field>
            <FieldLabel htmlFor="admin-email">Email</FieldLabel>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@venturescope.dev"
              {...form.register("email")}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="admin-password">Password</FieldLabel>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </Field>

          {apiError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Enter admin console
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {isAdminDemoEnabled() ? (
          <p className="border-t border-border px-6 py-4 text-center font-mono text-xs text-muted-foreground sm:px-8">
            Demo: admin@venturescope.dev / admin123
          </p>
        ) : null}

        <p className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground sm:px-8">
          <Link href="/" className="hover:text-foreground">
            ← Home
          </Link>
          {" · "}
          <Link href="/sign-in" className="hover:text-foreground">
            Member sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AdminSignInContent />
    </Suspense>
  );
}

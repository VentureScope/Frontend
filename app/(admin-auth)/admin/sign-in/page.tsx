"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { adminLogin, getApiErrorMessage } from "@/lib/admin-auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import type { AdminSignInPayload } from "@/types/admin-auth";

const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminSignInPage() {
  const router = useRouter();
  const setAuthData = useAdminStore((state) => state.setAuthData);
  const token = useAdminStore((state) => state.authData.token);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const form = useForm<AdminSignInPayload>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && token) {
      router.replace("/admin");
    }
  }, [isHydrated, token, router]);

  async function onSubmit(values: AdminSignInPayload) {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const session = await adminLogin(values);
      setAuthData(session);
      router.push("/admin");
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-primary/5 via-background to-background p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-xl sm:p-10">
        <div className="space-y-4 text-center sm:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 sm:mx-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Image
                src="/logo.png"
                alt="VentureScope"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-semibold text-muted-foreground">
                VentureScope
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform administrators only. This session is separate from the
              member dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="••••••••"
              {...form.register("password")}
            />
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </Field>

          {apiError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {apiError}
            </p>
          ) : null}

          <Button type="submit" className="h-11 w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Enter admin console
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Demo: <span className="font-mono text-foreground">admin@venturescope.dev</span>{" "}
          / <span className="font-mono text-foreground">admin123</span>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            ← Back to VentureScope
          </Link>
          {" · "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Member sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

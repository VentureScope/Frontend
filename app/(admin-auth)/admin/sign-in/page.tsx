"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import * as z from "zod";
import { adminLogin, getApiErrorMessage } from "@/lib/admin-auth-api";
import { isAdminDemoEnabled } from "@/lib/admin-utils";
import { useAdminStore } from "@/store/useAdminStore";
import type { AdminSignInPayload } from "@/types/admin-auth";
import { adminEmeraldBtn, adminInput } from "@/components/admin/ui/admin-styles";

const schema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminSignInPage() {
  const router = useRouter();
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
    if (isHydrated && token) router.replace("/admin");
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900 p-8">
        <div className="mb-8 space-y-2">
          <p className="font-mono text-sm font-semibold text-emerald-400">◈ VentureScope</p>
          <p className="text-xs text-zinc-600">Admin Console</p>
          <h1 className="text-xl font-medium text-white">Sign in</h1>
          <p className="text-sm text-zinc-500">
            Internal platform administration. Separate from the member dashboard.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="admin-email" className="text-[10px] uppercase tracking-widest text-zinc-600">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@venturescope.dev"
              className={adminInput}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="admin-password" className="text-[10px] uppercase tracking-widest text-zinc-600">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className={adminInput}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <p className="rounded-md border border-red-800 bg-red-950 px-3 py-2 text-xs text-red-400">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${adminEmeraldBtn} flex w-full items-center justify-center gap-2 py-2 disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Enter command center
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {isAdminDemoEnabled() ? (
          <p className="mt-6 text-center font-mono text-xs text-zinc-600">
            Demo: admin@venturescope.dev / admin123
          </p>
        ) : null}

        <p className="mt-4 text-center text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← VentureScope
          </Link>
          {" · "}
          <Link href="/sign-in" className="hover:text-zinc-300">
            Member sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

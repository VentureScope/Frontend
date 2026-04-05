"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage, loginUser, registerUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";
import { RegisterPayload } from "@/types/auth";

const formSchema = z.object({
  role: z.literal("professional"),
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name is required"),
  career_interest: z.string().min(2, "Career interest is required"),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const router = useRouter();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      career_interest: "",
      role: "professional",
    },
  });

  async function onSubmit(values: RegisterPayload) {
    setApiError(null);
    setIsSubmitting(true);

    try {
      await registerUser(values);
      const loginResult = await loginUser({
        email: values.email,
        password: values.password,
      });
      setAuthData({
        token: loginResult.access_token,
        tokenType: loginResult.token_type,
        user: null,
      });
      form.reset({
        email: "",
        password: "",
        full_name: "",
        career_interest: "",
        role: "professional",
      });
      router.push("/");
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-2xl">
        {/* LEFT SIDE - BRANDING & TESTIMONIAL */}
        <section className="relative hidden w-1/2 flex-col justify-between bg-[#1d59db] p-8 shrink-0 lg:flex">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-xl font-bold tracking-tight">
                VentureScope
              </span>
            </div>

            {/* Headline */}
            <div className="max-w-md space-y-4">
              <h1 className="text-4xl font-bold leading-[1.1] text-white">
                The Intelligence Layer for Your Next Move.
              </h1>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Join 20,000+ professionals and HR leaders using data-driven
                insights to navigate career transitions with absolute clarity.
              </p>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="rounded-xl bg-white/20 p-6 backdrop-blur-md border border-white/20">
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="mb-4 text-sm font-medium leading-relaxed text-white">
              "VentureScope transformed our recruitment strategy from guesswork
              to a precision science. The AI advisor is truly elite."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/50">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                  alt="Sarah Jenkins"
                  className="h-full w-full object-cover bg-blue-200"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Sarah Jenkins
                </p>
                <p className="text-[10px] text-blue-100 uppercase tracking-widest opacity-80">
                  Director of Talent, Innovate Corp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - FORM */}
        <section className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-8 sm:px-8 lg:pl-12">
          <div className="w-full max-w-105 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="text-sm text-slate-500">
                Start your intelligence-led career journey today.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <input
                type="hidden"
                {...form.register("role")}
                value="professional"
              />

              {/* Input Fields */}
              <Field>
                <FieldLabel className="text-xs font-bold text-slate-800">
                  Full Name
                </FieldLabel>
                <Input
                  placeholder="Enter your full name"
                  {...form.register("full_name")}
                  className="h-10 text-sm border-none bg-[#f0f4ff] px-3 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                {form.formState.errors.full_name && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.full_name.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xs font-bold text-slate-800">
                  Career Interest
                </FieldLabel>
                <Input
                  placeholder="e.g. Data Science, Product Management"
                  {...form.register("career_interest")}
                  className="h-10 text-sm border-none bg-[#f0f4ff] px-3 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                {form.formState.errors.career_interest && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.career_interest.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xs font-bold text-slate-800">
                  Work Email
                </FieldLabel>
                <Input
                  placeholder="name@company.com"
                  {...form.register("email")}
                  className="h-10 text-sm border-none bg-[#f0f4ff] px-3 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                {form.formState.errors.email && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.email.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xs font-bold text-slate-800">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="h-10 text-sm border-none bg-[#f0f4ff] px-3 pr-10 focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <FieldError className="text-[10px]">
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              {apiError && (
                <p className="text-center text-xs text-red-600">{apiError}</p>
              )}

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-white px-3 text-slate-500 uppercase tracking-wider font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Social */}
              <Button
                variant="outline"
                type="button"
                className="h-10 w-full border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:focus:bg-slate-50"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </form>

            {/* Footer Links */}
            <div className="space-y-3 text-center text-[11px]">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In to Workspace
                </Link>
              </p>
              <p className="leading-relaxed text-slate-400 px-6">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline decoration-slate-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline decoration-slate-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

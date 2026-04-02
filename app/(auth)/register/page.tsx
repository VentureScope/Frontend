"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  role: z.enum(["individual", "corporate"]),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "individual",
      fullName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* LEFT SIDE - BRANDING & TESTIMONIAL */}
      <section className="relative hidden w-full flex-col justify-between bg-[#1d59db] p-12 lg:flex lg:w-[45%] xl:w-[40%]">
        <div className="space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 fill-white" />
            <span className="text-2xl font-bold tracking-tight">
              VentureScope
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-bold leading-[1.1] text-white xl:text-6xl">
              The Intelligence Layer for Your Next Move.
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              Join 20,000+ professionals and HR leaders using data-driven
              insights to navigate career transitions with absolute clarity.
            </p>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="rounded-2xl bg-white/20 p-8 backdrop-blur-md border border-white/20">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="mb-6 text-lg font-medium leading-relaxed text-white">
            "VentureScope transformed our recruitment strategy from guesswork to
            a precision science. The AI advisor is truly elite."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/50">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                alt="Sarah Jenkins"
                className="h-full w-full object-cover bg-blue-200"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Sarah Jenkins
              </p>
              <p className="text-xs text-blue-100 uppercase tracking-widest opacity-80">
                Director of Talent, Innovate Corp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE - FORM */}
      <section className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:px-12">
        <div className="w-full max-w-[480px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="text-slate-500">
              Start your intelligence-led career journey today.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Select your role
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, "role">;
                    }) => (
                      <>
                        {/* Individual Option */}
                        <div
                          onClick={() => field.onChange("individual")}
                          className={cn(
                            "relative cursor-pointer rounded-xl border-2 p-4 transition-all",
                            field.value === "individual"
                              ? "border-blue-600 bg-blue-50/50 shadow-sm"
                              : "border-transparent bg-white shadow-sm",
                          )}
                        >
                          {field.value === "individual" && (
                            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 fill-blue-600 text-white" />
                          )}
                          <User
                            className={cn(
                              "mb-3 h-6 w-6",
                              field.value === "individual"
                                ? "text-blue-600"
                                : "text-slate-400",
                            )}
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900">
                              Individual
                            </p>
                            <p className="text-xs text-slate-500">
                              Student or Professional
                            </p>
                          </div>
                        </div>

                        {/* Corporate Option */}
                        <div
                          onClick={() => field.onChange("corporate")}
                          className={cn(
                            "relative cursor-pointer rounded-xl border-2 p-4 transition-all",
                            field.value === "corporate"
                              ? "border-blue-600 bg-blue-50/50 shadow-sm"
                              : "border-transparent bg-white shadow-sm",
                          )}
                        >
                          {field.value === "corporate" && (
                            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 fill-blue-600 text-white" />
                          )}
                          <Building2
                            className={cn(
                              "mb-3 h-6 w-6",
                              field.value === "corporate"
                                ? "text-blue-600"
                                : "text-slate-400",
                            )}
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900">
                              Corporate
                            </p>
                            <p className="text-xs text-slate-500">
                              HR & Talent Teams
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Input Fields */}
              <FormField
                control={form.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<FormValues, "fullName">;
                }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-800">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="h-12 border-none bg-[#f0f4ff] px-4 focus-visible:ring-2 focus-visible:ring-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<FormValues, "email">;
                }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-800">
                      Work Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@company.com"
                        {...field}
                        className="h-12 border-none bg-[#f0f4ff] px-4 focus-visible:ring-2 focus-visible:ring-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<FormValues, "password">;
                }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-800">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="h-12 border-none bg-[#f0f4ff] px-4 pr-12 focus-visible:ring-2 focus-visible:ring-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-50 px-4 text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Social */}
              <Button
                variant="outline"
                type="button"
                className="h-12 w-full border-none bg-white font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
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
          </Form>

          {/* Footer Links */}
          <div className="space-y-4 text-center text-sm">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                href="#"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign In to Workspace
              </Link>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400 px-8">
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
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import {
  adminInput,
  adminPage,
  adminPageDesc,
  adminPageTitle,
  adminPrimaryBtn,
  adminSection,
  adminSectionLabel,
} from "@/components/admin/ui/admin-styles";
import {
  getApiErrorMessage,
  updateAdminProfile,
} from "@/lib/admin-auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";

type ThemeChoice = "light" | "dark" | "system";

const THEME_OPTIONS: {
  value: ThemeChoice;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "Bright surfaces for daytime use",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low-glare palette for focused work",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Match your device appearance",
    icon: Monitor,
  },
];

export function AdminSystemConfig() {
  const user = useAdminStore((s) => s.authData.user);
  const setAuthData = useAdminStore((s) => s.setAuthData);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  useEffect(() => {
    setFullName(user?.full_name?.trim() ?? "");
  }, [user?.full_name]);

  const activeTheme = (theme ?? "system") as ThemeChoice;
  const isDemo = useAdminStore((s) => s.authData.token) === "demo-admin-session";

  async function handleSaveName() {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setNameError("Display name is required.");
      return;
    }

    setNameError(null);
    setIsSavingName(true);

    try {
      if (isDemo) {
        const current = useAdminStore.getState().authData;
        if (current.user) {
          setAuthData({
            ...current,
            user: { ...current.user, full_name: trimmed },
          });
        }
        toast.success("Display name updated (demo session).");
        return;
      }

      const updated = await updateAdminProfile({ full_name: trimmed });
      const current = useAdminStore.getState().authData;
      setAuthData({ ...current, user: updated });
      toast.success("Display name saved.");
    } catch (err) {
      setNameError(getApiErrorMessage(err));
    } finally {
      setIsSavingName(false);
    }
  }

  return (
    <div className={adminPage}>
      <div>
        <h1 className={adminPageTitle}>System Config</h1>
        <p className={adminPageDesc}>
          Personal preferences for this admin console. Changes apply to your
          account and browser only.
        </p>
      </div>

      <section className={adminSection}>
        <p className={adminSectionLabel}>Appearance</p>
        <h2 className="mt-1 text-base font-semibold text-foreground">
          Theme
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uses the same setting as the header theme toggle (
          <span className="font-mono text-xs">venturescope-theme</span>
          ).
          {themeMounted && resolvedTheme ? (
            <>
              {" "}
              Currently showing{" "}
              <span className="font-medium text-foreground">
                {resolvedTheme}
              </span>
              .
            </>
          ) : null}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const selected = themeMounted && activeTheme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={!themeMounted}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  selected
                    ? "border-primary/40 bg-primary/10 ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/50",
                )}
                aria-pressed={selected}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={adminSection}>
        <p className={adminSectionLabel}>Profile</p>
        <h2 className="mt-1 text-base font-semibold text-foreground">
          Display name
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown in the admin header and user directory.
        </p>

        <div className="mt-4 max-w-md space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setNameError(null);
              }}
              className={adminInput}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          {nameError ? (
            <p className="text-sm text-destructive">{nameError}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void handleSaveName()}
            disabled={isSavingName}
            className={adminPrimaryBtn}
          >
            {isSavingName ? "Saving…" : "Save name"}
          </button>
        </div>
      </section>
    </div>
  );
}
